const { mkdir } = require('fs').promises;

/**
 * A safe `process.chdir()`.
 *
 * @param {string} dir - will be created if not exists
 * @returns {void}
 */
module.exports = function safeChdir(dir) {
	/** @type {string | undefined} */
	let actualCwd;

	// @ts-expect-error - Jest global
	beforeEach(async () => {
		actualCwd = process.cwd();
		await mkdir(dir, { recursive: true });
		process.chdir(dir);
	});

	// @ts-expect-error - Jest global
	afterEach(() => {
		if (actualCwd) process.chdir(actualCwd);
	});
};
