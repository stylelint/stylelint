import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import wrapText from '../wrapText.mjs';

describe('wrapText', () => {
	it('returns text that fits as one line', () => {
		assert.deepEqual(wrapText('foo bar', 7), ['foo bar']);
		assert.deepEqual(wrapText('', 1), ['']);
	});

	it('breaks at spaces', () => {
		assert.deepEqual(wrapText('foo bar baz', 7), ['foo bar', 'baz']);
		assert.deepEqual(wrapText('foo bar baz', 6), ['foo', 'bar', 'baz']);
	});

	it('drops the spaces at a break', () => {
		assert.deepEqual(wrapText('foo  bar', 5), ['foo', 'bar']);
	});

	it('keeps the spaces within a line', () => {
		assert.deepEqual(wrapText('foo  bar baz', 8), ['foo  bar', 'baz']);
	});

	it('breaks a word wider than the width', () => {
		assert.deepEqual(wrapText('aaaaaaaaaa', 4), ['aaaa', 'aaaa', 'aa']);
		assert.deepEqual(wrapText('foo aaaaaaaaaa', 4), ['foo', 'aaaa', 'aaaa', 'aa']);
	});

	it('prefers to break a word after punctuation', () => {
		assert.deepEqual(wrapText('a/very/long/path', 7), ['a/very/', 'long/', 'path']);
		assert.deepEqual(wrapText('/long/path', 4), ['/lon', 'g/', 'path']);
		assert.deepEqual(wrapText('selector-max-specificity', 10), [
			'selector-',
			'max-',
			'specificit',
			'y',
		]);
	});

	it('breaks by terminal columns', () => {
		assert.deepEqual(wrapText('简体中文简体中文', 8), ['简体中文', '简体中文']);
		assert.deepEqual(wrapText('简体中文简体中文', 7), ['简体中', '文简体', '中文']);
		assert.deepEqual(wrapText('简体中文 简体中文', 8), ['简体中文', '简体中文']);
	});

	it('takes at least one grapheme cluster per line', () => {
		assert.deepEqual(wrapText('简体', 1), ['简', '体']);
	});
});
