'use strict';

const containsString = require('../containsString');

it('containsString comparing with string comparison values', () => {
	expect(containsString('bar', 'bar')).toEqual({
		match: 'bar',
		pattern: 'bar',
	});
	expect(containsString('foo bar something', 'bar')).toEqual({
		match: 'foo bar something',
		pattern: 'bar',
	});
	expect(containsString('bar', 'foo')).toBeFalsy();
	expect(containsString('/bar something', '/bar')).toEqual({
		match: '/bar something',
		pattern: '/bar',
	});
	expect(containsString('bar something/', 'something/')).toEqual({
		match: 'bar something/',
		pattern: 'something/',
	});
	expect(containsString('/bar/', '/bar/')).toBeFalsy();
	expect(containsString('/bar/ something', '/bar/')).toBeFalsy();
	expect(containsString('bar', '')).toBeFalsy();
	expect(containsString('bar', null)).toBeFalsy();
});

it('containsString comparing with array comparison values', () => {
	expect(containsString('bar', ['foo', 'bar'])).toEqual({
		match: 'bar',
		pattern: 'bar',
	});
	expect(containsString('foo baz something', ['bar', 'baz'])).toEqual({
		match: 'foo baz something',
		pattern: 'baz',
	});
	expect(containsString('foo bar', ['bar', 'foo'])).toEqual({
		match: 'foo bar',
		pattern: 'bar',
	});
	expect(containsString('bar', ['foo', 'baz'])).toBeFalsy();
	expect(containsString('/bar/', ['/bar/'])).toBeFalsy();
	expect(containsString('/bar/ something', ['/bar/', 'foo'])).toBeFalsy();
	expect(containsString('bar', [])).toBeFalsy();
});
