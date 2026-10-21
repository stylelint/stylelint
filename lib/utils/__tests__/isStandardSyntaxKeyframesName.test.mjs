import { describe, it } from 'node:test';

import isStandardSyntaxKeyframesName from '../isStandardSyntaxKeyframesName.mjs';

describe('isStandardSyntaxKeyframesName', () => {
	it('standard name', (t) => {
		t.assert.strictEqual(isStandardSyntaxKeyframesName('slidein'), true);
	});
	it('hyphenated name', (t) => {
		t.assert.strictEqual(isStandardSyntaxKeyframesName('slide-in'), true);
	});
	it('name with underscore', (t) => {
		t.assert.strictEqual(isStandardSyntaxKeyframesName('slide_in'), true);
	});
	it('scss interpolation', (t) => {
		t.assert.strictEqual(isStandardSyntaxKeyframesName('frame-#{$name}'), false);
	});
	it('scss interpolation start', (t) => {
		t.assert.strictEqual(isStandardSyntaxKeyframesName('#{$name}-frame'), false);
	});
	it('scss interpolation single quoted', (t) => {
		t.assert.strictEqual(isStandardSyntaxKeyframesName("'frame-#{$name}'"), false);
	});
	it('scss interpolation single quoted start', (t) => {
		t.assert.strictEqual(isStandardSyntaxKeyframesName("'#{$name}-frame'"), false);
	});
	it('scss interpolation double quoted', (t) => {
		t.assert.strictEqual(isStandardSyntaxKeyframesName('"frame-#{$name}"'), false);
	});
	it('scss interpolation doubled quoted start', (t) => {
		t.assert.strictEqual(isStandardSyntaxKeyframesName('"#{$name}-frame"'), false);
	});
	it('less interpolation', (t) => {
		t.assert.strictEqual(isStandardSyntaxKeyframesName('frame-@{name}'), false);
	});
	it('less interpolation start', (t) => {
		t.assert.strictEqual(isStandardSyntaxKeyframesName('@{name}-frame'), false);
	});
	it('less interpolation single quoted', (t) => {
		t.assert.strictEqual(isStandardSyntaxKeyframesName("'frame-@{name}'"), false);
	});
	it('less interpolation single quoted start', (t) => {
		t.assert.strictEqual(isStandardSyntaxKeyframesName("'@{name}-frame'"), false);
	});
	it('less interpolation double quoted', (t) => {
		t.assert.strictEqual(isStandardSyntaxKeyframesName('"frame-@{name}"'), false);
	});
	it('less interpolation doubled quoted start', (t) => {
		t.assert.strictEqual(isStandardSyntaxKeyframesName('"@{name}-frame"'), false);
	});
});
