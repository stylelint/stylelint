import assert from 'node:assert/strict';
import { it } from 'node:test';

import isValidFontSize from '../isValidFontSize.mjs';

it('isValidFontSize', () => {
	assert.ok(isValidFontSize('10px'));
	assert.ok(isValidFontSize('20%'));
	assert.ok(!isValidFontSize('20'));
	assert.ok(isValidFontSize('small'));
	assert.ok(isValidFontSize('smaller'));
	assert.ok(!isValidFontSize('smallest'));
	assert.ok(isValidFontSize('math'));
	assert.ok(!isValidFontSize(null));
});
