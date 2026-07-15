import { pretty as gameVersion } from './version';
import { context } from '@devvit/web/client';

/**
 * Devvit experience version (e.g. "0.0.51"). Only populated inside a Devvit
 * web view — `context` is set synchronously by the Devvit shell before our
 * bundle evaluates (game-entry.ts reads `context.userId` at module load), so
 * reading it here is safe. Returns `undefined` on the standalone site.
 */
export function getDevvitAppVersion(): string | undefined {
	return context?.appVersion;
}

/**
 * Human-readable build label, e.g. "v0.6.0" or "v0.6.0 · devvit 0.0.51".
 * Surfaced in the client so testers can tell an old deployed build from a new
 * one at a glance (Devvit keeps older experience versions live after upload).
 */
export function getClientVersionLabel(): string {
	const devvit = getDevvitAppVersion();
	return devvit ? `${gameVersion} · devvit ${devvit}` : gameVersion;
}
