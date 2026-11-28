import { it, mock } from 'node:test';
import child_process from 'node:child_process';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { promisify } from 'node:util';

import standalone from '../standalone.mjs';

const execFile = promisify(child_process.execFile);

// The table is printed when the process exits, so only a child process can show it
const lintInChildProcess = (...args) =>
	execFile(
		process.execPath,
		[
			fileURLToPath(new URL('../../bin/stylelint.mjs', import.meta.url)),
			'--config=config-color-no-invalid-hex.json',
			...args,
			'empty-block.css',
			'empty-block-with-disables.css',
		],
		{
			cwd: fileURLToPath(new URL('./fixtures', import.meta.url)),
			env: { ...process.env, TIMING: 'all' },
		},
	);

const countTables = (stdout) => stdout.match(/Time \(ms\)/g)?.length ?? 0;

it('times each rule when TIMING is set', async (t) => {
	process.env.TIMING = '1';
	mock.method(console, 'log', () => {});

	const { default: timing } = await import('../timing.mjs');
	const time = t.mock.method(timing, 'time');

	const { results } = await standalone({
		code: 'a {}',
		config: { rules: { 'block-no-empty': true, 'comment-no-empty': true } },
	});

	t.assert.deepStrictEqual(
		time.mock.calls.map((call) => call.arguments[0]),
		['block-no-empty', 'comment-no-empty'],
	);
	t.assert.deepStrictEqual(
		results[0].warnings.map((warning) => warning.rule),
		['block-no-empty'],
	);
});

for (const args of [[], ['--concurrency=2']]) {
	it(`prints one table with the arguments: ${args}`, async (t) => {
		const { stdout } = await lintInChildProcess(...args);

		t.assert.strictEqual(countTables(stdout), 1);
		t.assert.match(stdout, /\| color-no-invalid-hex \|/);
	});
}

it('prints no table when a worker thread fails', async (t) => {
	await t.assert.rejects(
		lintInChildProcess('--concurrency=2', '--custom-syntax=./syntax-exiting-worker.mjs'),
		({ stdout, stderr }) => {
			t.assert.match(stderr, /A worker thread exited unexpectedly with code 3/);
			t.assert.strictEqual(countTables(stdout), 0);

			return true;
		},
	);
});
