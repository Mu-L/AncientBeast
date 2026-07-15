export type PeerId = string;
export type LobbyCode = string;
export type PlayerId = string;

export type GameConfig = {
	gameMode: number;
	creaLimitNbr: number;
	unitDrops: number;
	abilityUpgrades: number;
	plasma_amount: number;
	turnTimePool: number;
	timePool: number;
	background_image: string;
};

export type AbilityTarget =
	| { type: 'hex'; x: number; y: number }
	| { type: 'creature'; crea: number }
	| { type: 'array'; array: Array<{ x: number; y: number }> };

export type GameMessage =
	| { type: 'player-joined'; player: LobbyPlayer }
	| { type: 'lobby-joined'; player: LobbyPlayer }
	| { type: 'player-left'; playerId: PlayerId; player: LobbyPlayer }
	| {
			type: 'match-start';
			config: GameConfig;
			players: LobbyPlayer[];
			host: PlayerId;
			hostPeerId: PeerId;
	  }
	| { type: 'match-loaded'; playerId?: PlayerId }
	| { type: 'turn-update'; playerId: PlayerId; creatureId: number }
	| { type: 'action-end'; action: 'skip' | 'delay'; playerId: PlayerId; creatureId: number }
	| {
			type: 'action-move';
			target: { x: number; y: number };
			playerId: PlayerId;
			creatureId: number;
	  }
	| {
			type: 'action-ability';
			id: number;
			target: AbilityTarget;
			args: unknown[];
			playerId: PlayerId;
			creatureId: number;
	  }
	| { type: 'heartbeat'; timestamp: number; playerId: PlayerId };

export interface TransportConnectOptions {
	isHost?: boolean;
	hostPeerId?: PeerId;
}

export interface ITransport {
	connect(lobbyId: string, options?: TransportConnectOptions): Promise<void>;
	disconnect(): void;
	send(data: GameMessage): Promise<void>;
	sendTo(peerId: PeerId, data: GameMessage): Promise<void>;
	sendExcept(peerId: PeerId, data: GameMessage): Promise<void>;
	onMessage(cb: (data: GameMessage, peerId: PeerId) => void): void;
	onPeerJoin(cb: (peerId: PeerId) => void): void;
	onPeerLeave(cb: (peerId: PeerId) => void): void;
	onConnected(cb: (peerId: PeerId) => void): void;
	getMyId(): string;
}

export interface LobbyPlayer {
	playerId: PlayerId;
	peerId: PeerId;
	name: string;
	playerIndex: number;
	isBot?: boolean;
}

export interface LobbySession {
	code: LobbyCode;
	host: PeerId;
	hostPlayerId: PlayerId;
	players: LobbyPlayer[];
	config: GameConfig;
	status: LobbyStatus;
	myPlayer: LobbyPlayer;
}

export type LobbyStatus = 'idle' | 'waiting' | 'playing' | 'ended';

export interface LobbyState {
	code: LobbyCode;
	host: PlayerId;
	hostPeerId: PeerId;
	players: LobbyPlayer[];
	config: GameConfig;
	status: LobbyStatus;
}

export interface INetworkBackend {
	createLobby(config: GameConfig, code?: LobbyCode): Promise<LobbySession>;
	joinLobby(code: LobbyCode): Promise<LobbySession>;
	leaveLobby(): void;
	isHost(): boolean;
	getLobbyState(): LobbyState;
	getLocalPlayer(): LobbyPlayer | undefined;
	markMatchStarted(): void;
	sendGameMessage(message: GameMessage): Promise<void>;
	onLobbyUpdate(cb: (lobby: LobbyState) => void): void;
	onGameMessage(cb: (message: GameMessage) => void): void;
}

export function normalizeLobbyCode(code: LobbyCode): string {
	return code
		.trim()
		.toUpperCase()
		.replace(/[^A-Z0-9-]/g, '');
}

export function getPeerIdForLobby(code: LobbyCode): PeerId {
	return `ab-lobby-${normalizeLobbyCode(code).replace(/-/g, '')}`;
}

export function generateLobbyCode(): LobbyCode {
	const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
	let code = '';
	for (let index = 0; index < 4; index += 1) {
		code += alphabet[Math.floor(Math.random() * alphabet.length)];
	}
	return `AB-${code.slice(0, 2)}${code.slice(2)}`;
}

export function isActionMessage(message: GameMessage): boolean {
	return (
		message.type === 'action-end' ||
		message.type === 'action-move' ||
		message.type === 'action-ability'
	);
}

/**
 * Action messages that the originating client already applies locally before
 * sending (e.g. Ability.animation -> animation2 -> activate -> summon for
 * materialize). In relay-based backends (Devvit) the server echoes every message
 * back to its sender, so the receiver must skip these self-originated echoes to
 * avoid applying the same effect twice (stacked units, duplicate moves, etc.).
 * Peer mode sidesteps this with sendExcept(sender). `turn-update` is deliberately
 * excluded: it only re-activates a creature and is idempotent, so letting the
 * self-echo through is harmless and avoids any turn-sync edge cases.
 */
export function isSelfAppliedActionMessage(message: GameMessage): boolean {
	return isActionMessage(message);
}
