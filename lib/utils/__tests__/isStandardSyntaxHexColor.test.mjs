import { describe, it } from 'node:test';

import isStandardSyntaxHexColor from '../isStandardSyntaxHexColor.mjs';

describe('isStandardSyntaxHexColor', () => {
	it('default hex', (t) => {
		t.assert.strictEqual(isStandardSyntaxHexColor('#000000'), true);
	});
	it('less map usage', (t) => {
		t.assert.strictEqual(isStandardSyntaxHexColor('#prop[someprop]'), false);
	});
});
