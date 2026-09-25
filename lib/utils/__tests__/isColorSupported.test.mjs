import process from 'node:process';

import isColorSupported from '../isColorSupported.mjs';
import withMockedPlatform from '../../testUtils/withMockedPlatform.mjs';

describe('isColorSupported', () => {
	const originalEnv = process.env;
	const originalIsTTY = process.stdout.isTTY;

	beforeEach(() => {
		process.env = { ...originalEnv };
		delete process.env.CI;
		delete process.env.FORCE_COLOR;
		delete process.env.NO_COLOR;
		delete process.env.TERM;
		process.stdout.isTTY = false;
	});

	afterEach(() => {
		process.env = originalEnv;
		process.stdout.isTTY = originalIsTTY;
	});

	it('is not supported when stdout is not a TTY', async () => {
		await withMockedPlatform('linux', async () => {
			expect(isColorSupported()).toBe(false);
		});
	});

	it('is supported when stdout is a TTY', () => {
		process.stdout.isTTY = true;

		expect(isColorSupported()).toBe(true);
	});

	it('is not supported by a dumb terminal', async () => {
		process.stdout.isTTY = true;
		process.env.TERM = 'dumb';

		await withMockedPlatform('linux', async () => {
			expect(isColorSupported()).toBe(false);
		});
	});

	it('is supported on Windows', async () => {
		await withMockedPlatform('win32', async () => {
			expect(isColorSupported()).toBe(true);
		});
	});

	it('is supported in CI', () => {
		process.env.CI = 'true';

		expect(isColorSupported()).toBe(true);
	});

	it('is supported with FORCE_COLOR', () => {
		process.env.FORCE_COLOR = '1';

		expect(isColorSupported()).toBe(true);
	});

	it('is not supported with NO_COLOR, even with FORCE_COLOR', async () => {
		process.env.FORCE_COLOR = '1';
		process.env.NO_COLOR = '1';

		await withMockedPlatform('linux', async () => {
			expect(isColorSupported()).toBe(false);
		});
	});
});
