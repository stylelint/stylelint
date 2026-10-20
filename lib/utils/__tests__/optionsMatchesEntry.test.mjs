import assert from 'node:assert/strict';
import { it } from 'node:test';

import optionsMatchesEntry from '../optionsMatchesEntry.mjs';

it('optionsMatchesEntry matches a string key and value', () => {
	assert.ok(optionsMatchesEntry({ foo: { bar: 'baz' } }, 'foo', 'bar', 'baz'));
	assert.ok(!optionsMatchesEntry({ foo: { bar: 'baz' } }, 'foo', 'bar', 'qux'));
});

it('optionsMatchesEntry matches an array value', () => {
	assert.ok(optionsMatchesEntry({ foo: { bar: ['baz', 'qux'] } }, 'foo', 'bar', 'qux'));
	assert.ok(!optionsMatchesEntry({ foo: { bar: ['baz', 'qux'] } }, 'foo', 'bar', 'nope'));
});

it('optionsMatchesEntry matches regex patterns', () => {
	assert.ok(optionsMatchesEntry({ foo: { '/^ba/': 'baz' } }, 'foo', 'bar', 'baz'));
	assert.ok(optionsMatchesEntry({ foo: { bar: '/^ba/' } }, 'foo', 'bar', 'baz'));
	assert.ok(!optionsMatchesEntry({ foo: { '/^ba/': '/^qux/' } }, 'foo', 'bar', 'baz'));
});

it('optionsMatchesEntry matches any entry whose key matches', () => {
	const options = { foo: { '/^ba/': 'baz', bar: 'qux' } };

	assert.ok(optionsMatchesEntry(options, 'foo', 'bar', 'baz'));
	assert.ok(optionsMatchesEntry(options, 'foo', 'bar', 'qux'));
});

it('optionsMatchesEntry returns false for missing options', () => {
	assert.ok(!optionsMatchesEntry({}, 'foo', 'bar', 'baz'));
	assert.ok(!optionsMatchesEntry(undefined, 'foo', 'bar', 'baz'));
});

it('optionsMatchesEntry returns false for non-string input', () => {
	assert.ok(!optionsMatchesEntry({ foo: { bar: 'baz' } }, 'foo', 1, 'baz'));
	assert.ok(!optionsMatchesEntry({ foo: { bar: 'baz' } }, 'foo', 'bar', 2));
});
