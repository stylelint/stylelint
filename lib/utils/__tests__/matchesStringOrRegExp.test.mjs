import { it } from 'node:test';

import matchesStringOrRegExp from '../matchesStringOrRegExp.mjs';

it('matchesStringOrRegExp comparing with string comparisonValues', (t) => {
	t.assert.deepStrictEqual(matchesStringOrRegExp('bar', 'bar'), {
		match: 'bar',
		pattern: 'bar',
		substring: 'bar',
	});
	t.assert.ok(!matchesStringOrRegExp('bar', '/bar something'));
	t.assert.deepStrictEqual(matchesStringOrRegExp('/bar something', '/bar something'), {
		match: '/bar something',
		pattern: '/bar something',
		substring: '/bar something',
	});
	t.assert.deepStrictEqual(matchesStringOrRegExp('bar something/', 'bar something/'), {
		match: 'bar something/',
		pattern: 'bar something/',
		substring: 'bar something/',
	});
	t.assert.ok(!matchesStringOrRegExp('bar something/', 'bar something//'));

	t.assert.deepStrictEqual(matchesStringOrRegExp(['foo', 'bar'], 'bar'), {
		match: 'bar',
		pattern: 'bar',
		substring: 'bar',
	});
	t.assert.ok(!matchesStringOrRegExp(['foo', 'baz'], 'bar'));

	t.assert.deepStrictEqual(matchesStringOrRegExp('bar', ['foo', 'bar']), {
		match: 'bar',
		pattern: 'bar',
		substring: 'bar',
	});
	t.assert.ok(!matchesStringOrRegExp('bar', ['foo', 'baz']));

	t.assert.deepStrictEqual(matchesStringOrRegExp(['foo', 'baz'], ['foo', 'bar']), {
		match: 'foo',
		pattern: 'foo',
		substring: 'foo',
	});
	t.assert.ok(!matchesStringOrRegExp(['bar', 'hooha'], ['foo', 'baz']));
});

it('matchesStringOrRegExp comparing with a RegExp comparisonValue', (t) => {
	t.assert.deepStrictEqual(matchesStringOrRegExp('.foo', '/\\.foo$/'), {
		match: '.foo',
		pattern: '/\\.foo$/',
		substring: '.foo',
	});
	t.assert.deepStrictEqual(matchesStringOrRegExp('bar .foo', '/\\.foo$/'), {
		match: 'bar .foo',
		pattern: '/\\.foo$/',
		substring: '.foo',
	});
	t.assert.ok(!matchesStringOrRegExp('bar .foo bar', '/\\.foo$/'));
	t.assert.ok(!matchesStringOrRegExp('foo', '/\\.foo$/'));

	t.assert.deepStrictEqual(matchesStringOrRegExp(['.foo', 'bar'], '/\\.foo$/'), {
		match: '.foo',
		pattern: '/\\.foo$/',
		substring: '.foo',
	});
	t.assert.ok(!matchesStringOrRegExp(['foo', 'baz'], '/\\.foo$/'));

	t.assert.deepStrictEqual(matchesStringOrRegExp('.foo', ['/\\.foo$/', '/^bar/']), {
		match: '.foo',
		pattern: '/\\.foo$/',
		substring: '.foo',
	});
	t.assert.deepStrictEqual(matchesStringOrRegExp('bar', ['/\\.foo$/', '/^bar/']), {
		match: 'bar',
		pattern: '/^bar/',
		substring: 'bar',
	});
	t.assert.ok(!matchesStringOrRegExp('ebarz', ['/\\.foo$/', '/^bar/']));

	t.assert.deepStrictEqual(matchesStringOrRegExp(['.foo', 'ebarz'], ['/\\.foo$/', '/^bar/']), {
		match: '.foo',
		pattern: '/\\.foo$/',
		substring: '.foo',
	});
	t.assert.deepStrictEqual(matchesStringOrRegExp(['bar', 'foo'], ['/\\.foo$/', '/^bar/']), {
		match: 'bar',
		pattern: '/^bar/',
		substring: 'bar',
	});
	t.assert.ok(!matchesStringOrRegExp(['ebarz', 'foo'], ['/\\.foo$/', '/^bar/']));
	t.assert.ok(!matchesStringOrRegExp(['foobar'], ['/FOO/']));
	t.assert.deepStrictEqual(matchesStringOrRegExp(['FOOBAR'], ['/FOO/']), {
		match: 'FOOBAR',
		pattern: '/FOO/',
		substring: 'FOO',
	});
});

it('matchesStringOrRegExp comparing with a actual RegExp comparisonValue', (t) => {
	t.assert.deepStrictEqual(matchesStringOrRegExp('.foo', /.foo$/), {
		match: '.foo',
		pattern: /.foo$/,
		substring: '.foo',
	});
	t.assert.deepStrictEqual(matchesStringOrRegExp('bar .foo', /.foo$/), {
		match: 'bar .foo',
		pattern: /.foo$/,
		substring: '.foo',
	});
	t.assert.ok(!matchesStringOrRegExp('bar .foo bar', /.foo$/));
	t.assert.ok(!matchesStringOrRegExp('foo', /.foo$/));
	t.assert.deepStrictEqual(matchesStringOrRegExp(['.foo', 'ebarz'], [/.foo$/, /^bar/]), {
		match: '.foo',
		pattern: /.foo$/,
		substring: '.foo',
	});
	t.assert.ok(!matchesStringOrRegExp(['foobar'], [/FOO/]));
	t.assert.deepStrictEqual(matchesStringOrRegExp(['FOOBAR'], [/FOO/]), {
		match: 'FOOBAR',
		pattern: /FOO/,
		substring: 'FOO',
	});
});

it('matchesStringOrRegExp comparing with an empty array', (t) => {
	t.assert.ok(!matchesStringOrRegExp('.foo', []));
});
