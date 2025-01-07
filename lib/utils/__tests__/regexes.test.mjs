import { atRuleRegexes } from '../regexes.mjs';

describe('atRuleRegexes', () => {
	it('matches "media" case-insensitively', () => {
		expect(atRuleRegexes.media.test('media')).toBe(true);
		expect(atRuleRegexes.media.test('MEDIA')).toBe(true);
		expect(atRuleRegexes.media.test('Media')).toBe(true);
		expect(atRuleRegexes.media.test('med')).toBe(false);
		expect(atRuleRegexes.media.test('media-query')).toBe(false);
	});

	it('matches "keyframes" with or without vendor prefixes', () => {
		expect(atRuleRegexes.keyframes.test('keyframes')).toBe(true);
		expect(atRuleRegexes.keyframes.test('Keyframes')).toBe(true);
		expect(atRuleRegexes.keyframes.test('-webkit-keyframes')).toBe(true);
		expect(atRuleRegexes.keyframes.test('-moz-keyframes')).toBe(true);
		expect(atRuleRegexes.keyframes.test('-o-keyframes')).toBe(true);
		expect(atRuleRegexes.keyframes.test('-ms-keyframes')).toBe(true);
		expect(atRuleRegexes.keyframes.test('keyframe')).toBe(false);
		expect(atRuleRegexes.keyframes.test('my-keyframes')).toBe(false);
	});

	it('matches "property" case-insensitively', () => {
		expect(atRuleRegexes.property.test('property')).toBe(true);
		expect(atRuleRegexes.property.test('Property')).toBe(true);
		expect(atRuleRegexes.property.test('PROPERTY')).toBe(true);
		expect(atRuleRegexes.property.test('prop')).toBe(false);
		expect(atRuleRegexes.property.test('property-value')).toBe(false);
	});

	it('identifies unsupported nesting rules correctly', () => {
		expect(atRuleRegexes.unsupportedNesting.test('container')).toBe(false);
		expect(atRuleRegexes.unsupportedNesting.test('layer')).toBe(false);
		expect(atRuleRegexes.unsupportedNesting.test('media')).toBe(false);
		expect(atRuleRegexes.unsupportedNesting.test('scope')).toBe(false);
		expect(atRuleRegexes.unsupportedNesting.test('foo')).toBe(true);
		expect(atRuleRegexes.unsupportedNesting.test('bar')).toBe(true);
	});
});
