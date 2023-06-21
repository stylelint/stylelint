const { mkdir } = require('node:fs/promises');
const { fileURLToPath } = require('node:url');
const { beforeEach, afterEach } = require('@jest/globals');

/**
 * A safe `process.chdir()`.
 *
 * @param {string | URL} dir - will be created if not exists
 * @returns {void}
 */
module.exports = function safeChdir(dir) {
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
};
