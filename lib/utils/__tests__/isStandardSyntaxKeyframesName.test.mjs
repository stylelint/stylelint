import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isStandardSyntaxKeyframesName from '../isStandardSyntaxKeyframesName.mjs';

describe('isStandardSyntaxKeyframesName', () => {
	it('standard name', () => {
		assert.equal(isStandardSyntaxKeyframesName('slidein'), true);
	});
	it('hyphenated name', () => {
		assert.equal(isStandardSyntaxKeyframesName('slide-in'), true);
	});
	it('name with underscore', () => {
		assert.equal(isStandardSyntaxKeyframesName('slide_in'), true);
	});
	it('scss interpolation', () => {
		assert.equal(isStandardSyntaxKeyframesName('frame-#{$name}'), false);
	});
	it('scss interpolation start', () => {
		assert.equal(isStandardSyntaxKeyframesName('#{$name}-frame'), false);
	});
	it('scss interpolation single quoted', () => {
		assert.equal(isStandardSyntaxKeyframesName("'frame-#{$name}'"), false);
	});
	it('scss interpolation single quoted start', () => {
		assert.equal(isStandardSyntaxKeyframesName("'#{$name}-frame'"), false);
	});
	it('scss interpolation double quoted', () => {
		assert.equal(isStandardSyntaxKeyframesName('"frame-#{$name}"'), false);
	});
	it('scss interpolation doubled quoted start', () => {
		assert.equal(isStandardSyntaxKeyframesName('"#{$name}-frame"'), false);
	});
	it('less interpolation', () => {
		assert.equal(isStandardSyntaxKeyframesName('frame-@{name}'), false);
	});
	it('less interpolation start', () => {
		assert.equal(isStandardSyntaxKeyframesName('@{name}-frame'), false);
	});
	it('less interpolation single quoted', () => {
		assert.equal(isStandardSyntaxKeyframesName("'frame-@{name}'"), false);
	});
	it('less interpolation single quoted start', () => {
		assert.equal(isStandardSyntaxKeyframesName("'@{name}-frame'"), false);
	});
	it('less interpolation double quoted', () => {
		assert.equal(isStandardSyntaxKeyframesName('"frame-@{name}"'), false);
	});
	it('less interpolation doubled quoted start', () => {
		assert.equal(isStandardSyntaxKeyframesName('"@{name}-frame"'), false);
	});
});
