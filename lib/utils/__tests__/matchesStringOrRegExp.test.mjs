import assert from 'node:assert/strict';
import { it } from 'node:test';

import matchesStringOrRegExp from '../matchesStringOrRegExp.mjs';

it('matchesStringOrRegExp comparing with string comparisonValues', () => {
	assert.deepEqual(matchesStringOrRegExp('bar', 'bar'), {
		match: 'bar',
		pattern: 'bar',
		substring: 'bar',
	});
	assert.ok(!matchesStringOrRegExp('bar', '/bar something'));
	assert.deepEqual(matchesStringOrRegExp('/bar something', '/bar something'), {
		match: '/bar something',
		pattern: '/bar something',
		substring: '/bar something',
	});
	assert.deepEqual(matchesStringOrRegExp('bar something/', 'bar something/'), {
		match: 'bar something/',
		pattern: 'bar something/',
		substring: 'bar something/',
	});
	assert.ok(!matchesStringOrRegExp('bar something/', 'bar something//'));

	assert.deepEqual(matchesStringOrRegExp(['foo', 'bar'], 'bar'), {
		match: 'bar',
		pattern: 'bar',
		substring: 'bar',
	});
	assert.ok(!matchesStringOrRegExp(['foo', 'baz'], 'bar'));

	assert.deepEqual(matchesStringOrRegExp('bar', ['foo', 'bar']), {
		match: 'bar',
		pattern: 'bar',
		substring: 'bar',
	});
	assert.ok(!matchesStringOrRegExp('bar', ['foo', 'baz']));

	assert.deepEqual(matchesStringOrRegExp(['foo', 'baz'], ['foo', 'bar']), {
		match: 'foo',
		pattern: 'foo',
		substring: 'foo',
	});
	assert.ok(!matchesStringOrRegExp(['bar', 'hooha'], ['foo', 'baz']));
});

it('matchesStringOrRegExp comparing with a RegExp comparisonValue', () => {
	assert.deepEqual(matchesStringOrRegExp('.foo', '/\\.foo$/'), {
		match: '.foo',
		pattern: '/\\.foo$/',
		substring: '.foo',
	});
	assert.deepEqual(matchesStringOrRegExp('bar .foo', '/\\.foo$/'), {
		match: 'bar .foo',
		pattern: '/\\.foo$/',
		substring: '.foo',
	});
	assert.ok(!matchesStringOrRegExp('bar .foo bar', '/\\.foo$/'));
	assert.ok(!matchesStringOrRegExp('foo', '/\\.foo$/'));

	assert.deepEqual(matchesStringOrRegExp(['.foo', 'bar'], '/\\.foo$/'), {
		match: '.foo',
		pattern: '/\\.foo$/',
		substring: '.foo',
	});
	assert.ok(!matchesStringOrRegExp(['foo', 'baz'], '/\\.foo$/'));

	assert.deepEqual(matchesStringOrRegExp('.foo', ['/\\.foo$/', '/^bar/']), {
		match: '.foo',
		pattern: '/\\.foo$/',
		substring: '.foo',
	});
	assert.deepEqual(matchesStringOrRegExp('bar', ['/\\.foo$/', '/^bar/']), {
		match: 'bar',
		pattern: '/^bar/',
		substring: 'bar',
	});
	assert.ok(!matchesStringOrRegExp('ebarz', ['/\\.foo$/', '/^bar/']));

	assert.deepEqual(matchesStringOrRegExp(['.foo', 'ebarz'], ['/\\.foo$/', '/^bar/']), {
		match: '.foo',
		pattern: '/\\.foo$/',
		substring: '.foo',
	});
	assert.deepEqual(matchesStringOrRegExp(['bar', 'foo'], ['/\\.foo$/', '/^bar/']), {
		match: 'bar',
		pattern: '/^bar/',
		substring: 'bar',
	});
	assert.ok(!matchesStringOrRegExp(['ebarz', 'foo'], ['/\\.foo$/', '/^bar/']));
	assert.ok(!matchesStringOrRegExp(['foobar'], ['/FOO/']));
	assert.deepEqual(matchesStringOrRegExp(['FOOBAR'], ['/FOO/']), {
		match: 'FOOBAR',
		pattern: '/FOO/',
		substring: 'FOO',
	});
});

it('matchesStringOrRegExp comparing with a actual RegExp comparisonValue', () => {
	assert.deepEqual(matchesStringOrRegExp('.foo', /.foo$/), {
		match: '.foo',
		pattern: /.foo$/,
		substring: '.foo',
	});
	assert.deepEqual(matchesStringOrRegExp('bar .foo', /.foo$/), {
		match: 'bar .foo',
		pattern: /.foo$/,
		substring: '.foo',
	});
	assert.ok(!matchesStringOrRegExp('bar .foo bar', /.foo$/));
	assert.ok(!matchesStringOrRegExp('foo', /.foo$/));
	assert.deepEqual(matchesStringOrRegExp(['.foo', 'ebarz'], [/.foo$/, /^bar/]), {
		match: '.foo',
		pattern: /.foo$/,
		substring: '.foo',
	});
	assert.ok(!matchesStringOrRegExp(['foobar'], [/FOO/]));
	assert.deepEqual(matchesStringOrRegExp(['FOOBAR'], [/FOO/]), {
		match: 'FOOBAR',
		pattern: /FOO/,
		substring: 'FOO',
	});
});

it('matchesStringOrRegExp comparing with an empty array', () => {
	assert.ok(!matchesStringOrRegExp('.foo', []));
});
