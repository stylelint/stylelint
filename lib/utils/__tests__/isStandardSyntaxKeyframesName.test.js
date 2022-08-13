'use strict';

const isStandardSyntaxKeyframesName = require('../isStandardSyntaxKeyframesName');

describe('isStandardSyntaxKeyframesName', () => {
	it('standard name', () => {
		expect(isStandardSyntaxKeyframesName('@keyframes slidein {}')).toBeTruthy();
	});
	it('hyphenated name', () => {
		expect(isStandardSyntaxKeyframesName('@keyframes slide-in {}')).toBeTruthy();
	});
	it('name with underscore', () => {
		expect(isStandardSyntaxKeyframesName('@keyframes slide_in {}')).toBeTruthy();
	});
	it('scss interpolation', () => {
		expect(isStandardSyntaxKeyframesName('@keyframes frame-#{$name} {}')).toBeFalsy();
	});
	it('scss interpolation start', () => {
		expect(isStandardSyntaxKeyframesName('@keyframes #{$name}-frame {}')).toBeFalsy();
	});
	it('scss interpolation single quoted', () => {
		expect(isStandardSyntaxKeyframesName("@keyframes 'frame-#{$name}' {}")).toBeFalsy();
	});
	it('scss interpolation single quoted start', () => {
		expect(isStandardSyntaxKeyframesName("@keyframes '#{$name}-frame' {}")).toBeFalsy();
	});
	it('scss interpolation double quoted', () => {
		expect(isStandardSyntaxKeyframesName('@keyframes "frame-#{$name}" {}')).toBeFalsy();
	});
	it('scss interpolation doubled quoted start', () => {
		expect(isStandardSyntaxKeyframesName('@keyframes "#{$name}-frame" {}')).toBeFalsy();
	});
	it('less interpolation', () => {
		expect(isStandardSyntaxKeyframesName('@keyframes frame-@{name} {}')).toBeFalsy();
	});
	it('less interpolation start', () => {
		expect(isStandardSyntaxKeyframesName('@keyframes @{name}-frame {}')).toBeFalsy();
	});
	it('less interpolation single quoted', () => {
		expect(isStandardSyntaxKeyframesName("@keyframes 'frame-@{name}' {}")).toBeFalsy();
	});
	it('less interpolation single quoted start', () => {
		expect(isStandardSyntaxKeyframesName("@keyframes '@{name}-frame {}' {}")).toBeFalsy();
	});
	it('less interpolation double quoted', () => {
		expect(isStandardSyntaxKeyframesName('@keyframes "frame-@{name}" {}')).toBeFalsy();
	});
	it('less interpolation doubled quoted start', () => {
		expect(isStandardSyntaxKeyframesName('@keyframes "@{name}-frame" {}')).toBeFalsy();
	});
});
