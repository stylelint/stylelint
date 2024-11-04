import process from 'node:process';

import timing from '../timing.mjs';

describe('timing', () => {
	describe('getListSize()', () => {
		afterEach(() => {
			delete process.env.TIMING;
		});

		it('should return minimum list size when TIMING is not set or has a small value', () => {
			delete process.env.TIMING;
			expect(timing.getListSize()).toBe(10);

			process.env.TIMING = 'true';
			expect(timing.getListSize()).toBe(10);

			process.env.TIMING = 'foo';
			expect(timing.getListSize()).toBe(10);

			process.env.TIMING = '0';
			expect(timing.getListSize()).toBe(10);

			process.env.TIMING = '10';
			expect(timing.getListSize()).toBe(10);
		});

		it('should return a larger list size when TIMING has a larger value', () => {
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
