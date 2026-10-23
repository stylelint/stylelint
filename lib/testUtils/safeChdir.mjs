import { afterEach, beforeEach } from 'node:test';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';
import process from 'node:process';

/**
 * A safe `process.chdir()`.
 *
 * @param {string | URL} dir - will be created if not exists
 * @returns {void}
 */
export default function safeChdir(dir) {
	/** @type {string | undefined} */
	let actualCwd;

	beforeEach(async () => {
		actualCwd = process.cwd();
		await mkdir(dir, { recursive: true });
		process.chdir(typeof dir === 'string' ? dir : fileURLToPath(dir));
	});

	afterEach(() => {
		if (actualCwd) process.chdir(actualCwd);
	});
}
