import getStringWidth, { segmentGraphemes } from '../getStringWidth.mjs';

describe('getStringWidth', () => {
	it('measures printable ASCII by length', () => {
		expect(getStringWidth('')).toBe(0);
		expect(getStringWidth('abc')).toBe(3);
		expect(getStringWidth('a b')).toBe(3);
	});

	it('ignores ANSI escape codes', () => {
		expect(getStringWidth('\u001B[31mabc\u001B[39m')).toBe(3);
		expect(getStringWidth('\u001B[2m\u001B[0m')).toBe(0);
	});

	it('ignores control and zero-width characters', () => {
		expect(getStringWidth('a\u0009b')).toBe(2);
		expect(getStringWidth('a\u200Bb')).toBe(2);
		expect(getStringWidth('\uFE0F')).toBe(0);
	});

	it('counts combining marks with their base character', () => {
		expect(getStringWidth('e\u0301')).toBe(1);
		expect(getStringWidth('é')).toBe(1);
	});

	it('counts East Asian wide and fullwidth characters as two columns', () => {
		expect(getStringWidth('简体中文')).toBe(8);
		expect(getStringWidth('こんにちは')).toBe(10);
		expect(getStringWidth('안녕하세요')).toBe(10);
		expect(getStringWidth('ａｂｃ')).toBe(6);
		expect(getStringWidth('简体 abc')).toBe(8);
	});

	it('counts emoji as two columns', () => {
		expect(getStringWidth('👍')).toBe(2);
		expect(getStringWidth('👍🏽')).toBe(2);
		expect(getStringWidth('👨\u200D👩\u200D👧')).toBe(2);
		expect(getStringWidth('🇯🇵')).toBe(2);
		expect(getStringWidth('©\uFE0F')).toBe(2);
		expect(getStringWidth('©')).toBe(1);
		expect(getStringWidth('1\uFE0F\u20E3')).toBe(2);
	});
});

describe('segmentGraphemes', () => {
	it('splits text into grapheme clusters', () => {
		expect(segmentGraphemes('a简👍🏽')).toEqual(['a', '简', '👍🏽']);
		expect(segmentGraphemes('')).toEqual([]);
	});
});
