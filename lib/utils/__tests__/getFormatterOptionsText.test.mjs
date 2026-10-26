import { it } from 'node:test';

import getFormatterOptionsText from '../getFormatterOptionsText.mjs';

it('getFormatterOptionsText', (t) => {
	t.assert.strictEqual(getFormatterOptionsText(', '), 'compact, json, string, tap, unix, verbose');
	t.assert.strictEqual(
		getFormatterOptionsText(', ', '"'),
		'"compact", "json", "string", "tap", "unix", "verbose"',
	);
});
