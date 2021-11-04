'use strict';

const isStandardSyntaxHexColor = require('../isStandardSyntaxHexColor');

describe('isStandardSyntaxHexColor', () => {
	it('default hex', () => {
		expect(isStandardSyntaxHexColor('#000000')).toBeTruthy();
	});
	it('less map usage', () => {
		expect(isStandardSyntaxHexColor('#prop[someprop]')).toBeFalsy();
	});
});
