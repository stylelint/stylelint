'use strict';

const isStandardSyntaxKeyframesName = require('../isStandardSyntaxKeyframesName');

describe('isStandardSyntaxKeyframesName', () => {
	it('standard name', () => {
		expect(isStandardSyntaxKeyframesName('slidein {}')).toBeTruthy();
	});
	it('hyphenated name', () => {
		expect(isStandardSyntaxKeyframesName('slide-in {}')).toBeTruthy();
	});
	it('name with underscore', () => {
		expect(isStandardSyntaxKeyframesName('slide_in {}')).toBeTruthy();
	});
	it('scss interpolation', () => {
		expect(isStandardSyntaxKeyframesName('frame-#{$name} {}')).toBeFalsy();
	});
	it('scss interpolation start', () => {
		expect(isStandardSyntaxKeyframesName('#{$name}-frame {}')).toBeFalsy();
	});
	it('scss interpolation single quoted', () => {
		expect(isStandardSyntaxKeyframesName("'frame-#{$name}' {}")).toBeFalsy();
	});
	it('scss interpolation single quoted start', () => {
		expect(isStandardSyntaxKeyframesName("'#{$name}-frame' {}")).toBeFalsy();
	});
	it('scss interpolation double quoted', () => {
		expect(isStandardSyntaxKeyframesName('"frame-#{$name}" {}')).toBeFalsy();
	});
	it('scss interpolation doubled quoted start', () => {
		expect(isStandardSyntaxKeyframesName('"#{$name}-frame" {}')).toBeFalsy();
	});
	it('less interpolation', () => {
		expect(isStandardSyntaxKeyframesName('frame-@{name} {}')).toBeFalsy();
	});
	it('less interpolation start', () => {
		expect(isStandardSyntaxKeyframesName('@{name}-frame {}')).toBeFalsy();
	});
	it('less interpolation single quoted', () => {
		expect(isStandardSyntaxKeyframesName("'frame-@{name}' {}")).toBeFalsy();
	});
	it('less interpolation single quoted start', () => {
		expect(isStandardSyntaxKeyframesName("'@{name}-frame {}' {}")).toBeFalsy();
	});
	it('less interpolation double quoted', () => {
		expect(isStandardSyntaxKeyframesName('"frame-@{name}" {}')).toBeFalsy();
	});
	it('less interpolation doubled quoted start', () => {
		expect(isStandardSyntaxKeyframesName('"@{name}-frame" {}')).toBeFalsy();
	});
});
