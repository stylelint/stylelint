'use strict';

const optionsMatches = require('../optionsMatches');

it('optionsMatches matches a string', () => {
	expect(optionsMatches({ foo: 'bar' }, 'foo', 'bar')).toBeTruthy();

	expect(optionsMatches({ foo: 'bar' }, 'foo', 'BAR')).toBeFalsy();
	expect(optionsMatches('not an object', 'foo', 'bar')).toBeFalsy();
	expect(optionsMatches({ baz: 'bar' }, 'foo', 'bar')).toBeFalsy();
	expect(optionsMatches({ foo: '100' }, 'foo', 100)).toBeFalsy();
	expect(optionsMatches({ foo: 'baz' }, 'foo', 'bar')).toBeFalsy();

	expect(optionsMatches({ foo: ['baz', 'bar'] }, 'foo', 'bar')).toBeTruthy();
	expect(optionsMatches({ foo: ['baz', 'qux'] }, 'foo', 'bar')).toBeFalsy();
});

it('optionsMatches matches a RegExp', () => {
	expect(optionsMatches({ foo: '/\\.bar/' }, 'foo', '.bar')).toBeTruthy();
	expect(optionsMatches({ foo: '/\\.baz$/' }, 'foo', '.bar')).toBeFalsy();

	expect(optionsMatches({ foo: '/[a-z]+/' }, 'foo', 'BAR')).toBeFalsy();
	expect(optionsMatches({ foo: '/[A-Z]+/' }, 'foo', 'BAR')).toBeTruthy();

	expect(optionsMatches({ foo: '/[a-z]+/i' }, 'foo', 'BAR')).toBeTruthy();
	expect(optionsMatches({ foo: '/[A-Z]+/i' }, 'foo', 'bar')).toBeTruthy();

	expect(optionsMatches({ foo: ['/\\.bar$/', '.baz'] }, 'foo', '.bar')).toBeTruthy();
	expect(optionsMatches({ foo: ['/\\.bar$/', '.baz'] }, 'foo', '.baz')).toBeTruthy();
	expect(optionsMatches({ foo: ['/\\.bar$/', 'qux'] }, 'foo', '.baz')).toBeFalsy();
});
