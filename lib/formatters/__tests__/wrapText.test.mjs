import wrapText from '../wrapText.mjs';

describe('wrapText', () => {
	it('returns text that fits as one line', () => {
		expect(wrapText('foo bar', 7)).toEqual(['foo bar']);
		expect(wrapText('', 1)).toEqual(['']);
	});

	it('breaks at spaces', () => {
		expect(wrapText('foo bar baz', 7)).toEqual(['foo bar', 'baz']);
		expect(wrapText('foo bar baz', 6)).toEqual(['foo', 'bar', 'baz']);
	});

	it('drops the spaces at a break', () => {
		expect(wrapText('foo  bar', 5)).toEqual(['foo', 'bar']);
	});

	it('keeps the spaces within a line', () => {
		expect(wrapText('foo  bar baz', 8)).toEqual(['foo  bar', 'baz']);
	});

	it('breaks a word wider than the width', () => {
		expect(wrapText('aaaaaaaaaa', 4)).toEqual(['aaaa', 'aaaa', 'aa']);
		expect(wrapText('foo aaaaaaaaaa', 4)).toEqual(['foo', 'aaaa', 'aaaa', 'aa']);
	});

	it('prefers to break a word after punctuation', () => {
		expect(wrapText('a/very/long/path', 7)).toEqual(['a/very/', 'long/', 'path']);
		expect(wrapText('/long/path', 4)).toEqual(['/lon', 'g/', 'path']);
		expect(wrapText('selector-max-specificity', 10)).toEqual([
			'selector-',
			'max-',
			'specificit',
			'y',
		]);
	});

	it('breaks by terminal columns', () => {
		expect(wrapText('简体中文简体中文', 8)).toEqual(['简体中文', '简体中文']);
		expect(wrapText('简体中文简体中文', 7)).toEqual(['简体中', '文简体', '中文']);
		expect(wrapText('简体中文 简体中文', 8)).toEqual(['简体中文', '简体中文']);
	});

	it('takes at least one grapheme cluster per line', () => {
		expect(wrapText('简体', 1)).toEqual(['简', '体']);
	});
});
