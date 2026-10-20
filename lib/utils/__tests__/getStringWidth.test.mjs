import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import getStringWidth, { segmentGraphemes } from '../getStringWidth.mjs';

describe('getStringWidth', () => {
	it('measures printable ASCII by length', () => {
		assert.equal(getStringWidth(''), 0);
		assert.equal(getStringWidth('abc'), 3);
		assert.equal(getStringWidth('a b'), 3);
	});

	it('ignores ANSI escape codes', () => {
		assert.equal(getStringWidth('\u001B[31mabc\u001B[39m'), 3);
		assert.equal(getStringWidth('\u001B[2m\u001B[0m'), 0);
	});

	it('ignores control and zero-width characters', () => {
		assert.equal(getStringWidth('a\u0009b'), 2);
		assert.equal(getStringWidth('a\u200Bb'), 2);
		assert.equal(getStringWidth('\uFE0F'), 0);
	});

	it('counts combining marks with their base character', () => {
		assert.equal(getStringWidth('e\u0301'), 1);
		assert.equal(getStringWidth('é'), 1);
	});

	it('counts East Asian wide and fullwidth characters as two columns', () => {
		assert.equal(getStringWidth('简体中文'), 8);
		assert.equal(getStringWidth('こんにちは'), 10);
		assert.equal(getStringWidth('안녕하세요'), 10);
		assert.equal(getStringWidth('ａｂｃ'), 6);
		assert.equal(getStringWidth('简体 abc'), 8);
	});

	it('counts emoji as two columns', () => {
		assert.equal(getStringWidth('👍'), 2);
		assert.equal(getStringWidth('👍🏽'), 2);
		assert.equal(getStringWidth('👨\u200D👩\u200D👧'), 2);
		assert.equal(getStringWidth('🇯🇵'), 2);
		assert.equal(getStringWidth('©\uFE0F'), 2);
		assert.equal(getStringWidth('©'), 1);
		assert.equal(getStringWidth('1\uFE0F\u20E3'), 2);
	});
});

describe('segmentGraphemes', () => {
	it('splits text into grapheme clusters', () => {
		assert.deepEqual(segmentGraphemes('a简👍🏽'), ['a', '简', '👍🏽']);
		assert.deepEqual(segmentGraphemes(''), []);
	});
});
