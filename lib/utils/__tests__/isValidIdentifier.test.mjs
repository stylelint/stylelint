import { it } from 'node:test';

import isValidIdentifier from '../isValidIdentifier.mjs';

it('isValidIdentifier', (t) => {
	t.assert.ok(isValidIdentifier('foo'));
	t.assert.ok(isValidIdentifier('foo1'));
	t.assert.ok(!isValidIdentifier('1'));
	t.assert.ok(!isValidIdentifier('-1'));
	t.assert.ok(isValidIdentifier('--foo'));
	t.assert.ok(!isValidIdentifier('has a space'));
	t.assert.ok(!isValidIdentifier(null));
	t.assert.ok(!isValidIdentifier(''));
	t.assert.ok(!isValidIdentifier(' '));
	t.assert.ok(!isValidIdentifier('foö'));
	t.assert.ok(isValidIdentifier('\\26 B')); // ISO 10646 character
	t.assert.ok(isValidIdentifier('\\000026B')); // ISO 10646 character
	t.assert.ok(!isValidIdentifier("te'st")); // unescaped quotation mark
	t.assert.ok(!isValidIdentifier('te"st')); // unescaped quotation mark
	t.assert.ok(isValidIdentifier("te\\'st")); // escaped (in CSS) quotation mark
	t.assert.ok(isValidIdentifier('te\\"st')); // escaped (in CSS) quotation mark
	t.assert.ok(isValidIdentifier("te\\'s\\'t")); // escaped (in CSS) quotation mark
	t.assert.ok(isValidIdentifier('te\\"s\\"t')); // escaped (in CSS) quotation mark
});
