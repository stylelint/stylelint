import { describe, it } from 'node:test';
import child_process from 'node:child_process';
import process from 'node:process';
import { promisify } from 'node:util';

const execFile = promisify(child_process.execFile);

/**
 * Use `node -e` because Node.js reads the colour environment variables at startup, so only a child process can carry them.
 * @param {boolean | undefined} color
 * @param {Record<string, string>} env
 * @returns {Promise<string>}
 */
async function styleRedTextInChildProcess(color, env) {
	const { stdout } = await execFile(
		'node',
		[
			'-e',
			`import("../createStyleText.mjs").then(m => process.stdout.write(m.default(${color})("red", "foo")))`,
		],
		{ cwd: import.meta.dirname, env: { ...process.env, ...env } },
	);

	return stdout;
}

describe('createStyleText', () => {
	it('styles the text when color is on, ignoring NO_COLOR', async (t) => {
		t.assert.strictEqual(
			await styleRedTextInChildProcess(true, { NO_COLOR: '1' }),
			'\u001B[31mfoo\u001B[39m',
		);
	});

	it('returns the text unchanged when color is off, ignoring FORCE_COLOR', async (t) => {
		t.assert.strictEqual(await styleRedTextInChildProcess(false, { FORCE_COLOR: '1' }), 'foo');
	});

	it('lets Node.js detect color support when color is not given', async (t) => {
		t.assert.strictEqual(
			await styleRedTextInChildProcess(undefined, { FORCE_COLOR: '1' }),
			'\u001B[31mfoo\u001B[39m',
		);
		t.assert.strictEqual(await styleRedTextInChildProcess(undefined, { FORCE_COLOR: '0' }), 'foo');
	});
});
