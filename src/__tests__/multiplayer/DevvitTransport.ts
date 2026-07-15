import { jest, expect, describe, test, beforeEach, afterEach } from '@jest/globals';

import { DevvitTransport } from '../../multiplayer/transport/DevvitTransport';
import { DevvitLobbyProvider } from '../../multiplayer/DevvitLobbyProvider';
import type { GameMessage } from '../../multiplayer/types';

const mockResponse = (body: unknown): Response =>
	({ ok: true, json: async () => body } as unknown as Response);

const mockArrayResponse = (items: unknown[]): Response =>
	({ ok: true, json: async () => items } as unknown as Response);

describe('DevvitTransport', () => {
	let fetchImpl: jest.MockedFunction<typeof fetch>;
	let transport: DevvitTransport;

	beforeEach(() => {
		fetchImpl = jest.fn() as unknown as jest.MockedFunction<typeof fetch>;
		fetchImpl.mockResolvedValue(mockResponse({}));
		(global as unknown as { fetch: typeof fetch }).fetch = fetchImpl as unknown as typeof fetch;
		transport = new DevvitTransport({
			fetchImpl: fetchImpl as unknown as typeof fetch,
			pollIntervalMs: 100,
		});
	});

	afterEach(() => {
		transport.disconnect();
		jest.useRealTimers();
		delete (global as unknown as { fetch?: typeof fetch }).fetch;
	});

	test('connect sends join request and starts polling', async () => {
		fetchImpl
			.mockResolvedValueOnce(mockResponse({ myId: 'player-1', playerIndex: 0, isHost: true }))
			.mockResolvedValueOnce(
				mockArrayResponse([
					{
						cursor: '1',
						from: 'player-1',
						message: { type: 'player-joined', player: { peerId: 'player-1', playerIndex: 0 } },
					},
				]),
			)
			.mockResolvedValueOnce(
				mockResponse({
					players: [{ peerId: 'player-1', playerIndex: 0 }],
					status: 'waiting',
					host: 'player-1',
				}),
			);

		const connectPromise = transport.connect('ABC1', { isHost: true });

		await expect(connectPromise).resolves.toBeUndefined();
		expect(fetchImpl).toHaveBeenCalledWith(
			expect.stringContaining('/api/lobby/ABC1/join'),
			expect.objectContaining({ method: 'POST' }),
		);
		expect(transport.getMyId()).toBe('player-1');
	});

	test('send posts message to server', async () => {
		await transport.send({ type: 'heartbeat', timestamp: Date.now(), playerId: 'player-1' });

		expect(fetchImpl).toHaveBeenCalledWith(
			expect.stringContaining('/api/lobby/'),
			expect.objectContaining({
				method: 'POST',
				body: expect.stringContaining('heartbeat'),
			}),
		);
	});

	test('disconnect stops polling and sends leave', async () => {
		transport.disconnect();

		expect(fetchImpl).toHaveBeenCalledWith(
			expect.stringContaining('/leave'),
			expect.objectContaining({ method: 'POST' }),
		);
	});
});

describe('DevvitLobbyProvider', () => {
	let fetchImpl: jest.MockedFunction<typeof fetch>;
	let mockTransport: jest.Mocked<DevvitTransport>;
	let provider: DevvitLobbyProvider;

	beforeEach(() => {
		fetchImpl = jest.fn() as unknown as jest.MockedFunction<typeof fetch>;
		fetchImpl.mockResolvedValue(mockResponse({}));
		(global as unknown as { fetch: typeof fetch }).fetch = fetchImpl as unknown as typeof fetch;

		mockTransport = {
			connect: jest.fn(async () => {}),
			disconnect: jest.fn(),
			send: jest.fn(async () => {}),
			sendTo: jest.fn(async () => {}),
			sendExcept: jest.fn(async () => {}),
			onMessage: jest.fn(),
			onPeerJoin: jest.fn(),
			onPeerLeave: jest.fn(),
			onConnected: jest.fn(),
			getMyId: jest.fn(() => 'player-1'),
			isHostPeer: jest.fn(() => false),
		} as unknown as jest.Mocked<DevvitTransport>;

		provider = new DevvitLobbyProvider(mockTransport);
	});

	afterEach(() => {
		provider.leaveLobby();
		jest.useRealTimers();
		delete (global as unknown as { fetch?: typeof fetch }).fetch;
	});

	test('createLobby creates lobby and sets host', async () => {
		fetchImpl
			.mockResolvedValueOnce(mockResponse({ code: 'ABC1' }))
			.mockResolvedValueOnce(mockResponse({ myId: 'player-1', playerIndex: 0, isHost: true }))
			.mockResolvedValueOnce(
				mockResponse({
					players: [{ peerId: 'player-1', playerIndex: 0 }],
					status: 'waiting',
					host: 'player-1',
				}),
			)
			.mockResolvedValueOnce(
				mockArrayResponse([
					{
						cursor: '1',
						from: 'player-1',
						message: { type: 'player-joined', player: { peerId: 'player-1', playerIndex: 0 } },
					},
				]),
			)
			.mockResolvedValueOnce(
				mockResponse({
					players: [{ peerId: 'player-1', playerIndex: 0 }],
					status: 'waiting',
					host: 'player-1',
				}),
			);

		const session = await provider.createLobby({
			gameMode: 2,
			creaLimitNbr: 3,
			unitDrops: 1,
			abilityUpgrades: 3,
			plasma_amount: 30,
			turnTimePool: -1,
			timePool: -1,
			background_image: 'default',
		});

		expect(session.code).toBe('ABC1');
		expect(provider.isHost()).toBe(true);
	});

	test('match-start updates state and fires handler', () => {
		(provider as unknown as { isHostFlag: boolean }).isHostFlag = true;
		(provider as unknown as { state: unknown }).state = {
			code: 'ABC1',
			host: 'player-1',
			hostPeerId: 'player-1',
			players: [{ playerId: 'player-1', peerId: 'player-1', name: 'player-1', playerIndex: 0 }],
			config: {
				gameMode: 2,
				creaLimitNbr: 3,
				unitDrops: 1,
				abilityUpgrades: 3,
				plasma_amount: 30,
				turnTimePool: -1,
				timePool: -1,
				background_image: 'default',
			},
			status: 'waiting',
		};

		const matchStartMessage: GameMessage = {
			type: 'match-start',
			config: {
				gameMode: 2,
				creaLimitNbr: 3,
				unitDrops: 1,
				abilityUpgrades: 3,
				plasma_amount: 30,
				turnTimePool: -1,
				timePool: -1,
				background_image: 'default',
			},
			players: [{ playerId: 'player-1', peerId: 'player-1', name: 'player-1', playerIndex: 0 }],
			host: 'player-1',
			hostPeerId: 'player-1',
		};

		const handler = jest.fn();
		provider.onGameMessage(handler);

		mockTransport.getMyId.mockReturnValue('player-1');
		(
			provider as unknown as {
				handleTransportMessage: (m: GameMessage, p: string) => void;
			}
		).handleTransportMessage(matchStartMessage, 'player-1');

		expect(provider.getLobbyState().status).toBe('playing');
		expect(handler).toHaveBeenCalledWith(matchStartMessage);
	});

	test('drops self-originated action messages (no local duplicate)', () => {
		const handler = jest.fn();
		provider.onGameMessage(handler);

		const abilityMessage: GameMessage = {
			type: 'action-ability',
			id: 3,
			target: { type: 'hex', x: 5, y: 5 },
			args: [],
			playerId: 'player-1',
			creatureId: 1,
		};

		// Echoed back from the server, originated by this same client.
		(
			provider as unknown as { handleTransportMessage: (m: GameMessage, p: string) => void }
		).handleTransportMessage(abilityMessage, 'player-1');

		expect(handler).not.toHaveBeenCalled();
	});

	test('applies action messages from other players', () => {
		const handler = jest.fn();
		provider.onGameMessage(handler);

		const abilityMessage: GameMessage = {
			type: 'action-ability',
			id: 3,
			target: { type: 'hex', x: 5, y: 5 },
			args: [],
			playerId: 'player-2',
			creatureId: 2,
		};

		(
			provider as unknown as { handleTransportMessage: (m: GameMessage, p: string) => void }
		).handleTransportMessage(abilityMessage, 'player-2');

		expect(handler).toHaveBeenCalledWith(abilityMessage);
	});
});
