import { it } from 'node:test';

import isOnlyWhitespace from '../isOnlyWhitespace.mjs';

it('isOnlyWhitespace', (t) => {
	t.assert.ok(isOnlyWhitespace('\r\n \t \n   '));
	t.assert.ok(!isOnlyWhitespace('   s'));
	t.assert.ok(!isOnlyWhitespace('s\t'));
	t.assert.ok(!isOnlyWhitespace('\n  .\t'));
});
