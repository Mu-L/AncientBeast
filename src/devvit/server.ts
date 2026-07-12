import { createServer, getServerPort } from '@devvit/server';
import { redis } from '@devvit/redis';
import type { IncomingMessage } from 'node:http';
import { createLobby, handleQueueJoin, handleQueueStatus, tryMatchQueue } from './queue';
import type { LobbyMeta } from './queue';

const LOBBY_PREFIX = 'ab:lobby';
const LOG_MAX_LENGTH = 256;
const HEARTBEAT_TIMEOUT_MS = 10000;
const PLAYER_TTL_SECONDS = 3600;

interface PlayerRecord {
	peerId: string;
	playerId: string;
	name: string;
	playerIndex: number;
	lastSeen: number;
}

interface MessageEntry {
	cursor: string;
	from: string;
	message: Record<string, unknown>;
}

function lobbyMetaKey(code: string): string {
	return `${LOBBY_PREFIX}:${code}:meta`;
}

function lobbyPlayersKey(code: string): string {
	return `${LOBBY_PREFIX}:${code}:players`;
}

function lobbyLogKey(code: string): string {
	return `${LOBBY_PREFIX}:${code}:log`;
}

function lobbyCursorKey(code: string): string {
	return `${LOBBY_PREFIX}:${code}:cursor`;
}

function lobbyLastSeenKey(code: string, peerId: string): string {
	return `${LOBBY_PREFIX}:${code}:lastSeen:${peerId}`;
}

async function getLobbyMeta(code: string): Promise<LobbyMeta | null> {
	const raw = await redis.get(lobbyMetaKey(code));
	if (!raw) {
		return null;
	}
	return JSON.parse(raw) as LobbyMeta;
}

async function setLobbyMeta(code: string, meta: LobbyMeta): Promise<void> {
	await redis.set(lobbyMetaKey(code), JSON.stringify(meta));
	await redis.expire(lobbyMetaKey(code), PLAYER_TTL_SECONDS);
}

async function getPlayers(code: string): Promise<PlayerRecord[]> {
	const raw = await redis.hGetAll(lobbyPlayersKey(code));
	if (!raw || Object.keys(raw).length === 0) {
		return [];
	}

	const players: PlayerRecord[] = [];
	for (const peerId of Object.keys(raw)) {
		players.push(JSON.parse(raw[peerId]) as PlayerRecord);
	}
	return players;
}

async function setPlayer(code: string, player: PlayerRecord): Promise<void> {
	await redis.hSet(lobbyPlayersKey(code), { [player.peerId]: JSON.stringify(player) });
	await redis.expire(lobbyPlayersKey(code), PLAYER_TTL_SECONDS);
}

async function removePlayer(code: string, peerId: string): Promise<void> {
	await redis.hDel(lobbyPlayersKey(code), [peerId]);
	await redis.del(lobbyLastSeenKey(code, peerId));
	await redis.expire(lobbyPlayersKey(code), PLAYER_TTL_SECONDS);
}

async function appendMessage(
	code: string,
	from: string,
	message: Record<string, unknown>,
): Promise<string> {
	const cursorKey = lobbyCursorKey(code);
	let cursor = await redis.get(cursorKey);
	if (!cursor) {
		cursor = '0';
	}
	const nextCursor = Number(cursor) + 1;

	const entry: MessageEntry = {
		cursor: String(nextCursor),
		from,
		message,
	};

	await redis.zAdd(lobbyLogKey(code), { score: nextCursor, member: JSON.stringify(entry) });
	await redis.zRemRangeByRank(lobbyLogKey(code), 0, -LOG_MAX_LENGTH - 1);
	await redis.set(cursorKey, String(nextCursor));

	await redis.expire(lobbyLogKey(code), PLAYER_TTL_SECONDS);
	await redis.expire(cursorKey, PLAYER_TTL_SECONDS);

	return String(nextCursor);
}

async function getMessages(code: string, after: string): Promise<MessageEntry[]> {
	const afterNum = Number(after) || 0;
	const raw = await redis.zRange(lobbyLogKey(code), afterNum + 1, '+inf', { by: 'score' });

	if (!raw || raw.length === 0) {
		return [];
	}

	const entries: MessageEntry[] = [];
	for (const item of raw) {
		const entry = JSON.parse(item.member) as MessageEntry;
		entries.push(entry);
	}
	return entries;
}

async function refreshTtl(code: string): Promise<void> {
	await redis.expire(lobbyMetaKey(code), PLAYER_TTL_SECONDS);
	await redis.expire(lobbyPlayersKey(code), PLAYER_TTL_SECONDS);
	await redis.expire(lobbyLogKey(code), PLAYER_TTL_SECONDS);
	await redis.expire(lobbyCursorKey(code), PLAYER_TTL_SECONDS);
}

async function isPlayerStale(code: string, peerId: string): Promise<boolean> {
	const lastSeenRaw = await redis.get(lobbyLastSeenKey(code, peerId));
	if (!lastSeenRaw) {
		return true;
	}
	const lastSeen = Number(lastSeenRaw);
	return Date.now() - lastSeen > HEARTBEAT_TIMEOUT_MS;
}

async function markPlayerSeen(code: string, peerId: string): Promise<void> {
	await redis.set(lobbyLastSeenKey(code, peerId), String(Date.now()));
	await redis.expire(lobbyLastSeenKey(code, peerId), PLAYER_TTL_SECONDS);
}

async function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
	const chunks: Buffer[] = [];
	for await (const chunk of req) {
		chunks.push(Buffer.from(chunk));
	}
	const body = Buffer.concat(chunks).toString('utf-8');
	if (!body) {
		return {};
	}
	try {
		return JSON.parse(body) as Record<string, unknown>;
	} catch {
		return {};
	}
}

const server = createServer(async (req, res) => {
	const url = new URL(req.url || '/', `http://${req.headers.host}`);

	res.setHeader('Content-Type', 'application/json');

	if (req.method === 'OPTIONS') {
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
		res.writeHead(204);
		res.end();
		return;
	}

	try {
		if (url.pathname === '/api/lobby' && req.method === 'POST') {
			const body = await readJsonBody(req);
			const code =
				String(body.code || '')
					.trim()
					.toUpperCase()
					.replace(/[^A-Z0-9-]/g, '') || crypto.randomUUID().slice(0, 8).toUpperCase();

			const meta: LobbyMeta = {
				code,
				config: {},
				status: 'waiting',
				hostPeerId: '',
				createdAt: Date.now(),
			};
			await setLobbyMeta(code, meta);

			res.writeHead(200);
			res.end(JSON.stringify({ code }));
			return;
		}

		const lobbyMatch = url.pathname.match(/^\/api\/lobby\/([^/]+)\/?$/);
		if (lobbyMatch && req.method === 'POST') {
			const code = lobbyMatch[1];
			const body = await readJsonBody(req);

			const meta = await getLobbyMeta(code);
			if (!meta) {
				res.writeHead(404);
				res.end(JSON.stringify({ error: 'Lobby not found' }));
				return;
			}

			const myId = crypto.randomUUID();
			const players = await getPlayers(code);
			let playerIndex = -1;

			if (body.isHost) {
				meta.hostPeerId = myId;
				playerIndex = 0;
				await setLobbyMeta(code, meta);
			} else {
				const usedIndexes = new Set(players.map((p) => p.playerIndex));
				for (let i = 1; i < 8; i += 1) {
					if (!usedIndexes.has(i)) {
						playerIndex = i;
						break;
					}
				}
			}

			const player: PlayerRecord = {
				peerId: myId,
				playerId: myId,
				name: String(body.name || myId),
				playerIndex,
				lastSeen: Date.now(),
			};

			await setPlayer(code, player);
			await markPlayerSeen(code, myId);
			await refreshTtl(code);

			if (meta.bot) {
				const currentPlayers = await getPlayers(code);
				const realPlayers = currentPlayers.filter((p) => !p.playerId.startsWith('bot-'));
				if (realPlayers.length === 1) {
					const botPlayerId = `bot-${code}`;
					const botPeerId = `bot-${code}`;
					const usedIndexes = new Set(currentPlayers.map((p) => p.playerIndex));
					let botPlayerIndex = -1;
					for (let i = 1; i < 8; i += 1) {
						if (!usedIndexes.has(i)) {
							botPlayerIndex = i;
							break;
						}
					}

					const botPlayer: PlayerRecord = {
						peerId: botPeerId,
						playerId: botPlayerId,
						name: 'CPU',
						playerIndex: botPlayerIndex,
						lastSeen: Date.now(),
					};

					await setPlayer(code, botPlayer);

					await appendMessage(code, botPeerId, {
						type: 'player-joined',
						player: {
							playerId: botPlayer.playerId,
							peerId: botPlayer.peerId,
							name: botPlayer.name,
							playerIndex: botPlayer.playerIndex,
						},
					});
				}
			}

			await appendMessage(code, myId, {
				type: 'player-joined',
				player: {
					playerId: player.playerId,
					peerId: player.peerId,
					name: player.name,
					playerIndex: player.playerIndex,
				},
			});

			res.writeHead(200);
			res.end(JSON.stringify({ myId, playerIndex, isHost: Boolean(body.isHost) }));
			return;
		}

		if (url.pathname.startsWith('/api/lobby/') && req.method === 'POST') {
			const parts = url.pathname.split('/');
			const code = parts[3];
			const action = parts[4];

			if (action === 'message') {
				const body = await readJsonBody(req);
				const from = String(body.playerId || 'unknown');

				const meta = await getLobbyMeta(code);
				if (!meta) {
					res.writeHead(404);
					res.end(JSON.stringify({ error: 'Lobby not found' }));
					return;
				}

				const cursor = await appendMessage(code, from, body.message as Record<string, unknown>);
				await markPlayerSeen(code, from);
				await refreshTtl(code);

				res.writeHead(200);
				res.end(JSON.stringify({ cursor }));
				return;
			}

			if (action === 'start') {
				const meta = await getLobbyMeta(code);
				if (!meta) {
					res.writeHead(404);
					res.end(JSON.stringify({ error: 'Lobby not found' }));
					return;
				}

				meta.status = 'playing';
				await setLobbyMeta(code, meta);

				const players = await getPlayers(code);

				await appendMessage(code, meta.hostPeerId, {
					type: 'match-start',
					config: meta.config,
					players: players.map((p) => ({
						playerId: p.playerId,
						peerId: p.peerId,
						name: p.name,
						playerIndex: p.playerIndex,
						isBot: p.playerId.startsWith('bot-'),
					})),
					host: meta.hostPeerId,
					hostPeerId: meta.hostPeerId,
				});

				await refreshTtl(code);

				res.writeHead(200);
				res.end(JSON.stringify({ ok: true }));
				return;
			}

			if (action === 'leave') {
				const body = await readJsonBody(req);
				const from = String(body.playerId || 'unknown');
				await removePlayer(code, from);

				const players = await getPlayers(code);
				if (players.length === 0) {
					await redis.del(lobbyMetaKey(code));
					await redis.del(lobbyPlayersKey(code));
					await redis.del(lobbyLogKey(code));
					await redis.del(lobbyCursorKey(code));
				} else {
					await appendMessage(code, from, {
						type: 'player-left',
						playerId: from,
						player: {
							playerId: from,
							peerId: from,
							name: from,
							playerIndex: -1,
						},
					});
				}

				await refreshTtl(code);

				res.writeHead(200);
				res.end(JSON.stringify({ ok: true }));
				return;
			}

			res.writeHead(404);
			res.end(JSON.stringify({ error: 'Not found' }));
			return;
		}

		if (url.pathname.startsWith('/api/lobby/') && req.method === 'GET') {
			const parts = url.pathname.split('/');
			const code = parts[3];
			const action = parts[4];

			if (action === 'messages') {
				const after = url.searchParams.get('after') || '0';
				const playerId = url.searchParams.get('playerId');
				if (playerId) {
					await markPlayerSeen(code, playerId);
				}
				const entries = await getMessages(code, after);

				res.writeHead(200);
				res.end(JSON.stringify(entries));
				return;
			}

			if (action === 'state') {
				const playerId = url.searchParams.get('playerId');
				if (playerId) {
					await markPlayerSeen(code, playerId);
				}
				const meta = await getLobbyMeta(code);
				if (!meta) {
					res.writeHead(404);
					res.end(JSON.stringify({ error: 'Lobby not found' }));
					return;
				}

				let players = await getPlayers(code);
				const activePlayers: PlayerRecord[] = [];

				for (const player of players) {
					if (!(await isPlayerStale(code, player.peerId))) {
						activePlayers.push(player);
					}
				}

				if (activePlayers.length !== players.length) {
					for (const stale of players) {
						if (activePlayers.find((p) => p.peerId === stale.peerId)) {
							continue;
						}
						await removePlayer(code, stale.peerId);
					}
					players = activePlayers;
				}

				await refreshTtl(code);

				res.writeHead(200);
				res.end(
					JSON.stringify({
						players: players.map((p) => ({
							peerId: p.peerId,
							playerId: p.playerId,
							name: p.name,
							playerIndex: p.playerIndex,
						})),
						config: meta.config,
						status: meta.status,
						host: meta.hostPeerId,
						hostPlayerId: meta.hostPeerId,
					}),
				);
				return;
			}

			res.writeHead(404);
			res.end(JSON.stringify({ error: 'Not found' }));
			return;
		}

		if (url.pathname === '/internal/queue/join' && req.method === 'POST') {
			const body = await readJsonBody(req);
			const playerId = String(body.playerId || '');

			if (!playerId) {
				res.writeHead(400);
				res.end(JSON.stringify({ error: 'playerId is required' }));
				return;
			}

			const result = await handleQueueJoin(redis, playerId);

			res.writeHead(200);
			res.end(JSON.stringify(result));
			return;
		}

		if (url.pathname === '/api/queue/status' && req.method === 'GET') {
			const playerId = url.searchParams.get('playerId') || '';

			if (!playerId) {
				res.writeHead(400);
				res.end(JSON.stringify({ error: 'playerId is required' }));
				return;
			}

			const result = await handleQueueStatus(redis, playerId);

			res.writeHead(200);
			res.end(JSON.stringify(result));
			return;
		}

		res.writeHead(404);
		res.end(JSON.stringify({ error: 'Not found' }));
	} catch (error) {
		console.error('Server error:', error);
		res.writeHead(500);
		res.end(JSON.stringify({ error: 'Internal server error' }));
	}
});

server.listen(getServerPort(), () => {
	console.log(`Devvit server listening on port ${getServerPort()}`);
});
