import { it, mock } from 'node:test';
import process from 'node:process';

import standalone from '../standalone.mjs';

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
