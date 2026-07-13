import { Damage } from '../damage';
import { Effect } from '../effect';
import Game from '../game';
import { Creature } from '../creature';
import { Direction, Hex } from '../utility/hex';
import * as matrices from '../utility/matrices';
import { getDirectionFromDelta } from '../utility/position';
import { isTeam, Team } from '../utility/team';
import { HEX_WIDTH_PX } from '../utility/const';

const getFrontLanes = (creature: Creature) => [
	...creature.getHexMap(matrices.fronttop1hex, false),
	...creature.getHexMap(matrices.inlinefront1hex, false),
	...creature.getHexMap(matrices.frontbottom1hex, false),
];

const getBackLanes = (creature: Creature) => [
	...creature.getHexMap(matrices.backtop1hex, false),
	...creature.getHexMap(matrices.inlineback1hex, false),
	...creature.getHexMap(matrices.backbottom1hex, false),
];

const meatSickleRestrictionEffectName = 'Meat Sickle Restriction';
const hornHeadLifeSupportTrackerEffectName = 'Life Support Damage Tracker';
const meatSickleInlineDirections = [Direction.Right, Direction.Left];
const meatSickleAllDirections = [
	Direction.UpRight,
	Direction.Right,
	Direction.DownRight,
	Direction.DownLeft,
	Direction.Left,
	Direction.UpLeft,
];

const getMeatSickleHexLineDirection = (direction: Direction, flipped: boolean) => {
	if (flipped) {
		switch (direction) {
			case Direction.Left:
				return Direction.Right;
			case Direction.UpLeft:
				return Direction.DownRight;
			case Direction.DownLeft:
				return Direction.UpRight;
		}
	}
	return direction;
};

const getMeatSickleStartX = (creature: Creature, direction: Direction) => {
	if (
		(!creature.player.flipped && direction > Direction.DownRight) ||
		(creature.player.flipped && direction < Direction.DownLeft)
	) {
		return creature.x - (creature.size - 1);
	}

	return creature.x;
};

const getMeatSicklePath = (G: Game, creature: Creature, direction: Direction, distance: number) => {
	const hexLineDirection = getMeatSickleHexLineDirection(direction, creature.player.flipped);
	const rawLine = G.grid.getHexLine(
		getMeatSickleStartX(creature, direction),
		creature.y,
		hexLineDirection,
		creature.player.flipped,
	);
	// Skip any of the caster's own hexagons at the very start of the line so the
	// first path hex is always a hex adjacent to the caster, never the caster
	// itself. A size-2 flipped creature can have two of its own hexes at the
	// line's start (e.g. the DownLeft/Left/UpLeft directions), and a naive
	// slice(1) would leave the caster's other hex as the "first hexagon" of the
	// path — clicking it (the caster) would never trigger the ability.
	let startIndex = 0;
	while (
		startIndex < rawLine.length &&
		rawLine[startIndex].creature &&
		rawLine[startIndex].creature.id === creature.id
	) {
		startIndex++;
	}
	return rawLine.slice(startIndex, startIndex + distance);
};

const getMeatSickleLanding = (line: Hex[], target: Creature, targetIndex: number) => {
	// Search from index 1 to find closest walkable spot toward caster
	const landingStartIndex = 1;

	for (let index = landingStartIndex; index < targetIndex; index++) {
		const hex = line[index];
		if (hex?.isWalkable(target.size, target.id, true)) {
			return { landingHex: hex, landingIndex: index };
		}
	}

	return { landingHex: undefined, landingIndex: -1 };
};

const getUpgradedMeatSickleChoices = (G: Game, creature: Creature) =>
	meatSickleAllDirections.map((direction) =>
		getMeatSicklePath(
			G,
			creature,
			direction,
			meatSickleInlineDirections.includes(direction) ? 5 : 1,
		),
	);

const getKnuckleNibPushDistance = (target: Creature) => Math.max(0, 4 - target.size);

const getKnuckleNibImpactX = (source: Creature, target: Creature) =>
	Math.max(target.x - target.size + 1, Math.min(target.x, source.x));

const getKnuckleNibPushDirection = (source: Creature, target: Creature) => {
	// Creature.x is the rightmost occupied hex in this codebase. Clamp Horn Head's x to the
	// target footprint so the direction is based on the actually contacted hex.
	const nearestTargetX = getKnuckleNibImpactX(source, target);
	const dx = nearestTargetX - source.x;
	const dy = target.y - source.y;

	return getDirectionFromDelta(target.y, dx, dy);
};

const getKnuckleNibPushPath = (G: Game, source: Creature, target: Creature) => {
	if (!target.stats.moveable) {
		return [];
	}

	const maxPushDistance = getKnuckleNibPushDistance(target);
	if (maxPushDistance < 1) {
		return [];
	}

	const direction = getKnuckleNibPushDirection(source, target);
	const line = G.grid.getHexLine(target.x, target.y, direction, false).slice(1);
	const pushPath: Hex[] = [];

	for (const hex of line) {
		if (!hex.isWalkable(target.size, target.id, true)) {
			break;
		}

		pushPath.push(hex);
		if (pushPath.length >= maxPushDistance) {
			break;
		}
	}

	return pushPath;
};

const getKnuckleNibPushPreviewHexes = (G: Game, source: Creature, target: Creature) => {
	const pushPath = getKnuckleNibPushPath(G, source, target);
	if (!pushPath.length) {
		return [];
	}

	const direction = getKnuckleNibPushDirection(source, target);
	const impactX = getKnuckleNibImpactX(source, target);
	const line = G.grid.getHexLine(impactX, target.y, direction, false).slice(1);
	const previewHexes: Hex[] = [];
	let remainingPushHexes = pushPath.length;

	for (const hex of line) {
		previewHexes.push(hex);

		if (hex.creature !== target) {
			remainingPushHexes--;
		}

		if (remainingPushHexes <= 0) {
			break;
		}
	}

	return previewHexes;
};

const getUpgradedMeatSickleTargetChoices = (G: Game, creature: Creature, targetTeam: Team) =>
	meatSickleAllDirections
		.map((direction) => {
			const path = getMeatSicklePath(
				G,
				creature,
				direction,
				meatSickleInlineDirections.includes(direction) ? 5 : 1,
			);

			for (let i = 0; i < path.length; i++) {
				const blockingCreature = path[i].creature;
				if (!blockingCreature) {
					continue;
				}

				if (isTeam(creature, blockingCreature, targetTeam) && blockingCreature.stats.moveable) {
					return path.slice(0, i + 1);
				}

				return undefined;
			}

			return undefined;
		})
		.filter((choice): choice is Hex[] => Array.isArray(choice));

const hornHeadHealthBeforeHit = new Map<number, number>();
const hornHeadPredictedHitDamage = new Map<number, number>();

const getMeatSickleDirectionFromPath = (
	G: Game,
	creature: Creature,
	path: Hex[],
): Direction | undefined => {
	const firstHex = path[0];

	if (!firstHex) {
		return undefined;
	}

	// Try to find direction where this hex is the first hex in the path
	let direction = meatSickleAllDirections.find(
		(direction) => getMeatSicklePath(G, creature, direction, 1)[0]?.pos === firstHex.pos,
	);

	// If not found (e.g., clicking empty hex in middle of range), try to find the direction
	// where this hex appears anywhere in the path
	if (!direction) {
		direction = meatSickleAllDirections.find((dir) => {
			const pathForDir = getMeatSicklePath(G, creature, dir, 5);
			return pathForDir.some((hex) => hex.pos === firstHex.pos);
		});
	}

	return direction;
};

const uniqueHexes = (hexes: Hex[]) => {
	const seenPositions = new Set<string>();

	return hexes.filter((hex) => {
		const positionKey = `${hex.x}:${hex.y}`;

		if (seenPositions.has(positionKey)) {
			return false;
		}

		seenPositions.add(positionKey);
		return true;
	});
};

const preserveAbilityRangeHexes = (
	ability: { _inDirectionTest?: boolean; _abilityRangeHexes?: Hex[] },
	hexes: Hex[],
	callback: () => boolean,
) => {
	ability._inDirectionTest = true;
	const result = callback();
	ability._inDirectionTest = false;
	ability._abilityRangeHexes = uniqueHexes(hexes);
	return result;
};

const applyMovementRestriction = (source: Creature, target: Creature, G: Game) => {
	// Single-stage self-modifying effect:
	// - Blocks movement abilities as soon as applied (findEffect finds it immediately).
	// - When the foe's next turn starts (onStartPhase), switches its own deleteTrigger
	//   so it expires at the end of that same turn.
	target.removeEffect(meatSickleRestrictionEffectName);
	const effect = new Effect(
		meatSickleRestrictionEffectName,
		source,
		target,
		'onStartPhase',
		{
			alterations: {},
			effectFn: function (eff) {
				// Foe's turn has started; schedule expiry at end of this turn.
				eff.deleteTrigger = 'onEndPhase';
				eff.turnLifetime = 0;
				eff.creationTurn = G.turn;
				eff.trigger = ''; // prevent effectFn from firing again
			},
			deleteTrigger: '',
			turnLifetime: -1,
			creationTurn: G.turn,
			stackable: false,
			deleteOnOwnerDeath: true,
		},
		G,
	);
	// disableHint=true suppresses the floating tooltip when the effect is applied.
	target.addEffect(effect, undefined, undefined, false, true);
	G.log(`%CreatureName${target.id}% will be unable to use movement abilities on its next turn`);
};

const MEAT_SICKLE_CHAIN_KEY = 'object_chain';
const MEAT_SICKLE_HOOK_KEY = 'object_hook';

const getMeatSickleSpritesAvailable = (G: Game) => {
	const cache = G?.Phaser?.cache;
	if (!cache) {
		return false;
	}
	const chainImg = cache.getImage(MEAT_SICKLE_CHAIN_KEY);
	const hookImg = cache.getImage(MEAT_SICKLE_HOOK_KEY);
	return Boolean(chainImg && hookImg);
};

const playMeatSickleHookEffect = (
	G: Game,
	sourceCreature: Creature,
	sourceHex: Hex,
	targetCreature: Creature,
	targetHex: Hex,
	durationMs: number,
	onComplete?: () => void,
) => {
	if (!getMeatSickleSpritesAvailable(G) || !G.grid?.creatureGroup) {
		if (onComplete) {
			onComplete();
		}
		return;
	}

	const chainHeight = 30;

	// Visual centers (including y) so the chain/hook can point at the target in any
	// direction — right, left, up, down or diagonal — with no separate mirroring.
	const getCreatureCenter = (creature: Creature, fallbackHex: Hex): { x: number; y: number } => {
		const grp = creature.creatureSprite?.grp;
		const sprite = creature.creatureSprite?.sprite;
		if (grp && sprite) {
			return { x: grp.x + sprite.x, y: grp.y + sprite.y - sprite.texture.height / 2 };
		}
		return {
			x: (fallbackHex.displayPos.x ?? 0) + HEX_WIDTH_PX / 2 + 5,
			y: (fallbackHex.displayPos.y ?? 0) + 15,
		};
	};

	const targetCenter = getCreatureCenter(targetCreature, targetHex);

	// Origin: Horn Head's left wrist. The coordinates (150, 150) are pixels on the
	// creature's cardboard sprite image (top-left origin). The sprite is bottom-
	// anchored, so we map the image pixel into the group's coordinate space using
	// the sprite's on-screen position. Horn Head's offset-y is negative, so the
	// resulting y offset from the group origin is negative — the wrist sits above
	// the group origin, never below it.
	const sourceSprite = sourceCreature.creatureSprite?.sprite;
	const MEAT_SICKLE_LAUNCH_PIXEL_X = 169;
	const MEAT_SICKLE_LAUNCH_PIXEL_Y = 23;
	const launchPoint = (() => {
		const grp = sourceCreature.creatureSprite?.grp;
		if (grp && sourceSprite) {
			// The sprite is mirrored when the creature is flipped, so the wrist
			// pixel (measured from the image's left edge) is mirrored too — the
			// emit point must come from the side the creature is actually facing.
			const flipped = sourceCreature.player.flipped;
			const launchPixelX = flipped
				? sourceSprite.texture.width - MEAT_SICKLE_LAUNCH_PIXEL_X
				: MEAT_SICKLE_LAUNCH_PIXEL_X;
			const imageTopX = sourceSprite.x - sourceSprite.texture.width / 2;
			const imageTopY = sourceSprite.y - sourceSprite.texture.height;
			return {
				x: grp.x + imageTopX + launchPixelX,
				y: grp.y + imageTopY + MEAT_SICKLE_LAUNCH_PIXEL_Y,
			};
		}
		const fallbackX = sourceCreature.player.flipped
			? (sourceHex.displayPos.x ?? 0) - MEAT_SICKLE_LAUNCH_PIXEL_X
			: (sourceHex.displayPos.x ?? 0) + MEAT_SICKLE_LAUNCH_PIXEL_X;
		return {
			x: fallbackX,
			y: (sourceHex.displayPos.y ?? 0) - MEAT_SICKLE_LAUNCH_PIXEL_Y,
		};
	})();

	// Direction vector from the wrist toward the target, used to aim the launch.
	const totalDistance = Math.max(
		1,
		Math.hypot(targetCenter.x - launchPoint.x, targetCenter.y - launchPoint.y),
	);
	const dirX = Math.cos(Math.atan2(targetCenter.y - launchPoint.y, targetCenter.x - launchPoint.x));
	const dirY = Math.sin(Math.atan2(targetCenter.y - launchPoint.y, targetCenter.x - launchPoint.x));

	// Render the chain and hook in their own group appended after the creature
	// group, so they always draw on top of Horn Head and the (dragged) target
	// regardless of depth re-sorting during movement.
	const fxGroup = G.Phaser.add.group(G.grid.display, 'meatSickleFxGrp');

	// Chain: a single tileable sprite that *emits* from the wrist. Its length grows
	// from the emission point toward the hook and its texture scrolls every frame so
	// the links keep flowing outward (loopable) instead of popping out in chunks.
	const chain = G.Phaser.add.tileSprite(
		launchPoint.x,
		launchPoint.y,
		0,
		chainHeight,
		MEAT_SICKLE_CHAIN_KEY,
	);
	fxGroup.add(chain);
	chain.anchor.setTo(0, 0.5);
	chain.visible = false;

	const hook = fxGroup.create(launchPoint.x, launchPoint.y, MEAT_SICKLE_HOOK_KEY);
	hook.anchor.setTo(0.5, 0.5);
	hook.alpha = 0;

	let active = true;
	const stop = () => {
		active = false;
		fxGroup.destroy(true);
	};

	const HOOK_HALF_LENGTH = 40;

	// Draw the chain from the emission point up to the hook's back edge (flush, no
	// overlap) and rotate everything to face the current hook position. Recomputing
	// the angle every frame keeps the connection intact and stops the chain from
	// swinging loose while the hooked unit is dragged around.
	const renderAt = (hookX: number, hookY: number, hookAlpha: number) => {
		const dx = hookX - launchPoint.x;
		const dy = hookY - launchPoint.y;
		const angleNow = Math.atan2(dy, dx);
		const dist = Math.hypot(dx, dy);
		const chainLength = Math.max(0, dist - HOOK_HALF_LENGTH);

		chain.x = launchPoint.x;
		chain.y = launchPoint.y;
		chain.rotation = angleNow;
		chain.width = chainLength;
		chain.visible = chainLength > 1;
		// Anchor the tile pattern at the *far* (hook) end so the chain extrudes new
		// links out of the emission point as it grows/reels, instead of popping in
		// whole tiles at the tip.
		chain.tilePositionX = -chainLength;

		hook.x = hookX;
		hook.y = hookY;
		hook.rotation = angleNow;
		hook.alpha = hookAlpha;
	};

	const startTime = Date.now();
	const flyStep = () => {
		if (!active) {
			return;
		}
		const progress = Math.min(1, (Date.now() - startTime) / durationMs);
		const easing = 1 - Math.pow(1 - progress, 3);
		// Chain and hook extend together at the same speed during the launch. The
		// hook starts transparent at the emission point and fades in as it travels.
		const hookDistance = totalDistance * easing;
		renderAt(
			launchPoint.x + dirX * hookDistance,
			launchPoint.y + dirY * hookDistance,
			Math.min(1, progress * 2),
		);

		if (progress < 1) {
			setTimeout(flyStep, 16);
			return;
		}

		// Reeling phase: hook stays latched to the target (moving with it at the same
		// speed) while the chain reels in behind it. We render at the target's live
		// position every frame so the hook never drifts or swings loose.
		hook.alpha = 1;
		const track = () => {
			if (!active) {
				return;
			}
			const tc = getCreatureCenter(targetCreature, targetHex);
			renderAt(tc.x, tc.y, 1);
			setTimeout(track, 16);
		};
		track();
		if (onComplete) {
			onComplete();
		}
	};

	flyStep();

	return stop;
};

/** Creates the abilities
 * @param {Object} G the game object
 * @return {void}
 */
export default (G: Game) => {
	G.abilities[8] = [
		{
			trigger: 'onUnderAttack',
			showHoverPreviewRange: true,

			require: function () {
				return true;
			},

			activate: function (damage: Damage) {
				if (!(damage instanceof Damage) || damage.target !== this.creature) {
					return damage;
				}

				hornHeadHealthBeforeHit.set(this.creature.id, this.creature.health);
				const predictedDamage = damage.applyDamage()?.total ?? 0;
				hornHeadPredictedHitDamage.set(this.creature.id, predictedDamage);

				const ability = this;
				this.creature.removeEffect(hornHeadLifeSupportTrackerEffectName);
				this.creature.addEffect(
					new Effect(
						hornHeadLifeSupportTrackerEffectName,
						ability.creature,
						ability.creature,
						'onDamage',
						{
							effectFn: function (effect, effectArg) {
								const damageEvent = effectArg as Damage;
								if (!(damageEvent instanceof Damage) || damageEvent.target !== ability.creature) {
									return;
								}

								const trackedHealth =
									hornHeadHealthBeforeHit.get(ability.creature.id) ?? ability.creature.health;
								const healthDamageTaken = Math.max(0, trackedHealth - ability.creature.health);
								hornHeadHealthBeforeHit.delete(ability.creature.id);
								hornHeadPredictedHitDamage.delete(ability.creature.id);

								const enduranceGain = Math.floor(healthDamageTaken / 2);
								if (enduranceGain > 0) {
									ability.creature.addEffect(
										new Effect(
											ability.title,
											ability.creature,
											ability.creature,
											'',
											{
												alterations: {
													endurance: enduranceGain,
												},
												stackable: true,
												turnLifetime: -1,
											},
											G,
										),
										undefined,
										undefined,
										true,
										true,
									);
								}

								effect.deleteEffect();
							},
							deleteTrigger: 'onEndPhase',
							turnLifetime: 1,
							stackable: false,
							deleteOnOwnerDeath: true,
						},
						G,
					),
					undefined,
					undefined,
					true,
					true,
				);

				return damage;
			},

			interceptDeath: function () {
				if (!this.isUpgraded()) {
					return false;
				}

				const healthBeforeHit =
					hornHeadHealthBeforeHit.get(this.creature.id) ?? this.creature.health;
				const predictedDamage = hornHeadPredictedHitDamage.get(this.creature.id) ?? healthBeforeHit;
				const healthDamageToLeaveOne = Math.max(0, healthBeforeHit - 1);
				const enduranceShieldCost = Math.max(1, predictedDamage - healthDamageToLeaveOne);

				if (this.creature.endurance < enduranceShieldCost) {
					return false;
				}

				this.creature.endurance = Math.max(0, this.creature.endurance - enduranceShieldCost);
				this.creature.health = 1;
				hornHeadPredictedHitDamage.delete(this.creature.id);

				G.log(
					`%CreatureName${this.creature.id}% converts lethal damage into endurance loss (${enduranceShieldCost})`,
				);

				this.creature.hint(this.title, 'msg_effects');
				this.creature.updateHealth();

				return true;
			},
		},
		{
			trigger: 'onQuery',

			_targetTeam: Team.Enemy,

			require: function () {
				const targetHexes = this.creature.getHexMap(matrices.frontnback2hex, false);
				this._abilityRangeHexes = targetHexes;

				if (!this.testRequirements()) {
					return false;
				}

				return this.atLeastOneTarget(targetHexes, {
					team: this._targetTeam,
				});
			},

			query: function () {
				const ability = this;
				let previewHexes: Hex[] = [];
				const clearPreview = () => {
					previewHexes.forEach((hex) => {
						hex.cleanDisplayVisualState('dashed');
					});
					previewHexes = [];
				};

				G.grid.queryCreature({
					fnOnConfirm: function (...args) {
						clearPreview();
						ability.animation(...args);
					},
					fnOnSelect: function (target: Creature) {
						clearPreview();
						target.tracePosition({
							overlayClass: 'creature selected player' + target.team,
						});

						if (!ability.isUpgraded()) {
							return;
						}

						previewHexes = getKnuckleNibPushPreviewHexes(G, ability.creature, target);
						previewHexes.forEach((hex) => {
							hex.displayVisualState('dashed');
						});
					},
					fnOnCancel: function () {
						clearPreview();
					},
					team: this._targetTeam,
					id: this.creature.id,
					flipped: this.creature.player.flipped,
					hexes: this.creature.getHexMap(matrices.frontnback2hex, false),
				});
			},

			activate: function (target: Creature) {
				const ability = this;
				const pushPath = this.isUpgraded()
					? getKnuckleNibPushPath(G, ability.creature, target)
					: [];
				const pushHex = pushPath[pushPath.length - 1];

				ability.end(false, !!pushHex);
				G.Phaser.camera.shake(0.01, 80, true, G.Phaser.camera.SHAKE_HORIZONTAL, true);

				const result = target.takeDamage(new Damage(ability.creature, ability.damages, 1, [], G));

				if (!result.kill) {
					target.replaceEffect(
						new Effect(
							ability.title,
							ability.creature,
							target,
							'',
							{
								alterations: {
									defense: -2,
								},
								deleteTrigger: 'onEndPhase',
								turnLifetime: 1,
								creationTurn: G.turn,
								stackable: true,
								deleteOnOwnerDeath: true,
							},
							G,
						),
					);

					if (pushHex) {
						target.moveTo(pushHex, {
							ignoreMovementPoint: true,
							ignorePath: true,
							animation: 'push',
							callback: function () {
								G.activeCreature.queryMove();
							},
						});
						return;
					}
				}

				G.activeCreature.queryMove();
			},
		},
		{
			trigger: 'onQuery',

			_targetTeam: Team.Enemy,

			_getMaxDistance: function () {
				return this.isUpgraded() ? 1 : 2;
			},

			require: function () {
				if (!this.testRequirements()) {
					return false;
				}

				if (!this.creature.stats.moveable) {
					this.message = G.msg.abilities.notMoveable;
					return false;
				}

				if (!this.isUpgraded()) {
					return this.testDirection({
						team: this._targetTeam,
						sourceCreature: this.creature,
						flipped: this.creature.player.flipped,
						directions: [0, 1, 0, 0, 1, 0],
						distance: 5,
						minDistance: this._getMaxDistance(),
						optTest: (creature: Creature) => creature.stats.moveable,
					});
				}

				const choices = getUpgradedMeatSickleChoices(G, this.creature);
				const targetChoices = getUpgradedMeatSickleTargetChoices(
					G,
					this.creature,
					this._targetTeam,
				);

				return preserveAbilityRangeHexes(this, choices.flat(), () => {
					if (targetChoices.length > 0) {
						this.message = '';
						return true;
					}

					this.message = G.msg.abilities.noTarget;
					return false;
				});
			},

			query: function () {
				const ability = this;

				if (!this.isUpgraded()) {
					G.grid.queryDirection({
						fnOnConfirm: function (...args) {
							ability.animation(...args);
						},
						team: this._targetTeam,
						id: this.creature.id,
						sourceCreature: this.creature,
						flipped: this.creature.player.flipped,
						x: this.creature.x,
						y: this.creature.y,
						directions: [0, 1, 0, 0, 1, 0],
						distance: 5,
						minDistance: this._getMaxDistance(),
						optTest: (creature: Creature) => creature.stats.moveable,
					});
					return;
				}

				const choices = getUpgradedMeatSickleTargetChoices(G, this.creature, this._targetTeam);

				G.grid.queryChoice({
					fnOnConfirm: function () {
						// eslint-disable-next-line prefer-rest-params
						ability.animation(...arguments);
					},
					team: Team.Both,
					requireCreature: 0,
					id: this.creature.id,
					flipped: this.creature.player.flipped,
					choices,
				});
			},

			activate: function (path, args) {
				const ability = this;
			const queryDirection = args?.direction as Direction;
			const direction = meatSickleAllDirections.includes(queryDirection)
				? queryDirection
				: getMeatSickleDirectionFromPath(G, this.creature, path);

			if (direction === undefined) {
				return;
			}

			const hexLineDirection = getMeatSickleHexLineDirection(
				direction,
				this.creature.player.flipped,
			);
			const line = G.grid.getHexLine(
				getMeatSickleStartX(this.creature, direction),
				this.creature.y,
				hexLineDirection,
				this.creature.player.flipped,
			);

			// Find target in line: skip caster's own hexes, find first moveable creature
			const targetIndex = line.findIndex(
				(hex, index) => index > 0 && hex.creature?.id !== this.creature.id && hex.creature?.stats.moveable,
			);

			if (targetIndex < 1) {
				G.activeCreature.queryMove();
				return;
			}

			const target = line[targetIndex].creature;

			if (!target) {
				G.activeCreature.queryMove();
				return;
			}

			ability.end(false, true);

			if (target.isDarkPriest() && target.hasCreaturePlayerGotPlasma()) {
				target.takeDamage(new Damage(ability.creature, { slash: 1 }, 1, [], G));
				}

				const casterHookHex = line[0] ?? this.creature.hexagons[0];
				const targetHookHex = line[targetIndex] ?? target.hexagons[0];
				let cleanupMeatSickleEffect: (() => void) | null = null;

				const teardownMeatSickleEffect = () => {
					if (cleanupMeatSickleEffect) {
						cleanupMeatSickleEffect();
						cleanupMeatSickleEffect = null;
					}
				};

				let { landingHex, landingIndex } =
					targetIndex >= 1
						? getMeatSickleLanding(line, target, targetIndex)
						: { landingHex: undefined, landingIndex: -1 };

			// If no valid landing hex found, try the hex immediately before target (if walkable)
			if (!landingHex && targetIndex > 1) {
				const fallbackHex = line[targetIndex - 1];
				if (fallbackHex?.isWalkable(target.size, target.id, true)) {
					landingHex = fallbackHex;
					landingIndex = targetIndex - 1;
				}
			}
				const pulledHexes =
					landingHex && landingIndex > -1 ? Math.max(0, targetIndex - landingIndex) : 0;
				const movementDrain = Math.min(target.stats.movement, pulledHexes);
				const damageHexes = Math.max(0, pulledHexes - movementDrain);

				if (this.isUpgraded() && targetIndex === 1) {
					const cleanup = playMeatSickleHookEffect(
						G,
						this.creature,
						casterHookHex,
						target,
						targetHookHex,
						350,
					);
					if (typeof cleanup === 'function') {
						setTimeout(cleanup, 500);
					}
					target.takeDamage(
						new Damage(ability.creature, { pierce: ability.damages.pierce }, 1, [], G),
					);
					applyMovementRestriction(ability.creature, target, G);
					G.activeCreature.queryMove();
					return;
				}

				if (!landingHex) {
					const cleanup = playMeatSickleHookEffect(
						G,
						this.creature,
						casterHookHex,
						target,
						targetHookHex,
						350,
					);
					if (typeof cleanup === 'function') {
						setTimeout(cleanup, 500);
					}
				// Apply damage even when target can't move (e.g., at minimum range)
				if (damageHexes > 0) {
					target.takeDamage(
						new Damage(ability.creature, { pierce: damageHexes }, damageHexes, [], G),
					);
				}

					G.activeCreature.queryMove();
					return;
				}

				// Play the hook + chain effect; the moveTo happens AFTER the hook
				// latches onto the target (in onComplete), so the chain+hook and
				// the dragged unit move together toward Horn Head in perfect sync.
				cleanupMeatSickleEffect =
					playMeatSickleHookEffect(
						G,
						this.creature,
						casterHookHex,
						target,
						targetHookHex,
						350,
						() => {
							target.moveTo(landingHex, {
								ignoreMovementPoint: true,
								ignorePath: true,
								callback: function () {
									teardownMeatSickleEffect();
									if (movementDrain > 0) {
										target.replaceEffect(
											new Effect(
												ability.title,
												ability.creature,
												target,
												'onStartPhase',
												{
													effectFn: function (effect, creatureOrHexOrDamage) {
														const affectedCreature = creatureOrHexOrDamage as Creature;
														if (!(affectedCreature instanceof Creature)) {
															return;
														}

														affectedCreature.remainingMove = Math.max(
															0,
															affectedCreature.remainingMove - movementDrain,
														);
														effect.deleteEffect();
													},
													deleteTrigger: '',
													turnLifetime: -1,
													stackable: false,
													deleteOnOwnerDeath: true,
												},
												G,
											),
										);

										G.log(
											`%CreatureName${target.id}% will lose ${movementDrain} movement next turn`,
										);
									}

									if (damageHexes > 0) {
										target.takeDamage(
											new Damage(
												ability.creature,
												{ pierce: damageHexes * ability.damages.pierce },
												1,
												[],
												G,
											),
										);
									}

									G.activeCreature.queryMove();
								},
							});
						},
					) ?? null;
			},
		},
		{
			trigger: 'onQuery',

			_targetTeam: Team.Enemy,

			require: function () {
				if (!this.testRequirements()) {
					return false;
				}

				const frontChoice = getFrontLanes(this.creature);
				const backChoice = getBackLanes(this.creature);
				const rangeHexes = [...frontChoice, ...backChoice];
				const ownHexPositions = new Set(
					this.creature.hexagons.map((hex: Hex) => `${hex.x}:${hex.y}`),
				);
				const hoverRangeHexes = uniqueHexes(
					rangeHexes.filter((hex) => !ownHexPositions.has(`${hex.x}:${hex.y}`)),
				);
				return preserveAbilityRangeHexes(this, hoverRangeHexes, () => {
					if (
						this.atLeastOneTarget(frontChoice, { team: this._targetTeam }) ||
						this.atLeastOneTarget(backChoice, { team: this._targetTeam })
					) {
						this.message = '';
						return true;
					}

					this.message = G.msg.abilities.noTarget;
					return false;
				});
			},

			query: function () {
				const ability = this;
				const frontChoice = getFrontLanes(this.creature);
				const backChoice = getBackLanes(this.creature);
				const showOutlinedChoices = (choices: Hex[][]) => {
					const allChoiceHexes = choices.reduce(
						(acc: Hex[], choice: Hex[]) => acc.concat(choice),
						[],
					);
					allChoiceHexes.forEach((hex: Hex) => {
						hex.cleanOverlayVisualState();
						hex.cleanDisplayVisualState('dashed');
						hex.displayVisualState('dashed');
					});
				};
				const fillHoveredChoice = (choice: Hex[]) => {
					showOutlinedChoices([frontChoice, backChoice]);
					choice.forEach((hex: Hex) => {
						hex.cleanDisplayVisualState('dashed');
						if (hex.creature instanceof Creature) {
							hex.displayVisualState('creature selected player' + hex.creature.team);
						} else {
							hex.overlayVisualState('reachable h_player' + G.activeCreature.team);
						}
					});
				};

				const choices = [frontChoice, backChoice];

				G.grid.queryChoice({
					fnOnConfirm: function (...args) {
						ability.animation(...args);
					},
					fnOnSelect: function (choice: Hex[]) {
						fillHoveredChoice(choice);
					},
					team: Team.Both,
					requireCreature: 0,
					id: this.creature.id,
					flipped: this.creature.player.flipped,
					choices,
					targeting: false,
					callbackAfterQueryHexes: function () {
						showOutlinedChoices(choices);
					},
				});
			},

			activate: function (targetHexes: Hex[]) {
				const ability = this;
				const frontLanes = getFrontLanes(this.creature);
				const backLanes = getBackLanes(this.creature);
				const isBackSwipe = backLanes.some((laneHex) =>
					targetHexes.some((selectedHex) => selectedHex.pos === laneHex.pos),
				);
				const laneHexes = isBackSwipe ? backLanes : frontLanes;

				const getUniqueEnemyTargets = (hexes: Hex[]) => {
					const hitIds = new Set<number>();
					const targets: Creature[] = [];
					for (const hex of hexes) {
						const creature = hex.creature;
						if (!(creature instanceof Creature)) {
							continue;
						}
						if (!isTeam(ability.creature, creature, Team.Enemy) || hitIds.has(creature.id)) {
							continue;
						}
						hitIds.add(creature.id);
						targets.push(creature);
					}
					return targets;
				};

				const damageTargets = (
					targets: Creature[],
					damages: Partial<typeof ability.damages>,
					ignoreRetaliation = false,
				) => {
					for (const target of targets) {
						if (target.dead) {
							continue;
						}
						target.takeDamage(new Damage(ability.creature, damages, 1, [], G), {
							ignoreRetaliation,
						});

						if (this.isUpgraded()) {
							ability.creature.addEffect(
								new Effect(
									ability.title,
									ability.creature,
									ability.creature,
									'',
									{
										alterations: {
											offense: 1,
										},
										stackable: true,
										turnLifetime: -1,
									},
									G,
								),
								undefined,
								undefined,
								true,
								true,
							);
						}
					}
				};

				G.Phaser.camera.shake(0.01, 100, true, G.Phaser.camera.SHAKE_HORIZONTAL, true);

				for (let hit = 0; hit < 2; hit++) {
					const meleeTargets = getUniqueEnemyTargets(laneHexes);
					damageTargets(meleeTargets, ability.damages);
				}

				this.end();
				G.grid.xray(new Hex(0, 0, null, G));
			},
		},
	];
};
