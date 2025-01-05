import { atRulesRegexes } from '../regexes.mjs';

describe('atRulesRegexes', () => {
	it('matches "media" case-insensitively', () => {
		expect(atRulesRegexes.media.test('media')).toBe(true);
		expect(atRulesRegexes.media.test('MEDIA')).toBe(true);
		expect(atRulesRegexes.media.test('Media')).toBe(true);
		expect(atRulesRegexes.media.test('med')).toBe(false);
		expect(atRulesRegexes.media.test('media-query')).toBe(false);
	});

	it('matches "keyframes" with or without vendor prefixes', () => {
		expect(atRulesRegexes.keyframes.test('keyframes')).toBe(true);
		expect(atRulesRegexes.keyframes.test('Keyframes')).toBe(true);
		expect(atRulesRegexes.keyframes.test('-webkit-keyframes')).toBe(true);
		expect(atRulesRegexes.keyframes.test('-moz-keyframes')).toBe(true);
		expect(atRulesRegexes.keyframes.test('-o-keyframes')).toBe(true);
		expect(atRulesRegexes.keyframes.test('-ms-keyframes')).toBe(true);
		expect(atRulesRegexes.keyframes.test('keyframe')).toBe(false);
		expect(atRulesRegexes.keyframes.test('my-keyframes')).toBe(false);
	});

	it('matches "property" case-insensitively', () => {
		expect(atRulesRegexes.property.test('property')).toBe(true);
		expect(atRulesRegexes.property.test('Property')).toBe(true);
		expect(atRulesRegexes.property.test('PROPERTY')).toBe(true);
		expect(atRulesRegexes.property.test('prop')).toBe(false);
		expect(atRulesRegexes.property.test('property-value')).toBe(false);
	});

	it('identifies unsupported nesting rules correctly', () => {
		expect(atRulesRegexes.unsupportedNesting.test('container')).toBe(false);
		expect(atRulesRegexes.unsupportedNesting.test('layer')).toBe(false);
		expect(atRulesRegexes.unsupportedNesting.test('media')).toBe(false);
		expect(atRulesRegexes.unsupportedNesting.test('scope')).toBe(false);
		expect(atRulesRegexes.unsupportedNesting.test('foo')).toBe(true);
		expect(atRulesRegexes.unsupportedNesting.test('bar')).toBe(true);
	});
});
