import { it } from 'node:test';

import containsString from '../containsString.mjs';

it('containsString comparing with string comparison values', (t) => {
	t.assert.deepStrictEqual(containsString('bar', 'bar'), {
		match: 'bar',
		pattern: 'bar',
		substring: 'bar',
	});
	t.assert.deepStrictEqual(containsString('foo bar something', 'bar'), {
		match: 'foo bar something',
		pattern: 'bar',
		substring: 'bar',
	});
	t.assert.ok(!containsString('bar', 'foo'));
	t.assert.deepStrictEqual(containsString('/bar something', '/bar'), {
		match: '/bar something',
		pattern: '/bar',
		substring: '/bar',
	});
	t.assert.deepStrictEqual(containsString('bar something/', 'something/'), {
		match: 'bar something/',
		pattern: 'something/',
		substring: 'something/',
	});
	t.assert.ok(!containsString('/bar/', '/bar/'));
	t.assert.ok(!containsString('/bar/ something', '/bar/'));
	t.assert.ok(!containsString('bar', ''));
	t.assert.ok(!containsString('bar', null));
});

it('containsString comparing with array comparison values', (t) => {
	t.assert.deepStrictEqual(containsString('bar', ['foo', 'bar']), {
		match: 'bar',
		pattern: 'bar',
		substring: 'bar',
	});
	t.assert.deepStrictEqual(containsString('foo baz something', ['bar', 'baz']), {
		match: 'foo baz something',
		pattern: 'baz',
		substring: 'baz',
	});
	t.assert.deepStrictEqual(containsString('foo bar', ['bar', 'foo']), {
		match: 'foo bar',
		pattern: 'bar',
		substring: 'bar',
	});
	t.assert.ok(!containsString('bar', ['foo', 'baz']));
	t.assert.ok(!containsString('/bar/', ['/bar/']));
	t.assert.ok(!containsString('/bar/ something', ['/bar/', 'foo']));
	t.assert.ok(!containsString('bar', []));
});
