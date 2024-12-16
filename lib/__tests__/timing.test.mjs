import { jest } from '@jest/globals';
import process from 'node:process';
import { table } from 'table';
import timing from '../timing.mjs';

describe('timing', () => {
	const OLD_ENV = process.env;

	beforeEach(() => {
		jest.resetModules();
		process.env = { ...OLD_ENV };
	});

	afterAll(() => {
		process.env = OLD_ENV;
	});

	// Helper function to get a fresh `timing` instance for a given TIMING value.
	async function getTimingForDisplay(TIMINGValue) {
		jest.resetModules();
		process.env.TIMING = TIMINGValue;
		const timingModule = await import('../timing.mjs');

		return timingModule.default;
	}

	describe('getListSize()', () => {
		it('should return 0 when TIMING is not set or invalid', () => {
			delete process.env.TIMING;
			expect(timing.getListSize()).toBe(0);

			process.env.TIMING = 'true';
			expect(timing.getListSize()).toBe(0);

			process.env.TIMING = 'foo';
			expect(timing.getListSize()).toBe(0);

			process.env.TIMING = '-1';
			expect(timing.getListSize()).toBe(0);
		});

		it('should return the numeric value when TIMING is a valid number >= 1', () => {
			process.env.TIMING = '1';
			expect(timing.getListSize()).toBe(1);

			process.env.TIMING = '10';
			expect(timing.getListSize()).toBe(10);

			process.env.TIMING = '15';
			expect(timing.getListSize()).toBe(15);

			process.env.TIMING = '100';
			expect(timing.getListSize()).toBe(100);
		});

		it('should return maximum list size when TIMING is set to "all"', () => {
			process.env.TIMING = 'all';
			expect(timing.getListSize()).toBe(Number.POSITIVE_INFINITY);

			process.env.TIMING = 'ALL';
			expect(timing.getListSize()).toBe(Number.POSITIVE_INFINITY);
		});
	});

	describe('display()', () => {
		let consoleSpy;

		beforeEach(() => {
			consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
		});

		afterEach(() => {
			consoleSpy.mockRestore();
		});

		it('should display the timing data in a table format', async () => {
			const timingForDisplay = await getTimingForDisplay('3');

			const mockData = {
				ruleA: 50,
				ruleB: 30,
				ruleC: 20,
			};

			const expectedRows = [
				['#', 'Rule', 'Time (ms)', 'Relative'],
				[1, 'ruleA', '50.000', '50.0%'],
				[2, 'ruleB', '30.000', '30.0%'],
				[3, 'ruleC', '20.000', '20.0%'],
			];

			const expectedTable = table(expectedRows, timingForDisplay.tableConfig);

			timingForDisplay.display(mockData);

			expect(consoleSpy).toHaveBeenCalledTimes(1);
			expect(consoleSpy).toHaveBeenCalledWith(expectedTable);
		});

		it('should display only the top 1 if TIMING=1 and there are 3 data entries', async () => {
			const timingForDisplay = await getTimingForDisplay('1');

			const mockData = {
				ruleA: 50,
				ruleB: 30,
				ruleC: 20,
			};

			const expectedRows = [
				['#', 'Rule', 'Time (ms)', 'Relative'],
				[1, 'ruleA', '50.000', '50.0%'],
			];

			const expectedTable = table(expectedRows, timingForDisplay.tableConfig);

			timingForDisplay.display(mockData);

			expect(consoleSpy).toHaveBeenCalledTimes(1);
			expect(consoleSpy).toHaveBeenCalledWith(expectedTable);
		});
	});

	describe('enabled property', () => {
		it('should be false if TIMING is invalid', async () => {
			const timingForDisplay = await getTimingForDisplay('true');

			expect(timingForDisplay.enabled).toBe(false);
		});

		it('should be false if TIMING is a negative value', async () => {
			const timingForDisplay = await getTimingForDisplay('-1');

			expect(timingForDisplay.enabled).toBe(false);
		});

		it('should be false if TIMING=0', async () => {
			const timingForDisplay = await getTimingForDisplay('0');

			expect(timingForDisplay.enabled).toBe(false);
		});

		it('should be true if TIMING is a positive number', async () => {
			const timingForDisplay = await getTimingForDisplay('1');

			expect(timingForDisplay.enabled).toBe(true);
		});

		it('should be true if TIMING="all"', async () => {
			const timingForDisplay = await getTimingForDisplay('all');

			expect(timingForDisplay.enabled).toBe(true);
		});
	});
});
