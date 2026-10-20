import assert from 'node:assert/strict';
import { it } from 'node:test';

import optionsMatches from '../optionsMatches.mjs';

it('optionsMatches matches a string', () => {
	assert.ok(optionsMatches({ foo: 'bar' }, 'foo', 'bar'));

	assert.ok(!optionsMatches({ foo: 'bar' }, 'foo', 'BAR'));
	assert.ok(!optionsMatches('not an object', 'foo', 'bar'));
	assert.ok(!optionsMatches({ baz: 'bar' }, 'foo', 'bar'));
	assert.ok(!optionsMatches({ foo: '100' }, 'foo', 100));
	assert.ok(!optionsMatches({ foo: 'baz' }, 'foo', 'bar'));

	assert.ok(optionsMatches({ foo: ['baz', 'bar'] }, 'foo', 'bar'));
	assert.ok(!optionsMatches({ foo: ['baz', 'qux'] }, 'foo', 'bar'));
});

it('optionsMatches matches a RegExp', () => {
	assert.ok(optionsMatches({ foo: '/\\.bar/' }, 'foo', '.bar'));
	assert.ok(!optionsMatches({ foo: '/\\.baz$/' }, 'foo', '.bar'));

	assert.ok(!optionsMatches({ foo: '/[a-z]+/' }, 'foo', 'BAR'));
	assert.ok(optionsMatches({ foo: '/[A-Z]+/' }, 'foo', 'BAR'));

	assert.ok(optionsMatches({ foo: '/[a-z]+/i' }, 'foo', 'BAR'));
	assert.ok(optionsMatches({ foo: '/[A-Z]+/i' }, 'foo', 'bar'));

	assert.ok(optionsMatches({ foo: ['/\\.bar$/', '.baz'] }, 'foo', '.bar'));
	assert.ok(optionsMatches({ foo: ['/\\.bar$/', '.baz'] }, 'foo', '.baz'));
	assert.ok(!optionsMatches({ foo: ['/\\.bar$/', 'qux'] }, 'foo', '.baz'));
});

it('optionsMatches does not match any value without the property', () => {
	assert.ok(!optionsMatches({}, 'foo', 'bar'));
});

it('optionsMatches does not match any value with the empty array property', () => {
	assert.ok(!optionsMatches({ foo: [] }, 'foo', 'bar'));
});
