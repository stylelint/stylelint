import { describe, it } from 'node:test';

import wrapText from '../wrapText.mjs';

describe('wrapText', () => {
	it('returns text that fits as one line', (t) => {
		t.assert.deepStrictEqual(wrapText('foo bar', 7), ['foo bar']);
		t.assert.deepStrictEqual(wrapText('', 1), ['']);
	});

	it('breaks at spaces', (t) => {
		t.assert.deepStrictEqual(wrapText('foo bar baz', 7), ['foo bar', 'baz']);
		t.assert.deepStrictEqual(wrapText('foo bar baz', 6), ['foo', 'bar', 'baz']);
	});

	it('drops the spaces at a break', (t) => {
		t.assert.deepStrictEqual(wrapText('foo  bar', 5), ['foo', 'bar']);
	});

	it('keeps the spaces within a line', (t) => {
		t.assert.deepStrictEqual(wrapText('foo  bar baz', 8), ['foo  bar', 'baz']);
	});

	it('breaks a word wider than the width', (t) => {
		t.assert.deepStrictEqual(wrapText('aaaaaaaaaa', 4), ['aaaa', 'aaaa', 'aa']);
		t.assert.deepStrictEqual(wrapText('foo aaaaaaaaaa', 4), ['foo', 'aaaa', 'aaaa', 'aa']);
	});

	it('prefers to break a word after punctuation', (t) => {
		t.assert.deepStrictEqual(wrapText('a/very/long/path', 7), ['a/very/', 'long/', 'path']);
		t.assert.deepStrictEqual(wrapText('/long/path', 4), ['/lon', 'g/', 'path']);
		t.assert.deepStrictEqual(wrapText('selector-max-specificity', 10), [
			'selector-',
			'max-',
			'specificit',
			'y',
		]);
	});

	it('breaks by terminal columns', (t) => {
		t.assert.deepStrictEqual(wrapText('简体中文简体中文', 8), ['简体中文', '简体中文']);
		t.assert.deepStrictEqual(wrapText('简体中文简体中文', 7), ['简体中', '文简体', '中文']);
		t.assert.deepStrictEqual(wrapText('简体中文 简体中文', 8), ['简体中文', '简体中文']);
	});

	it('takes at least one grapheme cluster per line', (t) => {
		t.assert.deepStrictEqual(wrapText('简体', 1), ['简', '体']);
	});
});
