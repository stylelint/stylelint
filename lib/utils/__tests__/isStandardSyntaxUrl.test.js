'use strict';

const isStandardSyntaxUrl = require('../isStandardSyntaxUrl');

describe('isStandardSyntaxUrl', () => {
	it('empty', () => {
		expect(isStandardSyntaxUrl('')).toBeTruthy();
	});
	it('path-relative url', () => {
		expect(isStandardSyntaxUrl('some/path/to/file.png')).toBeTruthy();
	});
	it('path-relative with single quotes', () => {
		expect(isStandardSyntaxUrl("'some/path/to/file.png'")).toBeTruthy();
	});
	it('path-relative with double quotes', () => {
		expect(isStandardSyntaxUrl('"some/path/to/file.png"')).toBeTruthy();
	});
	it('path-absolute url', () => {
		expect(isStandardSyntaxUrl('/some/path/to/file.png')).toBeTruthy();
	});
	it('protocol-relative-url', () => {
		expect(isStandardSyntaxUrl('//www.domain.com/file.jpg')).toBeTruthy();
	});
	it('url with single-dot path segment', () => {
		expect(isStandardSyntaxUrl('./some/path/to/file.png')).toBeTruthy();
	});
	it('url with double-dot path segment', () => {
		expect(isStandardSyntaxUrl('../some/path/to/file.png')).toBeTruthy();
	});
	it('url with port', () => {
		expect(isStandardSyntaxUrl('https://www.domain.com:8080/file.jpg')).toBeTruthy();
	});
	it('url with local scheme', () => {
		expect(
			isStandardSyntaxUrl(
				'data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7',
			),
		).toBeTruthy();
	});
	it('URL with protocol(http) and `$` character without quotes', () => {
		expect(isStandardSyntaxUrl('http://domain.com:8080/path/to$to/file$2x.ext?$1=$2')).toBeTruthy();
	});
	it('URL with protocol(http) and `$` character in single quotes', () => {
		expect(
			isStandardSyntaxUrl("'http://domain.com:8080/path$path/to$to/$file$2x.ext?$1$2=$1$2'"),
		).toBeTruthy();
	});
	it('URL with protocol(http) and `$` character in double quotes', () => {
		expect(
			isStandardSyntaxUrl('"http://domain.com:8080/path$path/to$to/$file$2x.ext?$1$2=$1$2"'),
		).toBeTruthy();
	});
	it('URL with protocol(http) and `@` character without quotes', () => {
		expect(isStandardSyntaxUrl('http://domain.com:8080/path/to@to/file@2x.ext?@1=@2')).toBeTruthy();
	});
	it('URL with protocol(http) and `@` character in single quotes', () => {
		expect(
			isStandardSyntaxUrl("'http://domain.com:8080/path$path/to@to/$file@2x.ext?@1$2=$1@2'"),
		).toBeTruthy();
	});
	it('URL with protocol(http) and `@` character in double quotes', () => {
		expect(
			isStandardSyntaxUrl('"http://domain.com:8080/path$path/to@to/$file@2x.ext?@1$2=$1@2"'),
		).toBeTruthy();
	});

	it('url with dollar at the start and double quotes', () => {
		expect(isStandardSyntaxUrl('"$url/path"')).toBeTruthy();
	});
	it('url with dollar in the middle and double quotes', () => {
		expect(isStandardSyntaxUrl('"some/$url/path"')).toBeTruthy();
	});
	it('url with dollar at the end and double quotes', () => {
		expect(isStandardSyntaxUrl('"some/$url"')).toBeTruthy();
	});

	it('url with ampersand at the start and double quotes', () => {
		expect(isStandardSyntaxUrl('"@url/path"')).toBeTruthy();
	});
	it('url with ampersand in the middle and double quotes', () => {
		expect(isStandardSyntaxUrl('"some/@url/path"')).toBeTruthy();
	});
	it('url with ampersand at the end and double quotes', () => {
		expect(isStandardSyntaxUrl('"some/@url"')).toBeTruthy();
	});
	it('url with ampersand at the start', () => {
		expect(isStandardSyntaxUrl('@url/path')).toBeTruthy();
	});
	it('url with ampersand in the middle', () => {
		expect(isStandardSyntaxUrl('some/@url/path')).toBeTruthy();
	});
	it('url with ampersand at the end', () => {
		expect(isStandardSyntaxUrl('some/@url')).toBeTruthy();
	});
	it('url with less interpolation without quotes', () => {
		expect(isStandardSyntaxUrl('@{less-variable}')).toBeFalsy();
	});
	it('url with less interpolation at the start without quotes', () => {
		expect(isStandardSyntaxUrl('@{less-variable}/path')).toBeFalsy();
	});
	it('url with less interpolation in the middle without quotes', () => {
		expect(isStandardSyntaxUrl('some/@{less-variable}/path')).toBeFalsy();
	});
	it('url with less interpolation at the end without quotes', () => {
		expect(isStandardSyntaxUrl('some/@{less-variable}')).toBeFalsy();
	});

	it('sass interpolation at the start', () => {
		expect(isStandardSyntaxUrl('#{$sass-variable}-color/images/bg.png')).toBeFalsy();
	});
	it('sass interpolation in the middle', () => {
		expect(isStandardSyntaxUrl('images/#{$sass-variable}-color/bg.png')).toBeFalsy();
	});
	it('sass interpolation at the end', () => {
		expect(isStandardSyntaxUrl('images/#{$sass-variable}.png')).toBeFalsy();
	});
	it('sass interpolation at the start with single quotes', () => {
		expect(isStandardSyntaxUrl("'#{$sass-variable}-color/images/bg.png'")).toBeFalsy();
	});
	it('sass interpolation in the middle with single quotes', () => {
		expect(isStandardSyntaxUrl("'images/#{$sass-variable}-color/bg.png'")).toBeFalsy();
	});
	it('sass interpolation at the end with single quotes', () => {
		expect(isStandardSyntaxUrl("'images/#{$sass-variable}'")).toBeFalsy();
	});
	it('sass interpolation at the start with double quotes', () => {
		expect(isStandardSyntaxUrl('"#{$sass-variable}-color/images/bg.png"')).toBeFalsy();
	});
	it('sass interpolation in the middle with double quotes', () => {
		expect(isStandardSyntaxUrl('"images/#{$sass-variable}-color/bg.png"')).toBeFalsy();
	});
	it('sass interpolation at the end with double quotes', () => {
		expect(isStandardSyntaxUrl('"images/#{$sass-variable}"')).toBeFalsy();
	});

	it('sass variable', () => {
		expect(isStandardSyntaxUrl('$sass-variable')).toBeFalsy();
	});
	it('sass variable concat with single quotes string', () => {
		expect(isStandardSyntaxUrl("$sass-variable + 'foo'")).toBeFalsy();
	});
	it('sass variable concat with escaped single quotes string', () => {
		expect(isStandardSyntaxUrl("$sass-variable + 'foo'")).toBeFalsy();
	});
	it('sass variable concat with double quotes string', () => {
		expect(isStandardSyntaxUrl("$sass-variable + 'foo'")).toBeFalsy();
	});
	it('sass variable concat with single quotes string without spaces', () => {
		expect(isStandardSyntaxUrl("$sass-variable+'foo'")).toBeFalsy();
	});
	it('sass variable and concatenation', () => {
		expect(isStandardSyntaxUrl('$sass-variable + foo')).toBeFalsy();
	});
	it('sass variable and double concatenation', () => {
		expect(isStandardSyntaxUrl('test + $sass-variable + foo')).toBeFalsy();
	});
	it('sass interpolation and concatenation', () => {
		expect(isStandardSyntaxUrl('#{$sass-variable + foo}')).toBeFalsy();
	});
	it('sass interpolation and concatenation with double quotes', () => {
		expect(isStandardSyntaxUrl('"#{$sass-variable + foo}"')).toBeFalsy();
	});

	it('less variable', () => {
		expect(isStandardSyntaxUrl('@less-variable')).toBeFalsy();
	});
	it('less interpolation', () => {
		expect(isStandardSyntaxUrl('"@{less-variable}"')).toBeFalsy();
	});
	it('less interpolation with escaped', () => {
		expect(isStandardSyntaxUrl('"~@{less-variable}"')).toBeFalsy();
	});

	it('less interpolation at the start with single quotes', () => {
		expect(isStandardSyntaxUrl("'@{less-variable}-color/images/bg.png'")).toBeFalsy();
	});
	it('less interpolation in the middle with single quotes', () => {
		expect(isStandardSyntaxUrl("'images/@{less-variable}-color/bg.png'")).toBeFalsy();
	});
	it('less interpolation at the end with single quotes', () => {
		expect(isStandardSyntaxUrl("'images/@{less-variable}'")).toBeFalsy();
	});

	it('less interpolation at the start with double quotes', () => {
		expect(isStandardSyntaxUrl('"@{less-variable}-color/images/bg.png"')).toBeFalsy();
	});
	it('less interpolation in the middle with double quotes', () => {
		expect(isStandardSyntaxUrl('"images/@{less-variable}-color/bg.png"')).toBeFalsy();
	});
	it('less interpolation at the end with double quotes', () => {
		expect(isStandardSyntaxUrl('"images/@{less-variable}"')).toBeFalsy();
	});
});
