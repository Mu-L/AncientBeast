import type { AbilityTarget } from '../multiplayer/types';

/**
 * Authoritative-server message shapes.
 *
 * The whole point of moving to a server-authoritative model is that clients stop
 * recomputing game logic and instead send *intents* (inputs) which the server
 * applies through the one real engine. Because the engine is fully deterministic
 * (no in-game RNG — the only randomness is the cosmetic start-location pick,
 * which is part of the agreed initial config), an ordered `Intent` log replayed
 * through the engine yields identical state on every client.
 */

/**
 * A client->server input. This is intentionally the same shape the engine's own
 * saved-gamelog replay already understands (`Game.action()`), so the server just
 * forwards it straight into the engine instead of re-deriving anything.
 */
export type Intent =
	| { kind: 'skip' }
	| { kind: 'delay' }
	| { kind: 'move'; target: { x: number; y: number }; path?: Array<{ x: number; y: number }> }
	| { kind: 'ability'; id: number; target: AbilityTarget; args: unknown[] };

export interface CreatureSnapshot {
	id: number;
	type: string;
	name: string;
	x: number;
	y: number;
	health: number;
	maxHealth: number;
	energy: number;
	maxEnergy: number;
	dead: boolean;
	vaporized: boolean;
	remainingMove: number;
	playerIndex: number | null;
	status: {
		frozen: boolean;
		dizzy: boolean;
		cryostasis: boolean;
	};
}

export interface PlayerSnapshot {
	playerIndex: number;
	controller: string;
	score: number;
}

export interface AuthoritativeState {
	turn: number;
	round: number;
	gameState: string;
	activeCreatureId: number | null;
	players: PlayerSnapshot[];
	creatures: CreatureSnapshot[];
	queue: number[];
}
