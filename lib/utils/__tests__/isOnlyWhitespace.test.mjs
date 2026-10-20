import assert from 'node:assert/strict';
import { it } from 'node:test';

import isOnlyWhitespace from '../isOnlyWhitespace.mjs';

it('isOnlyWhitespace', () => {
	assert.ok(isOnlyWhitespace('\r\n \t \n   '));
	assert.ok(!isOnlyWhitespace('   s'));
	assert.ok(!isOnlyWhitespace('s\t'));
	assert.ok(!isOnlyWhitespace('\n  .\t'));
});
