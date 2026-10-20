import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { atRuleRegexes, descriptorRegexes, mayIncludeRegexes } from '../regexes.mjs';

describe('atRuleRegexes', () => {
	it('matches "media" case-insensitively', () => {
		assert.equal(atRuleRegexes.mediaName.test('media'), true);
		assert.equal(atRuleRegexes.mediaName.test('MEDIA'), true);
		assert.equal(atRuleRegexes.mediaName.test('Media'), true);
		assert.equal(atRuleRegexes.mediaName.test('med'), false);
		assert.equal(atRuleRegexes.mediaName.test('media-query'), false);
	});

	it('matches "keyframes" with or without vendor prefixes', () => {
		assert.equal(atRuleRegexes.keyframesName.test('keyframes'), true);
		assert.equal(atRuleRegexes.keyframesName.test('Keyframes'), true);
		assert.equal(atRuleRegexes.keyframesName.test('-webkit-keyframes'), true);
		assert.equal(atRuleRegexes.keyframesName.test('-moz-keyframes'), true);
		assert.equal(atRuleRegexes.keyframesName.test('-o-keyframes'), true);
		assert.equal(atRuleRegexes.keyframesName.test('-ms-keyframes'), true);
		assert.equal(atRuleRegexes.keyframesName.test('keyframe'), false);
		assert.equal(atRuleRegexes.keyframesName.test('my-keyframes'), false);
	});

	it('matches "property" case-insensitively', () => {
		assert.equal(atRuleRegexes.propertyName.test('property'), true);
		assert.equal(atRuleRegexes.propertyName.test('Property'), true);
		assert.equal(atRuleRegexes.propertyName.test('PROPERTY'), true);
		assert.equal(atRuleRegexes.propertyName.test('prop'), false);
		assert.equal(atRuleRegexes.propertyName.test('property-value'), false);
	});

	it('matches "import" case-insensitively', () => {
		assert.equal(atRuleRegexes.importName.test('import'), true);
		assert.equal(atRuleRegexes.importName.test('Import'), true);
		assert.equal(atRuleRegexes.importName.test('IMPORT'), true);
		assert.equal(atRuleRegexes.importName.test('imp'), false);
		assert.equal(atRuleRegexes.importName.test('import-value'), false);
	});

	it('identifies unsupported nesting rules correctly', () => {
		assert.equal(atRuleRegexes.unsupportedNestingNames.test('container'), false);
		assert.equal(atRuleRegexes.unsupportedNestingNames.test('layer'), false);
		assert.equal(atRuleRegexes.unsupportedNestingNames.test('media'), false);
		assert.equal(atRuleRegexes.unsupportedNestingNames.test('scope'), false);
		assert.equal(atRuleRegexes.unsupportedNestingNames.test('foo'), true);
		assert.equal(atRuleRegexes.unsupportedNestingNames.test('bar'), true);
	});

	it('matches "layer" case-insensitively', () => {
		assert.equal(atRuleRegexes.layerName.test('layer'), true);
		assert.equal(atRuleRegexes.layerName.test('Layer'), true);
		assert.equal(atRuleRegexes.layerName.test('LAYER'), true);
		assert.equal(atRuleRegexes.layerName.test('lay'), false);
		assert.equal(atRuleRegexes.layerName.test('layer-name'), false);
	});
});

describe('descriptorRegexes', () => {
	it('matches "syntax" case-insensitively', () => {
		assert.equal(descriptorRegexes.syntaxName.test('syntax'), true);
		assert.equal(descriptorRegexes.syntaxName.test('Syntax'), true);
		assert.equal(descriptorRegexes.syntaxName.test('SYNTAX'), true);
		assert.equal(descriptorRegexes.syntaxName.test('syn'), false);
		assert.equal(descriptorRegexes.syntaxName.test('syntax-value'), false);
	});
});

describe('mayIncludeRegexes', () => {
	it('layerFunction matches "layer" case-insensitively', () => {
		assert.equal(mayIncludeRegexes.layerFunction.test('layer(foo)'), true);
		assert.equal(mayIncludeRegexes.layerFunction.test('Layer(foo)'), true);
		assert.equal(mayIncludeRegexes.layerFunction.test('LAYER(foo)'), true);
		assert.equal(mayIncludeRegexes.layerFunction.test('layer(foo, bar)'), true);
		assert.equal(mayIncludeRegexes.layerFunction.test('layer(foo'), true);
		assert.equal(mayIncludeRegexes.layerFunction.test('layer'), false);
	});
});
