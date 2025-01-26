import { atRuleRegexes } from '../regexes.mjs';

describe('atRuleRegexes', () => {
	it('matches "media" case-insensitively', () => {
		expect(atRuleRegexes.mediaName.test('media')).toBe(true);
		expect(atRuleRegexes.mediaName.test('MEDIA')).toBe(true);
		expect(atRuleRegexes.mediaName.test('Media')).toBe(true);
		expect(atRuleRegexes.mediaName.test('med')).toBe(false);
		expect(atRuleRegexes.mediaName.test('media-query')).toBe(false);
	});

	it('matches "keyframes" with or without vendor prefixes', () => {
		expect(atRuleRegexes.keyframesName.test('keyframes')).toBe(true);
		expect(atRuleRegexes.keyframesName.test('Keyframes')).toBe(true);
		expect(atRuleRegexes.keyframesName.test('-webkit-keyframes')).toBe(true);
		expect(atRuleRegexes.keyframesName.test('-moz-keyframes')).toBe(true);
		expect(atRuleRegexes.keyframesName.test('-o-keyframes')).toBe(true);
		expect(atRuleRegexes.keyframesName.test('-ms-keyframes')).toBe(true);
		expect(atRuleRegexes.keyframesName.test('keyframe')).toBe(false);
		expect(atRuleRegexes.keyframesName.test('my-keyframes')).toBe(false);
	});

	it('matches "property" case-insensitively', () => {
		expect(atRuleRegexes.propertyName.test('property')).toBe(true);
		expect(atRuleRegexes.propertyName.test('Property')).toBe(true);
		expect(atRuleRegexes.propertyName.test('PROPERTY')).toBe(true);
		expect(atRuleRegexes.propertyName.test('prop')).toBe(false);
		expect(atRuleRegexes.propertyName.test('property-value')).toBe(false);
	});

	it('matches "import" case-insensitively', () => {
		expect(atRuleRegexes.importName.test('import')).toBe(true);
		expect(atRuleRegexes.importName.test('Import')).toBe(true);
		expect(atRuleRegexes.importName.test('IMPORT')).toBe(true);
		expect(atRuleRegexes.importName.test('imp')).toBe(false);
		expect(atRuleRegexes.importName.test('import-value')).toBe(false);
	});

	it('identifies unsupported nesting rules correctly', () => {
		expect(atRuleRegexes.unsupportedNestingNames.test('container')).toBe(false);
		expect(atRuleRegexes.unsupportedNestingNames.test('layer')).toBe(false);
		expect(atRuleRegexes.unsupportedNestingNames.test('media')).toBe(false);
		expect(atRuleRegexes.unsupportedNestingNames.test('scope')).toBe(false);
		expect(atRuleRegexes.unsupportedNestingNames.test('foo')).toBe(true);
		expect(atRuleRegexes.unsupportedNestingNames.test('bar')).toBe(true);
	});
});
