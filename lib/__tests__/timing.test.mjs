import { jest } from '@jest/globals';
import process from 'node:process';
import timing from '../timing.mjs';

describe('timing', () => {
	describe('getListSize()', () => {
		const OLD_ENV = process.env;

		beforeEach(() => {
			jest.resetModules();
			process.env = { ...OLD_ENV };
		});

		afterAll(() => {
			process.env = OLD_ENV;
		});

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
});
