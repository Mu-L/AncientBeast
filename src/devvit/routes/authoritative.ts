/* eslint-disable @typescript-eslint/no-explicit-any */
import { Hono } from 'hono';
import { getLobbyMeta } from '../lobby';
import { LobbyEngine } from '../../devvit/authoritativeEngine';
import type { Intent } from '../../devvit/authoritativeTypes';

/**
 * PROTOTYPE route for the authoritative server.
 *
 * Mount with:  app.route('/api/authoritative', authoritative);
 *
 * Flow:
 *   POST /:code/step  { intent }  -> server applies the intent through the real
 *                                    engine, returns the authoritative state.
 *   GET  /:code/state              -> current authoritative state.
 *
 * The in-memory engine registry below is illustrative only. On Devvit's
 * serverless runtime a new process handles each request, so production should
 * persist the ordered `Intent` log (e.g. in Redis, alongside the existing
 * message log) and reconstruct via `LobbyEngine.fromLog(config, log)` — the
 * engine is deterministic, so replay reproduces client state exactly.
 */
export const authoritative = new Hono();

const engines = new Map<string, LobbyEngine>();

authoritative.post('/:code/step', async (c) => {
	const code = c.req.param('code');
	let engine = engines.get(code);

	if (!engine) {
		const meta = await getLobbyMeta(code);
		if (!meta) return c.json({ error: 'Lobby not found' }, 404);
		engine = await LobbyEngine.create(meta.config as any);
		engines.set(code, engine);
	}

	const body = await c.req.json().catch(() => ({} as Record<string, unknown>));
	const intent = body.intent as Intent;
	if (!intent || typeof intent.kind !== 'string') {
		return c.json({ error: 'Missing or invalid intent' }, 400);
	}

	const state = await engine.step(intent);
	return c.json({ state, sequence: engine.sequence });
});

authoritative.get('/:code/state', async (c) => {
	const code = c.req.param('code');
	const engine = engines.get(code);
	if (!engine) return c.json({ error: 'No engine for lobby' }, 404);
	return c.json({ state: engine.getState(), sequence: engine.sequence });
});
