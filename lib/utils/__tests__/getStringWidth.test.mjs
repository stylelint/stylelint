import { describe, it } from 'node:test';

import getStringWidth, { segmentGraphemes } from '../getStringWidth.mjs';

describe('getStringWidth', () => {
	it('measures printable ASCII by length', (t) => {
		t.assert.strictEqual(getStringWidth(''), 0);
		t.assert.strictEqual(getStringWidth('abc'), 3);
		t.assert.strictEqual(getStringWidth('a b'), 3);
	});

	it('ignores ANSI escape codes', (t) => {
		t.assert.strictEqual(getStringWidth('\u001B[31mabc\u001B[39m'), 3);
		t.assert.strictEqual(getStringWidth('\u001B[2m\u001B[0m'), 0);
	});

	it('ignores control and zero-width characters', (t) => {
		t.assert.strictEqual(getStringWidth('a\u0009b'), 2);
		t.assert.strictEqual(getStringWidth('a\u200Bb'), 2);
		t.assert.strictEqual(getStringWidth('\uFE0F'), 0);
	});

	it('counts combining marks with their base character', (t) => {
		t.assert.strictEqual(getStringWidth('e\u0301'), 1);
		t.assert.strictEqual(getStringWidth('é'), 1);
	});

	it('counts East Asian wide and fullwidth characters as two columns', (t) => {
		t.assert.strictEqual(getStringWidth('简体中文'), 8);
		t.assert.strictEqual(getStringWidth('こんにちは'), 10);
		t.assert.strictEqual(getStringWidth('안녕하세요'), 10);
		t.assert.strictEqual(getStringWidth('ａｂｃ'), 6);
		t.assert.strictEqual(getStringWidth('简体 abc'), 8);
	});

	it('counts emoji as two columns', (t) => {
		t.assert.strictEqual(getStringWidth('👍'), 2);
		t.assert.strictEqual(getStringWidth('👍🏽'), 2);
		t.assert.strictEqual(getStringWidth('👨\u200D👩\u200D👧'), 2);
		t.assert.strictEqual(getStringWidth('🇯🇵'), 2);
		t.assert.strictEqual(getStringWidth('©\uFE0F'), 2);
		t.assert.strictEqual(getStringWidth('©'), 1);
		t.assert.strictEqual(getStringWidth('1\uFE0F\u20E3'), 2);
	});
});

describe('segmentGraphemes', () => {
	it('splits text into grapheme clusters', (t) => {
		t.assert.deepStrictEqual(segmentGraphemes('a简👍🏽'), ['a', '简', '👍🏽']);
		t.assert.deepStrictEqual(segmentGraphemes(''), []);
	});
});
