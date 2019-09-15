'use strict';

const isStandardSyntaxMediaFeatureName = require('../isStandardSyntaxMediaFeatureName');

describe('isStandardSyntaxMediaFeatureName', () => {
	it('keyword', () => {
		expect(isStandardSyntaxMediaFeatureName('min-width')).toBeTruthy();
	});
	it('vendor prefixed keyword', () => {
		expect(isStandardSyntaxMediaFeatureName('-webkit-min-device-pixel-ratio')).toBeTruthy();
	});
	it('custom media query', () => {
		expect(isStandardSyntaxMediaFeatureName('--viewport-medium')).toBeTruthy();
	});
	it('scss var', () => {
		expect(isStandardSyntaxMediaFeatureName('$sass-variable')).toBeFalsy();
	});
	it('scss var addition', () => {
		expect(isStandardSyntaxMediaFeatureName('min-width + $value')).toBeFalsy();
	});
	it('scss var added to', () => {
		expect(isStandardSyntaxMediaFeatureName('$value + min-width')).toBeFalsy();
	});
	it('scss var single quoted addition', () => {
		expect(isStandardSyntaxMediaFeatureName("'min-width + $value'")).toBeFalsy();
	});
	it('scss var single quoted added to ', () => {
		expect(isStandardSyntaxMediaFeatureName("'$value + min-width'")).toBeFalsy();
	});
	it('scss var doubled quoted addition', () => {
		expect(isStandardSyntaxMediaFeatureName('"min-width + $value"')).toBeFalsy();
	});
	it('scss var doubled quoted added to', () => {
		expect(isStandardSyntaxMediaFeatureName('"$value + min-width"')).toBeFalsy();
	});
	it('scss interpolation', () => {
		expect(isStandardSyntaxMediaFeatureName('min-width#{$value}')).toBeFalsy();
	});
	it('scss interpolation start', () => {
		expect(isStandardSyntaxMediaFeatureName('#{$value}min-width')).toBeFalsy();
	});
	it('scss interpolation single quoted', () => {
		expect(isStandardSyntaxMediaFeatureName("'min-width#{$value}'")).toBeFalsy();
	});
	it('scss interpolation single quoted start', () => {
		expect(isStandardSyntaxMediaFeatureName("'#{$value}min-width'")).toBeFalsy();
	});
	it('scss interpolation double quoted', () => {
		expect(isStandardSyntaxMediaFeatureName('"min-width#{$value}"')).toBeFalsy();
	});
	it('scss interpolation doubled quoted start', () => {
		expect(isStandardSyntaxMediaFeatureName('"#{$value}min-width"')).toBeFalsy();
	});
});
