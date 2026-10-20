import assert from 'node:assert/strict';
import { it } from 'node:test';

import getFormatterOptionsText from '../getFormatterOptionsText.mjs';

it('getFormatterOptionsText', () => {
	assert.equal(getFormatterOptionsText(', '), 'compact, json, string, tap, unix, verbose');
	assert.equal(
		getFormatterOptionsText(', ', '"'),
		'"compact", "json", "string", "tap", "unix", "verbose"',
	);
});
