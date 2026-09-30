import child_process from 'node:child_process';
import process from 'node:process';
import { promisify } from 'node:util';

const execFile = promisify(child_process.execFile);

/**
 * Use `node -e` because Node.js reads the environment variables of the real process, not Jest's copy.
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
	it('styles the text when color is on, ignoring NO_COLOR', async () => {
		expect(await styleRedTextInChildProcess(true, { NO_COLOR: '1' })).toBe(
			'\u001B[31mfoo\u001B[39m',
		);
	});

	it('returns the text unchanged when color is off, ignoring FORCE_COLOR', async () => {
		expect(await styleRedTextInChildProcess(false, { FORCE_COLOR: '1' })).toBe('foo');
	});

	it('lets Node.js detect color support when color is not given', async () => {
		expect(await styleRedTextInChildProcess(undefined, { FORCE_COLOR: '1' })).toBe(
			'\u001B[31mfoo\u001B[39m',
		);
		expect(await styleRedTextInChildProcess(undefined, { FORCE_COLOR: '0' })).toBe('foo');
	});
});
