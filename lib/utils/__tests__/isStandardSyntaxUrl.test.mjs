import { describe, it } from 'node:test';

import isStandardSyntaxUrl from '../isStandardSyntaxUrl.mjs';

describe('isStandardSyntaxUrl', () => {
	it('empty', (t) => {
		t.assert.ok(isStandardSyntaxUrl(''));
	});
	it('path-relative url', (t) => {
		t.assert.ok(isStandardSyntaxUrl('some/path/to/file.png'));
	});
	it('path-relative with single quotes', (t) => {
		t.assert.ok(isStandardSyntaxUrl("'some/path/to/file.png'"));
	});
	it('path-relative with double quotes', (t) => {
		t.assert.ok(isStandardSyntaxUrl('"some/path/to/file.png"'));
	});
	it('path-absolute url', (t) => {
		t.assert.ok(isStandardSyntaxUrl('/some/path/to/file.png'));
	});
	it('protocol-relative-url', (t) => {
		t.assert.ok(isStandardSyntaxUrl('//www.domain.com/file.jpg'));
	});
	it('url with single-dot path segment', (t) => {
		t.assert.ok(isStandardSyntaxUrl('./some/path/to/file.png'));
	});
	it('url with double-dot path segment', (t) => {
		t.assert.ok(isStandardSyntaxUrl('../some/path/to/file.png'));
	});
	it('url with port', (t) => {
		t.assert.ok(isStandardSyntaxUrl('https://www.domain.com:8080/file.jpg'));
	});
	it('url with local scheme', (t) => {
		t.assert.ok(
			isStandardSyntaxUrl(
				'data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7',
			),
		);
	});
	it('URL with protocol(http) and `$` character without quotes', (t) => {
		t.assert.ok(isStandardSyntaxUrl('http://domain.com:8080/path/to$to/file$2x.ext?$1=$2'));
	});
	it('URL with protocol(http) and `$` character in single quotes', (t) => {
		t.assert.ok(
			isStandardSyntaxUrl("'http://domain.com:8080/path$path/to$to/$file$2x.ext?$1$2=$1$2'"),
		);
	});
	it('URL with protocol(http) and `$` character in double quotes', (t) => {
		t.assert.ok(
			isStandardSyntaxUrl('"http://domain.com:8080/path$path/to$to/$file$2x.ext?$1$2=$1$2"'),
		);
	});
	it('URL with protocol(http) and `@` character without quotes', (t) => {
		t.assert.ok(isStandardSyntaxUrl('http://domain.com:8080/path/to@to/file@2x.ext?@1=@2'));
	});
	it('URL with protocol(http) and `@` character in single quotes', (t) => {
		t.assert.ok(
			isStandardSyntaxUrl("'http://domain.com:8080/path$path/to@to/$file@2x.ext?@1$2=$1@2'"),
		);
	});
	it('URL with protocol(http) and `@` character in double quotes', (t) => {
		t.assert.ok(
			isStandardSyntaxUrl('"http://domain.com:8080/path$path/to@to/$file@2x.ext?@1$2=$1@2"'),
		);
	});

	it('url with dollar at the start and double quotes', (t) => {
		t.assert.ok(isStandardSyntaxUrl('"$url/path"'));
	});
	it('url with dollar in the middle and double quotes', (t) => {
		t.assert.ok(isStandardSyntaxUrl('"some/$url/path"'));
	});
	it('url with dollar at the end and double quotes', (t) => {
		t.assert.ok(isStandardSyntaxUrl('"some/$url"'));
	});

	it('url with ampersand at the start and double quotes', (t) => {
		t.assert.ok(isStandardSyntaxUrl('"@url/path"'));
	});
	it('url with ampersand in the middle and double quotes', (t) => {
		t.assert.ok(isStandardSyntaxUrl('"some/@url/path"'));
	});
	it('url with ampersand at the end and double quotes', (t) => {
		t.assert.ok(isStandardSyntaxUrl('"some/@url"'));
	});
	it('url with at sign at the start', (t) => {
		t.assert.ok(isStandardSyntaxUrl('@url/path'));
	});
	it('url with at sign in the middle', (t) => {
		t.assert.ok(isStandardSyntaxUrl('some/@url/path'));
	});
	it('url with at sign at the end', (t) => {
		t.assert.ok(isStandardSyntaxUrl('some/@url'));
	});
	it('url with less interpolation without quotes', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('@{less-variable}'));
	});
	it('url with less interpolation at the start without quotes', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('@{less-variable}/path'));
	});
	it('url with less interpolation in the middle without quotes', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('some/@{less-variable}/path'));
	});
	it('url with less interpolation at the end without quotes', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('some/@{less-variable}'));
	});

	it('sass interpolation at the start', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('#{$sass-variable}-color/images/bg.png'));
	});
	it('sass interpolation in the middle', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('images/#{$sass-variable}-color/bg.png'));
	});
	it('sass interpolation at the end', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('images/#{$sass-variable}.png'));
	});
	it('sass interpolation at the start with single quotes', (t) => {
		t.assert.ok(!isStandardSyntaxUrl("'#{$sass-variable}-color/images/bg.png'"));
	});
	it('sass interpolation in the middle with single quotes', (t) => {
		t.assert.ok(!isStandardSyntaxUrl("'images/#{$sass-variable}-color/bg.png'"));
	});
	it('sass interpolation at the end with single quotes', (t) => {
		t.assert.ok(!isStandardSyntaxUrl("'images/#{$sass-variable}'"));
	});
	it('sass interpolation at the start with double quotes', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('"#{$sass-variable}-color/images/bg.png"'));
	});
	it('sass interpolation in the middle with double quotes', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('"images/#{$sass-variable}-color/bg.png"'));
	});
	it('sass interpolation at the end with double quotes', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('"images/#{$sass-variable}"'));
	});

	it('sass variable', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('$sass-variable'));
	});
	it('sass variable concat with single quotes string', (t) => {
		t.assert.ok(!isStandardSyntaxUrl("$sass-variable + 'foo'"));
	});
	it('sass variable concat with double quotes string', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('$sass-variable + "foo"'));
	});
	it('sass variable concat with single quotes string without spaces', (t) => {
		t.assert.ok(!isStandardSyntaxUrl("$sass-variable+'foo'"));
	});
	it('sass variable and concatenation', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('$sass-variable + foo'));
	});
	it('sass variable, concatenation, and a quoted at sign', (t) => {
		t.assert.ok(!isStandardSyntaxUrl("$sass-variable + 'foo@bar'"));
	});
	it('sass variable, concatenation, and a quoted hash sign', (t) => {
		t.assert.ok(!isStandardSyntaxUrl("$sass-variable + 'foo#bar'"));
	});
	it('sass variable, concatenation, and a quoted question mark', (t) => {
		t.assert.ok(!isStandardSyntaxUrl("$sass-variable + 'foo?bar'"));
	});
	it('sass variable, concatenation, and a quoted question mark and hash sign', (t) => {
		t.assert.ok(!isStandardSyntaxUrl("$sass-variable + 'foo?bar#qux'"));
	});
	it('sass variable and double concatenation', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('test + $sass-variable + foo'));
	});
	it('sass interpolation and concatenation', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('#{$sass-variable + foo}'));
	});
	it('sass interpolation and concatenation with double quotes', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('"#{$sass-variable + foo}"'));
	});

	it('less variable', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('@less-variable'));
	});
	it('less interpolation', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('"@{less-variable}"'));
	});
	it('less interpolation with escaped', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('"~@{less-variable}"'));
	});

	it('less interpolation at the start with single quotes', (t) => {
		t.assert.ok(!isStandardSyntaxUrl("'@{less-variable}-color/images/bg.png'"));
	});
	it('less interpolation in the middle with single quotes', (t) => {
		t.assert.ok(!isStandardSyntaxUrl("'images/@{less-variable}-color/bg.png'"));
	});
	it('less interpolation at the end with single quotes', (t) => {
		t.assert.ok(!isStandardSyntaxUrl("'images/@{less-variable}'"));
	});

	it('less interpolation at the start with double quotes', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('"@{less-variable}-color/images/bg.png"'));
	});
	it('less interpolation in the middle with double quotes', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('"images/@{less-variable}-color/bg.png"'));
	});
	it('less interpolation at the end with double quotes', (t) => {
		t.assert.ok(!isStandardSyntaxUrl('"images/@{less-variable}"'));
	});
});
