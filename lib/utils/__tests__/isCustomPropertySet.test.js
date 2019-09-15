'use strict';

const isCustomPropertySet = require('../isCustomPropertySet');
const postcss = require('postcss');

describe('isCustomPropertySet', () => {
	it('accepts custom property set', () => {
		customPropertySet('--foo: {};', (customPropertySet) => {
			expect(isCustomPropertySet(customPropertySet)).toBeTruthy();
		});
	});

	it('rejects custom property', () => {
		customPropertySet('--foo: red;', (customPropertySet) => {
			expect(isCustomPropertySet(customPropertySet)).toBeFalsy();
		});
	});
});

function customPropertySet(css, cb) {
	postcss.parse(css).walk(cb);
}
