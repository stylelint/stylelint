import { it } from 'node:test';

import optionsMatches from '../optionsMatches.mjs';

it('optionsMatches matches a string', (t) => {
	t.assert.ok(optionsMatches({ foo: 'bar' }, 'foo', 'bar'));

	t.assert.ok(!optionsMatches({ foo: 'bar' }, 'foo', 'BAR'));
	t.assert.ok(!optionsMatches('not an object', 'foo', 'bar'));
	t.assert.ok(!optionsMatches({ baz: 'bar' }, 'foo', 'bar'));
	t.assert.ok(!optionsMatches({ foo: '100' }, 'foo', 100));
	t.assert.ok(!optionsMatches({ foo: 'baz' }, 'foo', 'bar'));

	t.assert.ok(optionsMatches({ foo: ['baz', 'bar'] }, 'foo', 'bar'));
	t.assert.ok(!optionsMatches({ foo: ['baz', 'qux'] }, 'foo', 'bar'));
});

it('optionsMatches matches a RegExp', (t) => {
	t.assert.ok(optionsMatches({ foo: '/\\.bar/' }, 'foo', '.bar'));
	t.assert.ok(!optionsMatches({ foo: '/\\.baz$/' }, 'foo', '.bar'));

	t.assert.ok(!optionsMatches({ foo: '/[a-z]+/' }, 'foo', 'BAR'));
	t.assert.ok(optionsMatches({ foo: '/[A-Z]+/' }, 'foo', 'BAR'));

	t.assert.ok(optionsMatches({ foo: '/[a-z]+/i' }, 'foo', 'BAR'));
	t.assert.ok(optionsMatches({ foo: '/[A-Z]+/i' }, 'foo', 'bar'));

	t.assert.ok(optionsMatches({ foo: ['/\\.bar$/', '.baz'] }, 'foo', '.bar'));
	t.assert.ok(optionsMatches({ foo: ['/\\.bar$/', '.baz'] }, 'foo', '.baz'));
	t.assert.ok(!optionsMatches({ foo: ['/\\.bar$/', 'qux'] }, 'foo', '.baz'));
});

it('optionsMatches does not match any value without the property', (t) => {
	t.assert.ok(!optionsMatches({}, 'foo', 'bar'));
});

it('optionsMatches does not match any value with the empty array property', (t) => {
	t.assert.ok(!optionsMatches({ foo: [] }, 'foo', 'bar'));
});
