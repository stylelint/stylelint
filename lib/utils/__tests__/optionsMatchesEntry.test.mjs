import { it } from 'node:test';

import optionsMatchesEntry from '../optionsMatchesEntry.mjs';

it('optionsMatchesEntry matches a string key and value', (t) => {
	t.assert.ok(optionsMatchesEntry({ foo: { bar: 'baz' } }, 'foo', 'bar', 'baz'));
	t.assert.ok(!optionsMatchesEntry({ foo: { bar: 'baz' } }, 'foo', 'bar', 'qux'));
});

it('optionsMatchesEntry matches an array value', (t) => {
	t.assert.ok(optionsMatchesEntry({ foo: { bar: ['baz', 'qux'] } }, 'foo', 'bar', 'qux'));
	t.assert.ok(!optionsMatchesEntry({ foo: { bar: ['baz', 'qux'] } }, 'foo', 'bar', 'nope'));
});

it('optionsMatchesEntry matches regex patterns', (t) => {
	t.assert.ok(optionsMatchesEntry({ foo: { '/^ba/': 'baz' } }, 'foo', 'bar', 'baz'));
	t.assert.ok(optionsMatchesEntry({ foo: { bar: '/^ba/' } }, 'foo', 'bar', 'baz'));
	t.assert.ok(!optionsMatchesEntry({ foo: { '/^ba/': '/^qux/' } }, 'foo', 'bar', 'baz'));
});

it('optionsMatchesEntry matches any entry whose key matches', (t) => {
	const options = { foo: { '/^ba/': 'baz', bar: 'qux' } };

	t.assert.ok(optionsMatchesEntry(options, 'foo', 'bar', 'baz'));
	t.assert.ok(optionsMatchesEntry(options, 'foo', 'bar', 'qux'));
});

it('optionsMatchesEntry returns false for missing options', (t) => {
	t.assert.ok(!optionsMatchesEntry({}, 'foo', 'bar', 'baz'));
	t.assert.ok(!optionsMatchesEntry(undefined, 'foo', 'bar', 'baz'));
});

it('optionsMatchesEntry returns false for non-string input', (t) => {
	t.assert.ok(!optionsMatchesEntry({ foo: { bar: 'baz' } }, 'foo', 1, 'baz'));
	t.assert.ok(!optionsMatchesEntry({ foo: { bar: 'baz' } }, 'foo', 'bar', 2));
});
