import { after, beforeEach, describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
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
		it('should return 0 when TIMING is not set or invalid', () => {
			delete process.env.TIMING;
			assert.equal(timing.getListSize(), 0);

			process.env.TIMING = 'true';
			assert.equal(timing.getListSize(), 0);

			process.env.TIMING = 'foo';
			assert.equal(timing.getListSize(), 0);

			process.env.TIMING = '-1';
			assert.equal(timing.getListSize(), 0);
		});

		it('should return the numeric value when TIMING is a valid number >= 1', () => {
			process.env.TIMING = '1';
			assert.equal(timing.getListSize(), 1);

			process.env.TIMING = '10';
			assert.equal(timing.getListSize(), 10);

			process.env.TIMING = '15';
			assert.equal(timing.getListSize(), 15);

			process.env.TIMING = '100';
			assert.equal(timing.getListSize(), 100);
		});

		it('should return maximum list size when TIMING is set to "all"', () => {
			process.env.TIMING = 'all';
			assert.equal(timing.getListSize(), Number.POSITIVE_INFINITY);

			process.env.TIMING = 'ALL';
			assert.equal(timing.getListSize(), Number.POSITIVE_INFINITY);
		});
	});

	describe('display()', () => {
		let consoleSpy;

		beforeEach((t) => {
			consoleSpy = t.mock.method(console, 'log', () => {});
		});

		it('should display the timing data in a table format', async () => {
			const timingForDisplay = await getTimingForDisplay('3');

			const mockData = {
				ruleA: 50,
				ruleB: 30,
				ruleC: 20,
			};

			timingForDisplay.display(mockData);

			assert.equal(consoleSpy.mock.callCount(), 1);
			assert.deepEqual(consoleSpy.mock.calls[0].arguments, [
				stripIndent`
				| # | Rule  | Time (ms) | Relative |
				|--:|:------|----------:|---------:|
				| 1 | ruleA |    50.000 |    50.0% |
				| 2 | ruleB |    30.000 |    30.0% |
				| 3 | ruleC |    20.000 |    20.0% |
			`,
			]);
		});

		it('should display only the top 1 if TIMING=1 and there are 3 data entries', async () => {
			const timingForDisplay = await getTimingForDisplay('1');

			const mockData = {
				ruleA: 50,
				ruleB: 30,
				ruleC: 20,
			};

			timingForDisplay.display(mockData);

			assert.equal(consoleSpy.mock.callCount(), 1);
			assert.deepEqual(consoleSpy.mock.calls[0].arguments, [
				stripIndent`
				| # | Rule  | Time (ms) | Relative |
				|--:|:------|----------:|---------:|
				| 1 | ruleA |    50.000 |    50.0% |
			`,
			]);
		});

		it('should size the columns to the widest cell', async () => {
			const timingForDisplay = await getTimingForDisplay('all');

			const mockData = {
				'no-descending-specificity': 1234.5,
				a: 0.5,
			};

			timingForDisplay.display(mockData);

			assert.deepEqual(
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
		it('should be false if TIMING is invalid', async () => {
			const timingForDisplay = await getTimingForDisplay('true');

			assert.equal(timingForDisplay.enabled, false);
		});

		it('should be false if TIMING is a negative value', async () => {
			const timingForDisplay = await getTimingForDisplay('-1');

			assert.equal(timingForDisplay.enabled, false);
		});

		it('should be false if TIMING=0', async () => {
			const timingForDisplay = await getTimingForDisplay('0');

			assert.equal(timingForDisplay.enabled, false);
		});

		it('should be true if TIMING is a positive number', async () => {
			const timingForDisplay = await getTimingForDisplay('1');

			assert.equal(timingForDisplay.enabled, true);
		});

		it('should be true if TIMING="all"', async () => {
			const timingForDisplay = await getTimingForDisplay('all');

			assert.equal(timingForDisplay.enabled, true);
		});
	});
});
