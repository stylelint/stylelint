import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isStandardSyntaxHexColor from '../isStandardSyntaxHexColor.mjs';

describe('isStandardSyntaxHexColor', () => {
	it('default hex', () => {
		assert.equal(isStandardSyntaxHexColor('#000000'), true);
	});
	it('less map usage', () => {
		assert.equal(isStandardSyntaxHexColor('#prop[someprop]'), false);
	});
});
