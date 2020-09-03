'use strict';

const isCustomPropertySet = require('../isCustomPropertySet');
const postcss = require('postcss');

describe('isCustomPropertySet', () => {
	it('accepts custom property set', () => {
		expect(isCustomPropertySet(node('--foo: {};'))).toBeTruthy();
	});

	it('rejects custom property', () => {
		expect(isCustomPropertySet(node('--foo: red;'))).toBeFalsy();
	});
});

function node(css) {
	return postcss.parse(css).first;
}
