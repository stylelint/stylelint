import assert from 'node:assert/strict';
import { it } from 'node:test';

import isValidIdentifier from '../isValidIdentifier.mjs';

it('isValidIdentifier', () => {
	assert.ok(isValidIdentifier('foo'));
	assert.ok(isValidIdentifier('foo1'));
	assert.ok(!isValidIdentifier('1'));
	assert.ok(!isValidIdentifier('-1'));
	assert.ok(isValidIdentifier('--foo'));
	assert.ok(!isValidIdentifier('has a space'));
	assert.ok(!isValidIdentifier(null));
	assert.ok(!isValidIdentifier(''));
	assert.ok(!isValidIdentifier(' '));
	assert.ok(!isValidIdentifier('foö'));
	assert.ok(isValidIdentifier('\\26 B')); // ISO 10646 character
	assert.ok(isValidIdentifier('\\000026B')); // ISO 10646 character
	assert.ok(!isValidIdentifier("te'st")); // unescaped quotation mark
	assert.ok(!isValidIdentifier('te"st')); // unescaped quotation mark
	assert.ok(isValidIdentifier("te\\'st")); // escaped (in CSS) quotation mark
	assert.ok(isValidIdentifier('te\\"st')); // escaped (in CSS) quotation mark
	assert.ok(isValidIdentifier("te\\'s\\'t")); // escaped (in CSS) quotation mark
	assert.ok(isValidIdentifier('te\\"s\\"t')); // escaped (in CSS) quotation mark
});
