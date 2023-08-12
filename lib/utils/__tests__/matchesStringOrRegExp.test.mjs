import matchesStringOrRegExp from '../matchesStringOrRegExp.mjs';

it('matchesStringOrRegExp comparing with string comparisonValues', () => {
	expect(matchesStringOrRegExp('bar', 'bar')).toEqual({
		match: 'bar',
		pattern: 'bar',
		substring: 'bar',
	});
	expect(matchesStringOrRegExp('bar', '/bar something')).toBeFalsy();
	expect(matchesStringOrRegExp('/bar something', '/bar something')).toEqual({
		match: '/bar something',
		pattern: '/bar something',
		substring: '/bar something',
	});
	expect(matchesStringOrRegExp('bar something/', 'bar something/')).toEqual({
		match: 'bar something/',
		pattern: 'bar something/',
		substring: 'bar something/',
	});
	expect(matchesStringOrRegExp('bar something/', 'bar something//')).toBeFalsy();

	expect(matchesStringOrRegExp(['foo', 'bar'], 'bar')).toEqual({
		match: 'bar',
		pattern: 'bar',
		substring: 'bar',
	});
	expect(matchesStringOrRegExp(['foo', 'baz'], 'bar')).toBeFalsy();

	expect(matchesStringOrRegExp('bar', ['foo', 'bar'])).toEqual({
		match: 'bar',
		pattern: 'bar',
		substring: 'bar',
	});
	expect(matchesStringOrRegExp('bar', ['foo', 'baz'])).toBeFalsy();

	expect(matchesStringOrRegExp(['foo', 'baz'], ['foo', 'bar'])).toEqual({
		match: 'foo',
		pattern: 'foo',
		substring: 'foo',
	});
	expect(matchesStringOrRegExp(['bar', 'hooha'], ['foo', 'baz'])).toBeFalsy();
});

it('matchesStringOrRegExp comparing with a RegExp comparisonValue', () => {
	expect(matchesStringOrRegExp('.foo', '/\\.foo$/')).toEqual({
		match: '.foo',
		pattern: '/\\.foo$/',
		substring: '.foo',
	});
	expect(matchesStringOrRegExp('bar .foo', '/\\.foo$/')).toEqual({
		match: 'bar .foo',
		pattern: '/\\.foo$/',
		substring: '.foo',
	});
	expect(matchesStringOrRegExp('bar .foo bar', '/\\.foo$/')).toBeFalsy();
	expect(matchesStringOrRegExp('foo', '/\\.foo$/')).toBeFalsy();

	expect(matchesStringOrRegExp(['.foo', 'bar'], '/\\.foo$/')).toEqual({
		match: '.foo',
		pattern: '/\\.foo$/',
		substring: '.foo',
	});
	expect(matchesStringOrRegExp(['foo', 'baz'], '/\\.foo$/')).toBeFalsy();

	expect(matchesStringOrRegExp('.foo', ['/\\.foo$/', '/^bar/'])).toEqual({
		match: '.foo',
		pattern: '/\\.foo$/',
		substring: '.foo',
	});
	expect(matchesStringOrRegExp('bar', ['/\\.foo$/', '/^bar/'])).toEqual({
		match: 'bar',
		pattern: '/^bar/',
		substring: 'bar',
	});
	expect(matchesStringOrRegExp('ebarz', ['/\\.foo$/', '/^bar/'])).toBeFalsy();

	expect(matchesStringOrRegExp(['.foo', 'ebarz'], ['/\\.foo$/', '/^bar/'])).toEqual({
		match: '.foo',
		pattern: '/\\.foo$/',
		substring: '.foo',
	});
	expect(matchesStringOrRegExp(['bar', 'foo'], ['/\\.foo$/', '/^bar/'])).toEqual({
		match: 'bar',
		pattern: '/^bar/',
		substring: 'bar',
	});
	expect(matchesStringOrRegExp(['ebarz', 'foo'], ['/\\.foo$/', '/^bar/'])).toBeFalsy();
	expect(matchesStringOrRegExp(['foobar'], ['/FOO/'])).toBeFalsy();
	expect(matchesStringOrRegExp(['FOOBAR'], ['/FOO/'])).toEqual({
		match: 'FOOBAR',
		pattern: '/FOO/',
		substring: 'FOO',
	});
});

it('matchesStringOrRegExp comparing with a actual RegExp comparisonValue', () => {
	expect(matchesStringOrRegExp('.foo', /.foo$/)).toEqual({
		match: '.foo',
		pattern: /.foo$/,
		substring: '.foo',
	});
	expect(matchesStringOrRegExp('bar .foo', /.foo$/)).toEqual({
		match: 'bar .foo',
		pattern: /.foo$/,
		substring: '.foo',
	});
	expect(matchesStringOrRegExp('bar .foo bar', /.foo$/)).toBeFalsy();
	expect(matchesStringOrRegExp('foo', /.foo$/)).toBeFalsy();
	expect(matchesStringOrRegExp(['.foo', 'ebarz'], [/.foo$/, /^bar/])).toEqual({
		match: '.foo',
		pattern: /.foo$/,
		substring: '.foo',
	});
	expect(matchesStringOrRegExp(['foobar'], [/FOO/])).toBeFalsy();
	expect(matchesStringOrRegExp(['FOOBAR'], [/FOO/])).toEqual({
		match: 'FOOBAR',
		pattern: /FOO/,
		substring: 'FOO',
	});
});

it('matchesStringOrRegExp comparing with an empty array', () => {
	expect(matchesStringOrRegExp('.foo', [])).toBeFalsy();
});
