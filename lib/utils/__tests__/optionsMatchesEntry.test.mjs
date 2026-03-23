import optionsMatchesEntry from '../optionsMatchesEntry.mjs';

it('optionsMatchesEntry matches a string key and value', () => {
	expect(optionsMatchesEntry({ foo: { bar: 'baz' } }, 'foo', 'bar', 'baz')).toBeTruthy();
	expect(optionsMatchesEntry({ foo: { bar: 'baz' } }, 'foo', 'bar', 'qux')).toBeFalsy();
});

it('optionsMatchesEntry matches an array value', () => {
	expect(optionsMatchesEntry({ foo: { bar: ['baz', 'qux'] } }, 'foo', 'bar', 'qux')).toBeTruthy();
	expect(optionsMatchesEntry({ foo: { bar: ['baz', 'qux'] } }, 'foo', 'bar', 'nope')).toBeFalsy();
});

it('optionsMatchesEntry matches regex patterns', () => {
	expect(optionsMatchesEntry({ foo: { '/^ba/': 'baz' } }, 'foo', 'bar', 'baz')).toBeTruthy();
	expect(optionsMatchesEntry({ foo: { bar: '/^ba/' } }, 'foo', 'bar', 'baz')).toBeTruthy();
	expect(optionsMatchesEntry({ foo: { '/^ba/': '/^qux/' } }, 'foo', 'bar', 'baz')).toBeFalsy();
});

it('optionsMatchesEntry returns false for missing options', () => {
	expect(optionsMatchesEntry({}, 'foo', 'bar', 'baz')).toBeFalsy();
	expect(optionsMatchesEntry(undefined, 'foo', 'bar', 'baz')).toBeFalsy();
});

it('optionsMatchesEntry returns false for non-string input', () => {
	expect(optionsMatchesEntry({ foo: { bar: 'baz' } }, 'foo', 1, 'baz')).toBeFalsy();
	expect(optionsMatchesEntry({ foo: { bar: 'baz' } }, 'foo', 'bar', 2)).toBeFalsy();
});
