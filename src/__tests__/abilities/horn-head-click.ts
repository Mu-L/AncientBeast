import { beforeEach, describe, expect, jest, test } from '@jest/globals';

jest.mock('phaser-ce', () => ({
	Point: class PointMock {},
	Polygon: class PolygonMock {},
}));

jest.mock('../../utility/hex', () => ({
	Direction: {
		None: -1,
		UpRight: 0,
		Right: 1,
		DownRight: 2,
		DownLeft: 3,
		Left: 4,
		UpLeft: 5,
	},
	Hex: class HexMock {
		x: number;
		y: number;
		pos: { x: number; y: number };
		direction: number;
		creature: unknown;
		constructor(x: number, y: number) {
			this.x = x;
			this.y = y;
			this.pos = { x, y };
			this.direction = -1;
			this.creature = null;
		}
	},
}));

jest.mock('../../creature', () => ({
	Creature: class CreatureMock {},
}));

jest.mock('../../effect', () => ({
	Effect: class EffectMock {},
}));

jest.mock('../../damage', () => ({
	Damage: class DamageMock {
		attacker: unknown;
		damages: Record<string, number>;
		constructor(attacker: unknown, damages: Record<string, number>) {
			this.attacker = attacker;
			this.damages = damages;
		}
	},
}));

import loadHornHeadAbilities from '../../abilities/Horn-Head';
import { Direction } from '../../utility/hex';

const makeGame = () => {
	const hexesByKey = new Map<string, any>();
	const getHex = (x: number, y: number): any => {
		const key = `${x}:${y}`;
		if (!hexesByKey.has(key)) {
			hexesByKey.set(key, {
				x,
				y,
				pos: { x, y },
				direction: Direction.None,
				creature: null,
				isWalkable: jest.fn(() => true),
			});
		}
		return hexesByKey.get(key);
	};

	// Build a horizontal line. For a flipped creature the Right line runs
	// backward (decreasing x), mirroring real getHexLine geometry for player 2.
	const rightLine: any[] = [];
	for (let x = -8; x <= 8; x++) {
		rightLine.push(getHex(x, 5));
	}

	const game: any = {
		abilities: {},
		grid: {
			getHexLine: jest.fn((startX: number, y: number, dir: Direction, flipped?: boolean) => {
				if (dir === Direction.Right && y === 5) {
					const xs = flipped
						? [
								startX,
								startX - 1,
								startX - 2,
								startX - 3,
								startX - 4,
								startX - 5,
								startX - 6,
								startX - 7,
								startX - 8,
						  ]
						: [
								startX,
								startX + 1,
								startX + 2,
								startX + 3,
								startX + 4,
								startX + 5,
								startX + 6,
								startX + 7,
								startX + 8,
						  ];
					return xs.map((x: number) => getHex(x, 5));
				}
				return [];
			}),
			queryChoice: jest.fn(),
		},
		activeCreature: { queryMove: jest.fn() },
		log: jest.fn(),
		Phaser: undefined,
		msg: { abilities: { noTarget: 'No target.' } },
	};

	loadHornHeadAbilities(game as never);
	return { game, getHex };
};

const makeCreature = (id: number, x: number, y: number, size: number) => ({
	id,
	x,
	y,
	size,
	player: { flipped: false },
	hexagons: Array.from({ length: size }, (_, i) => ({ x: x - i, y })),
	stats: { moveable: true, movement: 3 },
	isDarkPriest: () => false,
	hasCreaturePlayerGotPlasma: () => false,
	takeDamage: jest.fn(),
	moveTo: jest.fn((hex: any, opts: { callback?: () => void }) => opts?.callback?.()),
	replaceEffect: jest.fn(),
	addEffect: jest.fn(),
	removeEffect: jest.fn(),
	endurance: 5,
});

describe('Meat Sickle clicking the first hexagon of a path', () => {
	let game: any;
	let getHex: (x: number, y: number) => any;

	beforeEach(() => {
		const setup = makeGame();
		game = setup.game;
		getHex = setup.getHex;
	});

	const buildAbility = (creature: any): any => {
		const defs = game.abilities[8] as any[] as Array<Record<string, any>>;
		// Meat Sickle is the third onQuery ability (index 2).
		const meatSickleDef = defs.find(
			(d) =>
				typeof d.query === 'function' &&
				d._targetTeam !== undefined &&
				d._getMaxDistance !== undefined,
		);
		return {
			...meatSickleDef,
			creature,
			isUpgraded: () => true,
			end: jest.fn(),
			title: 'Meat Sickle',
			damages: { pierce: 1 },
			animation: function (...args: unknown[]) {
				return (this.activate as (...a: unknown[]) => unknown).apply(this, args);
			},
		};
	};

	test('clicking the first hexagon of the path executes on the target', () => {
		const hornHead = makeCreature(8, 1, 5, 2);
		getHex(0, 5).creature = hornHead;
		getHex(1, 5).creature = hornHead;
		const enemy = makeCreature(33, 4, 5, 1);
		// target occupies (4,5)
		getHex(4, 5).creature = enemy;
		getHex(5, 5).creature = enemy;

		const ability = buildAbility(hornHead);

		(ability.query as () => void).call(ability);

		expect(game.grid.queryChoice).toHaveBeenCalledTimes(1);
		const queryOpt = game.grid.queryChoice.mock.calls[0][0];
		expect(queryOpt.choices.length).toBeGreaterThan(0);

		// Find the Right-direction choice whose target is the enemy.
		const rightChoice = queryOpt.choices.find((choice: any[]) =>
			choice.some((h) => h.creature === enemy),
		);
		expect(rightChoice).toBeDefined();
		// The first hexagon of the path must be included in the choice.
		expect(rightChoice[0]).toBe(getHex(2, 5));

		const firstHex = rightChoice[0];

		// Simulate the user clicking the first hexagon (replicate queryChoice matching).
		queryOpt.fnOnConfirm(rightChoice, { direction: Direction.Right, hex: firstHex });

		// The ability should have confirmed/executed (end called) and the enemy is the target.
		expect(ability.end).toHaveBeenCalled();
	});

	test('flipped Horn Head: path must skip caster hexes so the first hexagon triggers', () => {
		const hornHead = makeCreature(8, 1, 5, 2);
		hornHead.player = { flipped: true };
		// Flipped creature still occupies (0,5) and (1,5); facing board-left.
		hornHead.hexagons = [
			{ x: 0, y: 5 },
			{ x: 1, y: 5 },
		];
		getHex(0, 5).creature = hornHead;
		getHex(1, 5).creature = hornHead;

		const enemy = makeCreature(33, -3, 5, 1);
		getHex(-3, 5).creature = enemy;
		getHex(-4, 5).creature = enemy;

		const ability = buildAbility(hornHead);

		(ability.query as () => void).call(ability);

		expect(game.grid.queryChoice).toHaveBeenCalledTimes(1);
		const queryOpt = game.grid.queryChoice.mock.calls[0][0];

		// Both the "Right" direction (startX = creature.x-1) and the "Left"
		// direction (startX = creature.x) reach the same board-left area for a
		// flipped creature.  Before the fix, the "Left" direction's path started
		// at the caster's own hex, so getUpgradedMeatSickleTargetChoices returned
		// undefined for it — only 1 choice contained the enemy.  After the fix,
		// both directions produce a valid choice (2 total).
		const enemyChoices = queryOpt.choices.filter((c: any[]) => c.some((h) => h.creature === enemy));
		expect(enemyChoices.length).toBe(2);

		// Neither choice's first hexagon may be the caster itself.
		for (const choice of enemyChoices) {
			expect(choice[0].creature?.id).not.toBe(hornHead.id);
		}

		// Clicking the first hexagon of any choice should execute on the enemy.
		queryOpt.fnOnConfirm(enemyChoices[0], {
			direction: Direction.Right,
			hex: enemyChoices[0][0],
		});
		expect(ability.end).toHaveBeenCalled();
	});
});
