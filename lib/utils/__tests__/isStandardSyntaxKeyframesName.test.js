'use strict';

const isStandardSyntaxKeyframesName = require('../isStandardSyntaxKeyframesName');

describe('isStandardSyntaxKeyframesName', () => {
	it('standard name', () => {
		expect(isStandardSyntaxKeyframesName('slidein {}')).toBe(true);
	});
	it('hyphenated name', () => {
		expect(isStandardSyntaxKeyframesName('slide-in {}')).toBe(true);
	});
	it('name with underscore', () => {
		expect(isStandardSyntaxKeyframesName('slide_in {}')).toBe(true);
	});
	it('scss interpolation', () => {
		expect(isStandardSyntaxKeyframesName('frame-#{$name} {}')).toBe(false);
	});
	it('scss interpolation start', () => {
		expect(isStandardSyntaxKeyframesName('#{$name}-frame {}')).toBe(false);
	});
	it('scss interpolation single quoted', () => {
		expect(isStandardSyntaxKeyframesName("'frame-#{$name}' {}")).toBe(false);
	});
	it('scss interpolation single quoted start', () => {
		expect(isStandardSyntaxKeyframesName("'#{$name}-frame' {}")).toBe(false);
	});
	it('scss interpolation double quoted', () => {
		expect(isStandardSyntaxKeyframesName('"frame-#{$name}" {}')).toBe(false);
	});
	it('scss interpolation doubled quoted start', () => {
		expect(isStandardSyntaxKeyframesName('"#{$name}-frame" {}')).toBe(false);
	});
	it('less interpolation', () => {
		expect(isStandardSyntaxKeyframesName('frame-@{name} {}')).toBe(false);
	});
	it('less interpolation start', () => {
		expect(isStandardSyntaxKeyframesName('@{name}-frame {}')).toBe(false);
	});
	it('less interpolation single quoted', () => {
		expect(isStandardSyntaxKeyframesName("'frame-@{name}' {}")).toBe(false);
	});
	it('less interpolation single quoted start', () => {
		expect(isStandardSyntaxKeyframesName("'@{name}-frame {}' {}")).toBe(false);
	});
	it('less interpolation double quoted', () => {
		expect(isStandardSyntaxKeyframesName('"frame-@{name}" {}')).toBe(false);
	});
	it('less interpolation doubled quoted start', () => {
		expect(isStandardSyntaxKeyframesName('"@{name}-frame" {}')).toBe(false);
	});
});
