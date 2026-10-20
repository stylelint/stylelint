import assert from 'node:assert/strict';
import { it } from 'node:test';

import containsString from '../containsString.mjs';

it('containsString comparing with string comparison values', () => {
	assert.deepEqual(containsString('bar', 'bar'), {
		match: 'bar',
		pattern: 'bar',
		substring: 'bar',
	});
	assert.deepEqual(containsString('foo bar something', 'bar'), {
		match: 'foo bar something',
		pattern: 'bar',
		substring: 'bar',
	});
	assert.ok(!containsString('bar', 'foo'));
	assert.deepEqual(containsString('/bar something', '/bar'), {
		match: '/bar something',
		pattern: '/bar',
		substring: '/bar',
	});
	assert.deepEqual(containsString('bar something/', 'something/'), {
		match: 'bar something/',
		pattern: 'something/',
		substring: 'something/',
	});
	assert.ok(!containsString('/bar/', '/bar/'));
	assert.ok(!containsString('/bar/ something', '/bar/'));
	assert.ok(!containsString('bar', ''));
	assert.ok(!containsString('bar', null));
});

it('containsString comparing with array comparison values', () => {
	assert.deepEqual(containsString('bar', ['foo', 'bar']), {
		match: 'bar',
		pattern: 'bar',
		substring: 'bar',
	});
	assert.deepEqual(containsString('foo baz something', ['bar', 'baz']), {
		match: 'foo baz something',
		pattern: 'baz',
		substring: 'baz',
	});
	assert.deepEqual(containsString('foo bar', ['bar', 'foo']), {
		match: 'foo bar',
		pattern: 'bar',
		substring: 'bar',
	});
	assert.ok(!containsString('bar', ['foo', 'baz']));
	assert.ok(!containsString('/bar/', ['/bar/']));
	assert.ok(!containsString('/bar/ something', ['/bar/', 'foo']));
	assert.ok(!containsString('bar', []));
});
