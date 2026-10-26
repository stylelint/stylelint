import { after, beforeEach, describe, it, mock } from 'node:test';
import process from 'node:process';

import stripIndent from '../testUtils/stripIndent.mjs';
import timing from '../timing.mjs';

describe('timing', () => {
	const OLD_ENV = process.env;

	beforeEach(() => {
		process.env = { ...OLD_ENV };
	});

	after(() => {
		process.env = OLD_ENV;
		// Every reloaded `timing` with TIMING set prints its table on exit, after the mocks are restored.
		mock.method(console, 'log', () => {});
	});

	let reloads = 0;

	// A fresh `timing` instance for a given TIMING value; the query defeats the module cache.
	async function getTimingForDisplay(TIMINGValue) {
		process.env.TIMING = TIMINGValue;
		const timingModule = await import(`../timing.mjs?reload=${++reloads}`);

		return timingModule.default;
	}

	describe('getListSize()', () => {
		it('should return 0 when TIMING is not set or invalid', (t) => {
			delete process.env.TIMING;
			t.assert.strictEqual(timing.getListSize(), 0);

			process.env.TIMING = 'true';
			t.assert.strictEqual(timing.getListSize(), 0);

			process.env.TIMING = 'foo';
			t.assert.strictEqual(timing.getListSize(), 0);

			process.env.TIMING = '-1';
			t.assert.strictEqual(timing.getListSize(), 0);
		});

		it('should return the numeric value when TIMING is a valid number >= 1', (t) => {
			process.env.TIMING = '1';
			t.assert.strictEqual(timing.getListSize(), 1);

			process.env.TIMING = '10';
			t.assert.strictEqual(timing.getListSize(), 10);

			process.env.TIMING = '15';
			t.assert.strictEqual(timing.getListSize(), 15);

			process.env.TIMING = '100';
			t.assert.strictEqual(timing.getListSize(), 100);
		});

		it('should return maximum list size when TIMING is set to "all"', (t) => {
			process.env.TIMING = 'all';
			t.assert.strictEqual(timing.getListSize(), Number.POSITIVE_INFINITY);

			process.env.TIMING = 'ALL';
			t.assert.strictEqual(timing.getListSize(), Number.POSITIVE_INFINITY);
		});
	});

	describe('display()', () => {
		let consoleSpy;

		beforeEach((t) => {
			consoleSpy = t.mock.method(console, 'log', () => {});
		});

		it('should display the timing data in a table format', async (t) => {
			const timingForDisplay = await getTimingForDisplay('3');

			const mockData = {
				ruleA: 50,
				ruleB: 30,
				ruleC: 20,
			};

			timingForDisplay.display(mockData);

			t.assert.strictEqual(consoleSpy.mock.callCount(), 1);
			t.assert.deepStrictEqual(consoleSpy.mock.calls[0].arguments, [
				stripIndent`
				| # | Rule  | Time (ms) | Relative |
				|--:|:------|----------:|---------:|
				| 1 | ruleA |    50.000 |    50.0% |
				| 2 | ruleB |    30.000 |    30.0% |
				| 3 | ruleC |    20.000 |    20.0% |
			`,
			]);
		});

		it('should display only the top 1 if TIMING=1 and there are 3 data entries', async (t) => {
			const timingForDisplay = await getTimingForDisplay('1');

			const mockData = {
				ruleA: 50,
				ruleB: 30,
				ruleC: 20,
			};

			timingForDisplay.display(mockData);

			t.assert.strictEqual(consoleSpy.mock.callCount(), 1);
			t.assert.deepStrictEqual(consoleSpy.mock.calls[0].arguments, [
				stripIndent`
				| # | Rule  | Time (ms) | Relative |
				|--:|:------|----------:|---------:|
				| 1 | ruleA |    50.000 |    50.0% |
			`,
			]);
		});

		it('should size the columns to the widest cell', async (t) => {
			const timingForDisplay = await getTimingForDisplay('all');

			const mockData = {
				'no-descending-specificity': 1234.5,
				a: 0.5,
			};

			timingForDisplay.display(mockData);

			t.assert.deepStrictEqual(
				consoleSpy.mock.calls.map((call) => call.arguments),
				[
					[
						stripIndent`
				| # | Rule                      | Time (ms) | Relative |
				|--:|:--------------------------|----------:|---------:|
				| 1 | no-descending-specificity |  1234.500 |   100.0% |
				| 2 | a                         |     0.500 |     0.0% |
			`,
					],
				],
			);
		});
	});

	describe('enabled property', () => {
		it('should be false if TIMING is invalid', async (t) => {
			const timingForDisplay = await getTimingForDisplay('true');

			t.assert.strictEqual(timingForDisplay.enabled, false);
		});

		it('should be false if TIMING is a negative value', async (t) => {
			const timingForDisplay = await getTimingForDisplay('-1');

			t.assert.strictEqual(timingForDisplay.enabled, false);
		});

		it('should be false if TIMING=0', async (t) => {
			const timingForDisplay = await getTimingForDisplay('0');

			t.assert.strictEqual(timingForDisplay.enabled, false);
		});

		it('should be true if TIMING is a positive number', async (t) => {
			const timingForDisplay = await getTimingForDisplay('1');

			t.assert.strictEqual(timingForDisplay.enabled, true);
		});

		it('should be true if TIMING="all"', async (t) => {
			const timingForDisplay = await getTimingForDisplay('all');

			t.assert.strictEqual(timingForDisplay.enabled, true);
		});
	});
});
