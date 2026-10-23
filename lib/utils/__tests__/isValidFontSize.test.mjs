import { it } from 'node:test';

import isValidFontSize from '../isValidFontSize.mjs';

it('isValidFontSize', (t) => {
	t.assert.ok(isValidFontSize('10px'));
	t.assert.ok(isValidFontSize('20%'));
	t.assert.ok(!isValidFontSize('20'));
	t.assert.ok(isValidFontSize('small'));
	t.assert.ok(isValidFontSize('smaller'));
	t.assert.ok(!isValidFontSize('smallest'));
	t.assert.ok(isValidFontSize('math'));
	t.assert.ok(!isValidFontSize(null));
});
