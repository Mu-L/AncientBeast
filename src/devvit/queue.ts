export interface QueuePlayer {
	playerId: string;
	queuedAt: number;
}

export interface RedisLike {
	zAdd(key: string, ...members: Array<{ member: string; score: number }>): Promise<number>;
	zRange(
		key: string,
		start: number,
		stop: number,
		options?: { by: 'score' | 'rank' },
	): Promise<Array<{ member: string; score: number }>>;
	zRem(key: string, members: string[]): Promise<number>;
	set(key: string, value: string, options?: Record<string, unknown>): Promise<string>;
	get(key: string): Promise<string | undefined>;
	expire(key: string, seconds: number): Promise<void>;
	exists(...keys: string[]): Promise<number>;
	del(...keys: string[]): Promise<void>;
}

export interface LobbyMeta {
	code: string;
	config: Record<string, unknown>;
	status: string;
	hostPeerId: string;
	createdAt: number;
	bot?: boolean;
}

export const QUEUE_KEY = 'ab:queue';
const RECENT_TTL_SECONDS = 86400;
const RECENT_RETRY_MS = 15000;
const MATCHED_TTL_SECONDS = 300;
const QUEUE_TIMEOUT_MS = 30000;

function matchedKey(playerId: string): string {
	return `ab:matched:${playerId}`;
}

function recentKey(playerIdA: string, playerIdB: string): string {
	const [a, b] = [playerIdA, playerIdB].sort();
	return `ab:recent:${a}:${b}`;
}

export async function createLobby(
	redis: RedisLike,
	initialMeta?: Partial<LobbyMeta>,
): Promise<string> {
	const code = crypto.randomUUID().slice(0, 8).toUpperCase();
	const meta: LobbyMeta = {
		code,
		config: {},
		status: 'waiting',
		hostPeerId: '',
		createdAt: Date.now(),
		...initialMeta,
	};
	await redis.set(`ab:lobby:${code}:meta`, JSON.stringify(meta));
	await redis.expire(`ab:lobby:${code}:meta`, 3600);
	return code;
}

export async function getQueuePlayers(redis: RedisLike): Promise<QueuePlayer[]> {
	const entries = await redis.zRange(QUEUE_KEY, 0, -1, { by: 'rank' });
	if (!entries || entries.length === 0) {
		return [];
	}
	return entries.map((entry) => ({
		playerId: entry.member,
		queuedAt: Math.floor(entry.score),
	}));
}

async function isRecentMatch(redis: RedisLike, playerA: string, playerB: string): Promise<boolean> {
	const key = recentKey(playerA, playerB);
	return (await redis.exists(key)) > 0;
}

export async function tryMatchQueue(
	redis: RedisLike,
	options?: { allowBotFallback?: boolean },
): Promise<{ matched: boolean; lobbyCode?: string; bot?: boolean }> {
	const players = await getQueuePlayers(redis);

	if (players.length < 2 && !options?.allowBotFallback) {
		return { matched: false };
	}

	const now = Date.now();

	// Try to find a human match first
	if (players.length >= 2) {
		const sorted = [...players].sort((a, b) => a.queuedAt - b.queuedAt);

		for (const caller of sorted) {
			const candidates = players.filter((p) => p.playerId !== caller.playerId);
			let bestNonRecent: string | undefined;
			let bestRecent: string | undefined;

			for (const candidate of candidates) {
				if (await isRecentMatch(redis, caller.playerId, candidate.playerId)) {
					if (!bestRecent) {
						bestRecent = candidate.playerId;
					}
				} else {
					bestNonRecent = candidate.playerId;
					break;
				}
			}

			let chosen: string | undefined;
			if (bestNonRecent) {
				chosen = bestNonRecent;
			} else if (bestRecent && now - caller.queuedAt >= RECENT_RETRY_MS) {
				chosen = bestRecent;
			}

			if (chosen) {
				await redis.zRem(QUEUE_KEY, [caller.playerId, chosen]);

				const lobbyCode = await createLobby(redis);

				const rKey = recentKey(caller.playerId, chosen);
				await redis.set(rKey, '1');
				await redis.expire(rKey, RECENT_TTL_SECONDS);

				await redis.set(matchedKey(caller.playerId), lobbyCode);
				await redis.expire(matchedKey(caller.playerId), MATCHED_TTL_SECONDS);
				await redis.set(matchedKey(chosen), lobbyCode);
				await redis.expire(matchedKey(chosen), MATCHED_TTL_SECONDS);

				return { matched: true, lobbyCode };
			}
		}
	}

	// Fallback to bot if only one player waiting and they've been waiting long enough
	if (options?.allowBotFallback && players.length === 1) {
		const caller = players[0];
		if (now - caller.queuedAt >= QUEUE_TIMEOUT_MS) {
			await redis.zRem(QUEUE_KEY, [caller.playerId]);

			const lobbyCode = await createLobby(redis, { bot: true });

			await redis.set(matchedKey(caller.playerId), lobbyCode);
			await redis.expire(matchedKey(caller.playerId), MATCHED_TTL_SECONDS);

			return { matched: true, lobbyCode, bot: true };
		}
	}

	return { matched: false };
}

export async function handleQueueJoin(
	redis: RedisLike,
	playerId: string,
): Promise<{ status: string; lobbyCode?: string; bot?: boolean }> {
	const existing = await redis.zRange(QUEUE_KEY, 0, -1, { by: 'rank' });
	const alreadyQueued = existing.some((entry) => entry.member === playerId);

	if (!alreadyQueued) {
		await redis.zAdd(QUEUE_KEY, { member: playerId, score: Date.now() });
	}

	const result = await tryMatchQueue(redis, { allowBotFallback: true });
	if (result.matched && result.lobbyCode) {
		return { status: 'matched', lobbyCode: result.lobbyCode, bot: result.bot };
	}

	return { status: 'waiting' };
}

export async function handleQueueStatus(
	redis: RedisLike,
	playerId: string,
): Promise<{ status: string; lobbyCode?: string; bot?: boolean }> {
	const lobbyCode = await redis.get(matchedKey(playerId));
	if (lobbyCode) {
		const meta = await redis.get(`ab:lobby:${lobbyCode}:meta`);
		if (meta) {
			const parsed = JSON.parse(meta) as LobbyMeta;
			return { status: 'matched', lobbyCode, bot: Boolean(parsed.bot) };
		}
	}
	return { status: 'waiting' };
}
