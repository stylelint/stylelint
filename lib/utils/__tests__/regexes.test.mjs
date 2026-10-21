import { describe, it } from 'node:test';

import { atRuleRegexes, descriptorRegexes, mayIncludeRegexes } from '../regexes.mjs';

describe('atRuleRegexes', () => {
	it('matches "media" case-insensitively', (t) => {
		t.assert.strictEqual(atRuleRegexes.mediaName.test('media'), true);
		t.assert.strictEqual(atRuleRegexes.mediaName.test('MEDIA'), true);
		t.assert.strictEqual(atRuleRegexes.mediaName.test('Media'), true);
		t.assert.strictEqual(atRuleRegexes.mediaName.test('med'), false);
		t.assert.strictEqual(atRuleRegexes.mediaName.test('media-query'), false);
	});

	it('matches "keyframes" with or without vendor prefixes', (t) => {
		t.assert.strictEqual(atRuleRegexes.keyframesName.test('keyframes'), true);
		t.assert.strictEqual(atRuleRegexes.keyframesName.test('Keyframes'), true);
		t.assert.strictEqual(atRuleRegexes.keyframesName.test('-webkit-keyframes'), true);
		t.assert.strictEqual(atRuleRegexes.keyframesName.test('-moz-keyframes'), true);
		t.assert.strictEqual(atRuleRegexes.keyframesName.test('-o-keyframes'), true);
		t.assert.strictEqual(atRuleRegexes.keyframesName.test('-ms-keyframes'), true);
		t.assert.strictEqual(atRuleRegexes.keyframesName.test('keyframe'), false);
		t.assert.strictEqual(atRuleRegexes.keyframesName.test('my-keyframes'), false);
	});

	it('matches "property" case-insensitively', (t) => {
		t.assert.strictEqual(atRuleRegexes.propertyName.test('property'), true);
		t.assert.strictEqual(atRuleRegexes.propertyName.test('Property'), true);
		t.assert.strictEqual(atRuleRegexes.propertyName.test('PROPERTY'), true);
		t.assert.strictEqual(atRuleRegexes.propertyName.test('prop'), false);
		t.assert.strictEqual(atRuleRegexes.propertyName.test('property-value'), false);
	});

	it('matches "import" case-insensitively', (t) => {
		t.assert.strictEqual(atRuleRegexes.importName.test('import'), true);
		t.assert.strictEqual(atRuleRegexes.importName.test('Import'), true);
		t.assert.strictEqual(atRuleRegexes.importName.test('IMPORT'), true);
		t.assert.strictEqual(atRuleRegexes.importName.test('imp'), false);
		t.assert.strictEqual(atRuleRegexes.importName.test('import-value'), false);
	});

	it('identifies unsupported nesting rules correctly', (t) => {
		t.assert.strictEqual(atRuleRegexes.unsupportedNestingNames.test('container'), false);
		t.assert.strictEqual(atRuleRegexes.unsupportedNestingNames.test('layer'), false);
		t.assert.strictEqual(atRuleRegexes.unsupportedNestingNames.test('media'), false);
		t.assert.strictEqual(atRuleRegexes.unsupportedNestingNames.test('scope'), false);
		t.assert.strictEqual(atRuleRegexes.unsupportedNestingNames.test('foo'), true);
		t.assert.strictEqual(atRuleRegexes.unsupportedNestingNames.test('bar'), true);
	});

	it('matches "layer" case-insensitively', (t) => {
		t.assert.strictEqual(atRuleRegexes.layerName.test('layer'), true);
		t.assert.strictEqual(atRuleRegexes.layerName.test('Layer'), true);
		t.assert.strictEqual(atRuleRegexes.layerName.test('LAYER'), true);
		t.assert.strictEqual(atRuleRegexes.layerName.test('lay'), false);
		t.assert.strictEqual(atRuleRegexes.layerName.test('layer-name'), false);
	});
});

describe('descriptorRegexes', () => {
	it('matches "syntax" case-insensitively', (t) => {
		t.assert.strictEqual(descriptorRegexes.syntaxName.test('syntax'), true);
		t.assert.strictEqual(descriptorRegexes.syntaxName.test('Syntax'), true);
		t.assert.strictEqual(descriptorRegexes.syntaxName.test('SYNTAX'), true);
		t.assert.strictEqual(descriptorRegexes.syntaxName.test('syn'), false);
		t.assert.strictEqual(descriptorRegexes.syntaxName.test('syntax-value'), false);
	});
});

describe('mayIncludeRegexes', () => {
	it('layerFunction matches "layer" case-insensitively', (t) => {
		t.assert.strictEqual(mayIncludeRegexes.layerFunction.test('layer(foo)'), true);
		t.assert.strictEqual(mayIncludeRegexes.layerFunction.test('Layer(foo)'), true);
		t.assert.strictEqual(mayIncludeRegexes.layerFunction.test('LAYER(foo)'), true);
		t.assert.strictEqual(mayIncludeRegexes.layerFunction.test('layer(foo, bar)'), true);
		t.assert.strictEqual(mayIncludeRegexes.layerFunction.test('layer(foo'), true);
		t.assert.strictEqual(mayIncludeRegexes.layerFunction.test('layer'), false);
	});
});
