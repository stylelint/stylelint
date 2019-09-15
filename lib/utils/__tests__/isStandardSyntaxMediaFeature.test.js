'use strict';

const isStandardSyntaxMediaFeature = require('../isStandardSyntaxMediaFeature');

describe('isStandardSyntaxMediaFeature', () => {
	it('prefix on range features', () => {
		const css = '(min-width: 10px)';

		expect(isStandardSyntaxMediaFeature(css)).toBeTruthy();
	});
	it('range context', () => {
		const css = '(width <= 3rem)';

		expect(isStandardSyntaxMediaFeature(css)).toBeTruthy();
	});
	it('nested range context', () => {
		const css = '(400px < width < 1000px)';

		expect(isStandardSyntaxMediaFeature(css)).toBeTruthy();
	});
	it('boolean context', () => {
		const css = '(color)';

		expect(isStandardSyntaxMediaFeature(css)).toBeTruthy();
	});
	it('complex value', () => {
		const css = '(min-width: calc(100% - 20px))';

		expect(isStandardSyntaxMediaFeature(css)).toBeFalsy();
	});
	it('complex SCSS value', () => {
		const css = '(min-width: ($var - 10px))';

		expect(isStandardSyntaxMediaFeature(css)).toBeFalsy();
	});
	it('SCSS interpolation', () => {
		const css = '(min-width#{$value}: 10px)';

		expect(isStandardSyntaxMediaFeature(css)).toBeFalsy();
	});
	it('Less interpolation', () => {
		const css = '(@{value}min-width : 10px)';

		expect(isStandardSyntaxMediaFeature(css)).toBeFalsy();
	});
});
