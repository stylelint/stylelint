import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isStandardSyntaxUrl from '../isStandardSyntaxUrl.mjs';

describe('isStandardSyntaxUrl', () => {
	it('empty', () => {
		assert.ok(isStandardSyntaxUrl(''));
	});
	it('path-relative url', () => {
		assert.ok(isStandardSyntaxUrl('some/path/to/file.png'));
	});
	it('path-relative with single quotes', () => {
		assert.ok(isStandardSyntaxUrl("'some/path/to/file.png'"));
	});
	it('path-relative with double quotes', () => {
		assert.ok(isStandardSyntaxUrl('"some/path/to/file.png"'));
	});
	it('path-absolute url', () => {
		assert.ok(isStandardSyntaxUrl('/some/path/to/file.png'));
	});
	it('protocol-relative-url', () => {
		assert.ok(isStandardSyntaxUrl('//www.domain.com/file.jpg'));
	});
	it('url with single-dot path segment', () => {
		assert.ok(isStandardSyntaxUrl('./some/path/to/file.png'));
	});
	it('url with double-dot path segment', () => {
		assert.ok(isStandardSyntaxUrl('../some/path/to/file.png'));
	});
	it('url with port', () => {
		assert.ok(isStandardSyntaxUrl('https://www.domain.com:8080/file.jpg'));
	});
	it('url with local scheme', () => {
		assert.ok(
			isStandardSyntaxUrl(
				'data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7',
			),
		);
	});
	it('URL with protocol(http) and `$` character without quotes', () => {
		assert.ok(isStandardSyntaxUrl('http://domain.com:8080/path/to$to/file$2x.ext?$1=$2'));
	});
	it('URL with protocol(http) and `$` character in single quotes', () => {
		assert.ok(
			isStandardSyntaxUrl("'http://domain.com:8080/path$path/to$to/$file$2x.ext?$1$2=$1$2'"),
		);
	});
	it('URL with protocol(http) and `$` character in double quotes', () => {
		assert.ok(
			isStandardSyntaxUrl('"http://domain.com:8080/path$path/to$to/$file$2x.ext?$1$2=$1$2"'),
		);
	});
	it('URL with protocol(http) and `@` character without quotes', () => {
		assert.ok(isStandardSyntaxUrl('http://domain.com:8080/path/to@to/file@2x.ext?@1=@2'));
	});
	it('URL with protocol(http) and `@` character in single quotes', () => {
		assert.ok(
			isStandardSyntaxUrl("'http://domain.com:8080/path$path/to@to/$file@2x.ext?@1$2=$1@2'"),
		);
	});
	it('URL with protocol(http) and `@` character in double quotes', () => {
		assert.ok(
			isStandardSyntaxUrl('"http://domain.com:8080/path$path/to@to/$file@2x.ext?@1$2=$1@2"'),
		);
	});

	it('url with dollar at the start and double quotes', () => {
		assert.ok(isStandardSyntaxUrl('"$url/path"'));
	});
	it('url with dollar in the middle and double quotes', () => {
		assert.ok(isStandardSyntaxUrl('"some/$url/path"'));
	});
	it('url with dollar at the end and double quotes', () => {
		assert.ok(isStandardSyntaxUrl('"some/$url"'));
	});

	it('url with ampersand at the start and double quotes', () => {
		assert.ok(isStandardSyntaxUrl('"@url/path"'));
	});
	it('url with ampersand in the middle and double quotes', () => {
		assert.ok(isStandardSyntaxUrl('"some/@url/path"'));
	});
	it('url with ampersand at the end and double quotes', () => {
		assert.ok(isStandardSyntaxUrl('"some/@url"'));
	});
	it('url with at sign at the start', () => {
		assert.ok(isStandardSyntaxUrl('@url/path'));
	});
	it('url with at sign in the middle', () => {
		assert.ok(isStandardSyntaxUrl('some/@url/path'));
	});
	it('url with at sign at the end', () => {
		assert.ok(isStandardSyntaxUrl('some/@url'));
	});
	it('url with less interpolation without quotes', () => {
		assert.ok(!isStandardSyntaxUrl('@{less-variable}'));
	});
	it('url with less interpolation at the start without quotes', () => {
		assert.ok(!isStandardSyntaxUrl('@{less-variable}/path'));
	});
	it('url with less interpolation in the middle without quotes', () => {
		assert.ok(!isStandardSyntaxUrl('some/@{less-variable}/path'));
	});
	it('url with less interpolation at the end without quotes', () => {
		assert.ok(!isStandardSyntaxUrl('some/@{less-variable}'));
	});

	it('sass interpolation at the start', () => {
		assert.ok(!isStandardSyntaxUrl('#{$sass-variable}-color/images/bg.png'));
	});
	it('sass interpolation in the middle', () => {
		assert.ok(!isStandardSyntaxUrl('images/#{$sass-variable}-color/bg.png'));
	});
	it('sass interpolation at the end', () => {
		assert.ok(!isStandardSyntaxUrl('images/#{$sass-variable}.png'));
	});
	it('sass interpolation at the start with single quotes', () => {
		assert.ok(!isStandardSyntaxUrl("'#{$sass-variable}-color/images/bg.png'"));
	});
	it('sass interpolation in the middle with single quotes', () => {
		assert.ok(!isStandardSyntaxUrl("'images/#{$sass-variable}-color/bg.png'"));
	});
	it('sass interpolation at the end with single quotes', () => {
		assert.ok(!isStandardSyntaxUrl("'images/#{$sass-variable}'"));
	});
	it('sass interpolation at the start with double quotes', () => {
		assert.ok(!isStandardSyntaxUrl('"#{$sass-variable}-color/images/bg.png"'));
	});
	it('sass interpolation in the middle with double quotes', () => {
		assert.ok(!isStandardSyntaxUrl('"images/#{$sass-variable}-color/bg.png"'));
	});
	it('sass interpolation at the end with double quotes', () => {
		assert.ok(!isStandardSyntaxUrl('"images/#{$sass-variable}"'));
	});

	it('sass variable', () => {
		assert.ok(!isStandardSyntaxUrl('$sass-variable'));
	});
	it('sass variable concat with single quotes string', () => {
		assert.ok(!isStandardSyntaxUrl("$sass-variable + 'foo'"));
	});
	it('sass variable concat with double quotes string', () => {
		assert.ok(!isStandardSyntaxUrl('$sass-variable + "foo"'));
	});
	it('sass variable concat with single quotes string without spaces', () => {
		assert.ok(!isStandardSyntaxUrl("$sass-variable+'foo'"));
	});
	it('sass variable and concatenation', () => {
		assert.ok(!isStandardSyntaxUrl('$sass-variable + foo'));
	});
	it('sass variable, concatenation, and a quoted at sign', () => {
		assert.ok(!isStandardSyntaxUrl("$sass-variable + 'foo@bar'"));
	});
	it('sass variable, concatenation, and a quoted hash sign', () => {
		assert.ok(!isStandardSyntaxUrl("$sass-variable + 'foo#bar'"));
	});
	it('sass variable, concatenation, and a quoted question mark', () => {
		assert.ok(!isStandardSyntaxUrl("$sass-variable + 'foo?bar'"));
	});
	it('sass variable, concatenation, and a quoted question mark and hash sign', () => {
		assert.ok(!isStandardSyntaxUrl("$sass-variable + 'foo?bar#qux'"));
	});
	it('sass variable and double concatenation', () => {
		assert.ok(!isStandardSyntaxUrl('test + $sass-variable + foo'));
	});
	it('sass interpolation and concatenation', () => {
		assert.ok(!isStandardSyntaxUrl('#{$sass-variable + foo}'));
	});
	it('sass interpolation and concatenation with double quotes', () => {
		assert.ok(!isStandardSyntaxUrl('"#{$sass-variable + foo}"'));
	});

	it('less variable', () => {
		assert.ok(!isStandardSyntaxUrl('@less-variable'));
	});
	it('less interpolation', () => {
		assert.ok(!isStandardSyntaxUrl('"@{less-variable}"'));
	});
	it('less interpolation with escaped', () => {
		assert.ok(!isStandardSyntaxUrl('"~@{less-variable}"'));
	});

	it('less interpolation at the start with single quotes', () => {
		assert.ok(!isStandardSyntaxUrl("'@{less-variable}-color/images/bg.png'"));
	});
	it('less interpolation in the middle with single quotes', () => {
		assert.ok(!isStandardSyntaxUrl("'images/@{less-variable}-color/bg.png'"));
	});
	it('less interpolation at the end with single quotes', () => {
		assert.ok(!isStandardSyntaxUrl("'images/@{less-variable}'"));
	});

	it('less interpolation at the start with double quotes', () => {
		assert.ok(!isStandardSyntaxUrl('"@{less-variable}-color/images/bg.png"'));
	});
	it('less interpolation in the middle with double quotes', () => {
		assert.ok(!isStandardSyntaxUrl('"images/@{less-variable}-color/bg.png"'));
	});
	it('less interpolation at the end with double quotes', () => {
		assert.ok(!isStandardSyntaxUrl('"images/@{less-variable}"'));
	});
});
