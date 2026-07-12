/*
 * Ancient Beast Plasma Field effect (Dark Priest shield).
 *
 * Procedural Phaser CE egg-surface plasma shader, ported from the standalone
 * `ancient_beast_plasma_field_v52_blockspeed_default_060_demo` demo. It is shown
 * around non-active Dark Priests (human or bot) that still have plasma points,
 * visualising the Plasma Field passive ability.
 *
 * The effect renders into a BitmapData and is attached as a sprite child of the
 * creature's group so it tracks the Dark Priest automatically. A short-lived
 * burst flash is triggered whenever the shield counters an attack.
 */

import type { Creature } from './creature';

export interface PlasmaFieldSettings {
	transparency: number;
	skin: number;
	wrap3d: number;
	density: number;
	thickness: number;
	flowSpeed: number;
	contrast: number;
	backSurface: number;
	blockPower: number;
	blockSpeed: number;
	bottomFade: number;
	bottomFadeCurve: number;
	blockOutline: number;
	scaleX: number;
	scaleY: number;
	hueShift: number;
	crtPixelate: boolean;
}

export interface PlasmaFieldOptions extends Partial<PlasmaFieldSettings> {
	width?: number;
	height?: number;
	radiusX?: number;
	radiusY?: number;
	alpha?: number;
	fps?: number;
	renderScale?: number;
	parent?: Phaser.Group;
	creature?: Creature;
}

const DEFAULT_SETTINGS: PlasmaFieldSettings = {
	transparency: 1.0,
	skin: 1.11,
	wrap3d: 0.65,
	density: 0.65,
	thickness: 0.7,
	flowSpeed: 0.25,
	contrast: 1.03,
	backSurface: 0.6,
	blockPower: 1.0,
	blockSpeed: 0.6,
	bottomFade: 0.11,
	bottomFadeCurve: 1.0,
	blockOutline: 1.6,
	scaleX: 1.25,
	scaleY: 1.4,
	hueShift: 0.0,
	crtPixelate: true,
};

function clamp(v: number, lo: number, hi: number): number {
	return Math.max(lo, Math.min(hi, v));
}

function sin(v: number): number {
	return Math.sin(v);
}

function exp(v: number): number {
	return Math.exp(v);
}

function pow(v: number, p: number): number {
	return Math.pow(v, p);
}

function smoothstep(a: number, b: number, x: number): number {
	x = clamp((x - a) / (b - a), 0, 1);
	return x * x * (3 - 2 * x);
}

function hueRotateRgb(
	r: number,
	g: number,
	b: number,
	degrees: number,
): { r: number; g: number; b: number } {
	if (!degrees) return { r: r, g: g, b: b };

	const a = (degrees * Math.PI) / 180;
	const c = Math.cos(a);
	const s = Math.sin(a);

	// Luminance-preserving hue rotation matrix.
	return {
		r:
			(0.213 + c * 0.787 - s * 0.213) * r +
			(0.715 - c * 0.715 - s * 0.715) * g +
			(0.072 - c * 0.072 + s * 0.928) * b,
		g:
			(0.213 - c * 0.213 + s * 0.143) * r +
			(0.715 + c * 0.285 + s * 0.14) * g +
			(0.072 - c * 0.072 - s * 0.283) * b,
		b:
			(0.213 - c * 0.213 - s * 0.787) * r +
			(0.715 - c * 0.715 + s * 0.715) * g +
			(0.072 + c * 0.928 + s * 0.072) * b,
	};
}

// ─── Shared animation ticker ─────────────────────────────────────────────────
// All Plasma Fields share a single Phaser timer so the cost of animating
// several shields at once (e.g. a 2v2 where each side hovers the active
// Dark Priest) stays bounded instead of multiplying per-field timers.
let _sharedTimer: Phaser.TimerEvent | null = null;
let _sharedPhaser: Phaser.Game | null = null;
const _activeFields = new Set<PlasmaField>();

const SHARED_FPS_BASE = 24;
const SHARED_FPS_BUSY = 16;

function _tickAllFields(): void {
	// Reduce the animation rate when several shields animate at once so the
	// game's frame rate does not dip while a 4th field is briefly shown.
	const fps = _activeFields.size > 2 ? SHARED_FPS_BUSY : SHARED_FPS_BASE;
	if (_sharedTimer && _sharedTimer.delay !== Phaser.Timer.SECOND / fps) {
		_sharedTimer.delay = Phaser.Timer.SECOND / fps;
	}
	for (const field of _activeFields) {
		if (field.sprite.visible && field.sprite.inCamera !== false) {
			field.tick();
		}
	}
}

function _ensureTicker(): void {
	if (_sharedTimer || !_sharedPhaser) return;
	_sharedTimer = _sharedPhaser.time.events.loop(
		Phaser.Timer.SECOND / SHARED_FPS_BASE,
		_tickAllFields,
	);
}

function _resetSharedState(): void {
	// Clear all module-level shared state so a new match can register fields
	// against a fresh Phaser instance. Called automatically on phaser mismatch.
	if (_sharedTimer && _sharedPhaser) {
		try {
			_sharedPhaser.time.events.remove(_sharedTimer);
		} catch {
			// Old Phaser instance is already destroyed; ignore.
		}
	}
	_sharedTimer = null;
	_sharedPhaser = null;
	_activeFields.clear();
}

function _registerField(field: PlasmaField): void {
	// If our cached phaser is stale (match was restarted), reset everything.
	if (_sharedPhaser && _sharedPhaser !== field.phaser) {
		_resetSharedState();
	}
	_sharedPhaser = field.phaser;
	_activeFields.add(field);
	_ensureTicker();
}

function _unregisterField(field: PlasmaField): void {
	_activeFields.delete(field);
	if (_activeFields.size === 0 && _sharedTimer) {
		if (_sharedPhaser) {
			try {
				_sharedPhaser.time.events.remove(_sharedTimer);
			} catch {
				// Old Phaser instance is already destroyed; ignore.
			}
		}
		_sharedTimer = null;
	}
}

export class PlasmaField {
	readonly phaser: Phaser.Game;
	private w: number;
	private h: number;
	private cx: number;
	private cy: number;
	private rx: number;
	private ry: number;

	private renderScale: number;
	private rw: number;
	private rh: number;

	private alpha: number;
	private frame: number;
	private time: number;
	private burstPower: number;
	private outlinePower: number;
	private settings: PlasmaFieldSettings;
	private lowCtx: CanvasRenderingContext2D;
	private bmd: Phaser.BitmapData;
	private low: HTMLCanvasElement;
	private _imgData: ImageData;
	private parent: Phaser.Group;
	readonly sprite: Phaser.Sprite;
	private creature: Creature | null;
	onBurstEnd: (() => void) | null;
	private fps: number;

	constructor(phaser: Phaser.Game, x: number, y: number, opt: PlasmaFieldOptions = {}) {
		this.phaser = phaser;
		this.w = opt.width || 192;
		this.h = opt.height || 256;
		this.cx = this.w / 2;
		this.cy = this.h / 2;
		this.rx = opt.radiusX || 58;
		this.ry = opt.radiusY || 94;

		this.renderScale = opt.renderScale || 1;
		this.rw = Math.floor(this.w / this.renderScale);
		this.rh = Math.floor(this.h / this.renderScale);

		this.alpha = opt.alpha == null ? 0.94 : opt.alpha;
		this.frame = 0;
		this.time = 0;
		this.burstPower = 0;
		this.outlinePower = 0;
		this.fps = opt.fps || 24;

		this.settings = { ...DEFAULT_SETTINGS, ...opt };

		this.parent = opt.parent || phaser.world;
		this.creature = opt.creature || null;
		this.onBurstEnd = null;

		this.low = document.createElement('canvas');
		this.low.width = this.rw;
		this.low.height = this.rh;
		this.lowCtx = this.low.getContext('2d', { willReadFrequently: true })!;
		this._imgData = this.lowCtx.createImageData(this.rw, this.rh);

		this.bmd = phaser.add.bitmapData(this.w, this.h);
		this.sprite = this.parent.create
			? (this.parent.create(x, y, this.bmd) as Phaser.Sprite)
			: phaser.add.sprite(x, y, this.bmd);
		this.sprite.anchor.set(0.5);
		this.sprite.scale.set(this.settings.scaleX, this.settings.scaleY);
		this.sprite.alpha = this.alpha;
		this.sprite.blendMode = Phaser.blendModes.ADD;

		_registerField(this);
	}

	private band(s: number, center: number, width: number): number {
		return exp(-pow((s - center) / width, 2));
	}

	get burstPowerVisible(): number {
		return this.burstPower + this.outlinePower;
	}

	private isUpgraded(): boolean {
		if (!this.creature) return false;
		const ability = this.creature.abilities[0];
		return ability && ability.upgraded;
	}

	private surfaceScalar(
		theta: number,
		v: number,
		depth: number,
		mt: number,
		isBack: boolean,
	): { s: number; drain: number; v: number } {
		const set = this.settings;
		const dir = isBack ? -1.0 : 1.0;

		const baseFlow = mt * set.flowSpeed;
		const burst = this.burstPower;
		const burstFlow = baseFlow * burst * 2.5;
		const drain = v - baseFlow - burstFlow;

		let T = theta;
		T += dir * set.wrap3d * (0.72 * sin(mt * 1.35) + 0.22 * sin(v * 8.0 - mt * 2.8));
		T += set.wrap3d * 0.28 * sin(v * 12.0 + theta * 0.8 + mt * 2.2);
		T += set.wrap3d * 0.16 * sin(v * 21.0 - theta * 1.3 - mt * 3.6);

		let V = v;
		V += 0.055 * sin(theta * 2.4 + mt * 1.8 * dir);
		V += 0.035 * sin(theta * 5.0 - v * 10.0 + mt * 2.7);

		let s = 0;
		s += 0.92 * sin(1.75 * T + 4.1 * drain + 0.6 * sin(8.0 * V - mt * 2.0));
		s += 0.78 * sin(3.25 * T - 5.7 * drain + 0.44 * sin(2.2 * T + mt * 2.8));
		s += 0.62 * sin(5.6 * T + 6.4 * V - mt * 3.5);
		s += 0.42 * sin(9.2 * T - 7.8 * drain + 0.28 * sin(15.0 * V + mt * 1.6));
		s += 0.26 * sin(14.0 * T + 10.0 * V + mt * 4.0);
		s += 0.1 * depth * sin(6.0 * V + mt * 2.6);

		return { s: s / 2.45, drain: drain, v: v };
	}

	private draw(): void {
		const set = this.settings;
		const ctx = this.lowCtx;
		const img = this._imgData;
		const data = img.data;

		const t = this.time;
		const burst = this.burstPower * set.blockPower;
		// Outline has its own power that decays slower than the main burst,
		// so the block outline ring stays visible long after the main flash.
		const outlineBurst = this.outlinePower * set.blockOutline;

		// Pre-compute values that are constant across all pixels this frame.
		const cx = this.cx;
		const cy = this.cy;
		const rx = this.rx;
		const ry = this.ry;
		const mt = t * (0.28 + set.flowSpeed * 0.55);
		const mtBack = mt + 0.1 * (0.28 + set.flowSpeed * 0.55);
		const sin_t_1_8 = Math.sin(t * 1.8);
		const sin_t_2_4_1_5 = Math.sin(t * 2.4 + 1.5);
		const sin_t_2_0_2_2 = Math.sin(t * 2.0 + 2.2);
		const sin_t_2_8_0_7 = Math.sin(t * 2.8 + 0.7);
		const sin_t_1_5 = Math.sin(t * 1.5);
		const sin_t_2_1_1_4 = Math.sin(t * 2.1 + 1.4);
		const sin_t_2_4_2_0 = Math.sin(t * 2.4 + 2.0);
		const sin_t_2_3_0_8 = Math.sin(t * 2.3 + 0.8);
		const bf = set.bottomFade;
		const bfPlus = bf + 0.11;
		const dens = set.density;
		const thick = set.thickness;
		const backSurf = set.backSurface;

		let idx = 0;

		for (let py = 0; py < this.rh; py++) {
			const y = py * this.renderScale + this.renderScale * 0.5;

			for (let px = 0; px < this.rw; px++, idx += 4) {
				const x = px * this.renderScale + this.renderScale * 0.5;

				const nx = (x - cx) / rx;
				const ny = (y - cy) / ry;
				const e = nx * nx + ny * ny;

				if (e > 1) {
					data[idx + 3] = 0;
					continue;
				}

				const v = clamp((ny + 1) * 0.5, 0, 1);

				const rowWidth = Math.sqrt(Math.max(0.001, 1.0 - ny * ny));
				const u = clamp(nx / Math.max(0.08, rowWidth), -0.999, 0.999);
				const thetaFront = Math.asin(u);
				const thetaBack = thetaFront + Math.PI;
				const sideDepth = Math.max(0, Math.cos(thetaFront));
				const edge = clamp((e - 0.55) / 0.45, 0, 1);

				// BOTTOM ONLY. Top stays intact.
				const bottomMetric = 1 - v - set.bottomFadeCurve * (1 - sideDepth) * 0.12;
				const bottomMask = smoothstep(bf, bfPlus, bottomMetric);
				if (bottomMask <= 0.001) {
					data[idx + 3] = 0;
					continue;
				}

				const front = this.surfaceScalar(thetaFront, v, sideDepth, mt, false);
				const back = this.surfaceScalar(thetaBack, v, -sideDepth, mtBack, true);

				let f = 0;
				f = Math.max(f, this.band(front.s * dens, -0.54 + 0.08 * sin_t_1_8, 0.078 * thick));
				f = Math.max(f, this.band(front.s * dens, -0.2 + 0.07 * sin_t_2_4_1_5, 0.07 * thick));
				f = Math.max(f, this.band(front.s * dens, 0.14 + 0.08 * sin_t_2_0_2_2, 0.075 * thick));
				f = Math.max(f, this.band(front.s * dens, 0.48 + 0.06 * sin_t_2_8_0_7, 0.066 * thick));

				let b = 0;
				b = Math.max(b, this.band(back.s * dens, -0.5 + 0.08 * sin_t_1_5, 0.078 * thick));
				b = Math.max(b, this.band(back.s * dens, -0.15 + 0.07 * sin_t_2_1_1_4, 0.07 * thick));
				b = Math.max(b, this.band(back.s * dens, 0.2 + 0.08 * sin_t_2_4_2_0, 0.075 * thick));
				b = Math.max(b, this.band(back.s * dens, 0.52 + 0.06 * sin_t_2_3_0_8, 0.066 * thick));

				const crackleF =
					0.7 +
					0.18 * Math.sin(8.0 * v + 1.8 * thetaFront - t * 5.2) +
					0.12 * Math.sin(11.0 * front.drain - 2.1 * thetaFront + t * 7.0);
				const crackleB = 0.58 + 0.16 * Math.sin(7.6 * v + 1.7 * thetaBack + t * 3.6);
				f = clamp(f * crackleF, 0, 1.18);
				b = clamp(b * crackleB, 0, 1.05);

				let frontI = f * (0.22 + 0.52 * sideDepth + 0.12 * edge);
				let backI = b * backSurf * (0.05 + 0.38 * edge + 0.12 * (1 - sideDepth));

				let shock = 0;
				if (burst > 0.02) {
					const verticalPulse = smoothstep(0.1, 0.55, v) * smoothstep(0.1, 0.55, 1 - v);
					const blockT = t * (0.1 + set.blockSpeed * 0.22);
					const drainPulse = 0.55 + 0.45 * sin(8.0 * v + blockT + thetaFront * 1.8);
					shock = burst * 0.16 * verticalPulse * drainPulse;
					frontI += f * 0.18 * burst;
					backI += b * 0.08 * burst;
				}

				let intensity = clamp((frontI + backI + shock) * set.skin * bottomMask, 0, 1.22);
				intensity = pow(intensity, 1.0 / set.contrast);

				const core = clamp(
					((frontI - 0.24) * 2.35 + (backI - 0.16) * 1.1 + shock * 1.2) * bottomMask,
					0,
					1,
				);

				let alpha = 0;
				if (intensity > 0.038) alpha = intensity * 124 + core * 42;

				const aura =
					(0.018 + 0.028 * sin(t * 2.6 + v * 10.0 + thetaFront * 0.6)) *
					(0.18 + 0.82 * edge) *
					bottomMask;
				alpha += aura * 30;
				alpha = clamp(alpha * set.transparency, 0, 185);

				const rr = 116 + 126 * Math.min(1, intensity) + 58 * core + 8 * sideDepth * f;
				const gg = 4 + 22 * Math.min(1, intensity) + 180 * core;
				const bb = 130 + 96 * Math.min(1, intensity) + 104 * core + 18 * edge * b;

				const hue = hueRotateRgb(rr, gg, bb, set.hueShift);

				data[idx] = clamp(hue.r, 0, 255);
				data[idx + 1] = clamp(hue.g, 0, 255);
				data[idx + 2] = clamp(hue.b, 0, 255);
				data[idx + 3] = alpha;
			}
		}

		ctx.clearRect(0, 0, this.rw, this.rh);
		ctx.putImageData(img, 0, 0);

		const out = this.bmd.ctx;
		out.clearRect(0, 0, this.w, this.h);
		out.imageSmoothingEnabled = !set.crtPixelate;
		out.drawImage(this.low, 0, 0, this.w, this.h);

		out.save();
		out.globalCompositeOperation = 'lighter';
		out.shadowColor = 'rgba(255, 34, 230,' + (0.18 + burst * 0.08) + ')';
		out.shadowBlur = 8 + burst * 5;
		out.drawImage(this.bmd.canvas, 0, 0);
		out.restore();

		// Block outline using the same bottom-fade idea as the plasma body.
		// Only shown when the plasma field ability is upgraded and burstPower is active.
		// Threshold lowered to 0.02 for longer visibility.
		if (outlineBurst > 0.02 && set.blockOutline > 0 && this.isUpgraded()) {
			out.save();
			out.globalCompositeOperation = 'lighter';
			// hueRotateRgb is computed once because both the shadow and the stroke
			// use the same source color (255, 55, 232).
			const outlineHue = hueRotateRgb(255, 55, 232, set.hueShift);
			out.shadowColor =
				'rgba(' +
				Math.round(clamp(outlineHue.r, 0, 255)) +
				',' +
				Math.round(clamp(outlineHue.g, 0, 255)) +
				',' +
				Math.round(clamp(outlineHue.b, 0, 255)) +
				', .90)';
			out.shadowBlur = 18 + outlineBurst * 10;
			out.lineWidth = 3.6;
			out.lineCap = 'round';
			out.lineJoin = 'round';

			const rxO = this.rx + 4;
			const ryO = this.ry + 6;
			const stepsO = 48;

			for (let oi = 0; oi < stepsO; oi++) {
				const a0 = (oi / stepsO) * Math.PI * 2;
				const a1 = ((oi + 1) / stepsO) * Math.PI * 2;
				const am = (a0 + a1) * 0.5;

				const xm = cx + rxO * Math.cos(am);
				const ym = cy + ryO * Math.sin(am);
				const nym = clamp((ym - cy) / ry, -1, 1);
				const vm = clamp((nym + 1) * 0.5, 0, 1);
				const uO = clamp((xm - cx) / rxO, -0.999, 0.999);
				const sideDepthO = Math.sqrt(Math.max(0, 1 - uO * uO));
				const outlineMetric = 1 - vm - set.bottomFadeCurve * (1 - sideDepthO) * 0.12;
				const maskO = smoothstep(bf, bfPlus, outlineMetric);

				if (maskO <= 0.015) continue;

				const alphaO = 0.45 * outlineBurst * maskO;
				out.strokeStyle =
					'rgba(' +
					Math.round(clamp(outlineHue.r, 0, 255)) +
					',' +
					Math.round(clamp(outlineHue.g, 0, 255)) +
					',' +
					Math.round(clamp(outlineHue.b, 0, 255)) +
					',' +
					alphaO +
					')';

				out.beginPath();
				out.moveTo(cx + rxO * Math.cos(a0), cy + ryO * Math.sin(a0));
				out.lineTo(cx + rxO * Math.cos(a1), cy + ryO * Math.sin(a1));
				out.stroke();
			}

			out.restore();
		}

		this.bmd.dirty = true;
	}

	tick = (): void => {
		this.frame++;
		this.time += 1 / 24;
		if (this.burstPower > 0) {
			this.burstPower = Math.max(0, this.burstPower - 0.08);
		}
		if (this.outlinePower > 0) {
			this.outlinePower = Math.max(0, this.outlinePower - 0.03);
		}
		this.draw();
	};

	/** Position the field relative to the Dark Priest cardboard sprite. */
	positionTo(target: Phaser.Sprite, offsetX: number, offsetY: number): void {
		this.sprite.x = target.x + offsetX;
		this.sprite.y = target.y - offsetY;
	}

	setVisible(visible: boolean): void {
		this.sprite.visible = visible;
		if (visible) _registerField(this);
		else _unregisterField(this);
	}

	burst(): void {
		this.burstPower = 1;
		this.outlinePower = 1;
	}

	set(key: keyof PlasmaFieldSettings, value: number | boolean): void {
		if (key in this.settings) {
			(this.settings[key] as number | boolean) = value as never;
			if (key === 'scaleX' || key === 'scaleY') {
				this.sprite.scale.set(this.settings.scaleX, this.settings.scaleY);
			}
		}
	}

	destroy(): void {
		_unregisterField(this);
		this.onBurstEnd = null;
		if (this.sprite && this.sprite.destroy) this.sprite.destroy();
		if (this.bmd && this.bmd.destroy) this.bmd.destroy();
	}
}
