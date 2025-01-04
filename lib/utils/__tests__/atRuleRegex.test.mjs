import {
	KEYFRAMES_REGEX,
	MEDIA_REGEX,
	PROPERTY_REGEX,
	UNSUPPORTED_NESTING_REGEX,
} from '../atRuleRegex.mjs';

describe('Regular Expressions', () => {
	it('MEDIA_REGEX should match "media" case-insensitively', () => {
		expect(MEDIA_REGEX.test('media')).toBe(true);
		expect(MEDIA_REGEX.test('MEDIA')).toBe(true);
		expect(MEDIA_REGEX.test('Media')).toBe(true);
		expect(MEDIA_REGEX.test('med')).toBe(false);
		expect(MEDIA_REGEX.test('media-query')).toBe(false);
	});

	it('KEYFRAMES_REGEX should match keyframes with or without vendor prefixes', () => {
		expect(KEYFRAMES_REGEX.test('keyframes')).toBe(true);
		expect(KEYFRAMES_REGEX.test('Keyframes')).toBe(true);
		expect(KEYFRAMES_REGEX.test('-webkit-keyframes')).toBe(true);
		expect(KEYFRAMES_REGEX.test('-moz-keyframes')).toBe(true);
		expect(KEYFRAMES_REGEX.test('-o-keyframes')).toBe(true);
		expect(KEYFRAMES_REGEX.test('-ms-keyframes')).toBe(true);
		expect(KEYFRAMES_REGEX.test('keyframe')).toBe(false);
		expect(KEYFRAMES_REGEX.test('my-keyframes')).toBe(false);
	});

	it('PROPERTY_REGEX should match "property" case-insensitively', () => {
		expect(PROPERTY_REGEX.test('property')).toBe(true);
		expect(PROPERTY_REGEX.test('Property')).toBe(true);
		expect(PROPERTY_REGEX.test('PROPERTY')).toBe(true);
		expect(PROPERTY_REGEX.test('prop')).toBe(false);
		expect(PROPERTY_REGEX.test('property-value')).toBe(false);
	});

	it('UNSUPPORTED_NESTING_REGEX should correctly identify unsupported nesting', () => {
		expect(UNSUPPORTED_NESTING_REGEX.test('container')).toBe(false);
		expect(UNSUPPORTED_NESTING_REGEX.test('layer')).toBe(false);
		expect(UNSUPPORTED_NESTING_REGEX.test('media')).toBe(false);
		expect(UNSUPPORTED_NESTING_REGEX.test('scope')).toBe(false);
		expect(UNSUPPORTED_NESTING_REGEX.test('foo')).toBe(true);
		expect(UNSUPPORTED_NESTING_REGEX.test('bar')).toBe(true);
	});
});
