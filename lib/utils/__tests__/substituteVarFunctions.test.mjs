import substituteVarFunctions, { getSubstitutedValue } from '../substituteVarFunctions.mjs';

/** @import { VarFunctionSubstitution } from '../substituteVarFunctions.mjs' */

describe('substituteVarFunctions', () => {
	it('substitutes each var() with a value of its custom property', () => {
		expect(
			run('var(--foo) solid var(--bar)', {
				'--foo': ['1px'],
				'--bar': ['red'],
			}),
		).toMatchObject([
			[
				{ start: 0, end: 10, name: '--foo', value: '1px' },
				{ start: 17, end: 27, name: '--bar', value: 'red' },
			],
		]);
	});

	it('substitutes every combination of values, in the order they are given', () => {
		const substitutedValues = run('var(--foo) var(--bar)', {
			'--foo': ['1px', '2px'],
			'--bar': ['red', 'blue'],
		});

		expect(
			substitutedValues.map((substitutions) => substitutions.map(({ value }) => value)),
		).toEqual([
			['1px', 'red'],
			['1px', 'blue'],
			['2px', 'red'],
			['2px', 'blue'],
		]);
	});

	it('substitutes var()s within the values of custom properties', () => {
		expect(run('var(--foo)', { '--foo': ['1px var(--bar)'], '--bar': ['red'] })).toMatchObject([
			[{ start: 0, end: 10, value: '1px red' }],
		]);
	});

	it('substitutes var()s within functions', () => {
		expect(run('rgb(var(--foo) 0 0)', { '--foo': ['0'] })).toMatchObject([
			[{ start: 4, end: 14, value: '0' }],
		]);
	});

	it('ignores the fallback of a known custom property', () => {
		expect(run('var(--foo, var(--bar))', { '--foo': ['red'] })).toMatchObject([
			[{ start: 0, end: 22, value: 'red' }],
		]);
	});

	it('matches var() case-insensitively', () => {
		expect(run('VAR(--foo)', { '--foo': ['red'] })).toMatchObject([
			[{ start: 0, end: 10, value: 'red' }],
		]);
	});

	it('substitutes a var() whose custom property follows a comment', () => {
		expect(run('var(/* qux */ --foo)', { '--foo': ['red'] })).toMatchObject([
			[{ start: 0, end: 20, value: 'red' }],
		]);
	});

	it('substituted tokens take the source indices of the var(), padded with whitespace', () => {
		const [substitutedValue] = substituteVarFunctions(
			'1px var(--foo)',
			new Map([['--foo', ['solid red']]]),
		);

		expect(
			substitutedValue?.tokens.map(([, representation, start, end]) => [
				representation,
				start,
				end,
			]),
		).toEqual([
			['1px', 0, 2],
			[' ', 3, 3],
			[' ', 4, 13],
			['solid', 4, 13],
			[' ', 4, 13],
			['red', 4, 13],
			[' ', 4, 13],
		]);
	});

	it('substitutes nothing when there are no var()s', () => {
		expect(run('red', {})).toEqual([[]]);
	});

	it('substitutes nothing for an unknown custom property', () => {
		expect(run('var(--foo)', {})).toEqual([]);
	});

	it('substitutes nothing for a custom property without values', () => {
		expect(run('var(--foo)', { '--foo': [] })).toEqual([]);
	});

	it('substitutes nothing for a custom property that references itself', () => {
		expect(run('var(--foo)', { '--foo': ['var(--foo)'] })).toEqual([]);
	});

	it('substitutes nothing for the custom properties in a cycle and those that reach it', () => {
		const customPropertyValues = new Map([
			['--foo', ['var(--bar)']],
			['--bar', ['var(--foo)']],
			['--baz', ['var(--bar)']],
		]);

		expect(substituteVarFunctions('var(--foo)', customPropertyValues)).toEqual([]);
		expect(substituteVarFunctions('var(--bar)', customPropertyValues)).toEqual([]);
		expect(substituteVarFunctions('var(--baz)', customPropertyValues)).toEqual([]);
	});

	it('substitutes nothing for a custom property with a CSS-wide keyword', () => {
		expect(run('var(--foo)', { '--foo': ['red', 'INHERIT'] })).toEqual([]);
	});

	it('substitutes nothing for a var() without a custom property', () => {
		expect(run('var(foo)', { foo: ['red'] })).toEqual([]);
		expect(run('var()', {})).toEqual([]);
	});

	it('substitutes nothing when any value of the custom property cannot be substituted', () => {
		expect(run('var(--foo)', { '--foo': ['red', 'var(--bar)'] })).toEqual([]);
	});

	it('substitutes nothing when there would be more than 1000 combinations of values', () => {
		expect(
			run('var(--foo) var(--bar)', { '--foo': lengths(10), '--bar': lengths(100) }),
		).toHaveLength(1000);
		expect(run('var(--foo) var(--bar)', { '--foo': lengths(11), '--bar': lengths(100) })).toEqual(
			[],
		);
		expect(run('var(--bar)', { '--foo': lengths(1001), '--bar': ['var(--foo)'] })).toEqual([]);
	});
});

describe('getSubstitutedValue', () => {
	/** @type {VarFunctionSubstitution[]} */
	const substitutions = [
		{ start: 4, end: 14, name: '--foo', value: '1px', tokens: [] },
		{ start: 21, end: 31, name: '--bar', value: 'red', tokens: [] },
	];

	it('gets the value with its var()s substituted', () => {
		expect(getSubstitutedValue('0 0 var(--foo) solid var(--bar)', substitutions)).toBe(
			'0 0 1px solid red',
		);
	});

	it('gets a range of the value with its var()s substituted', () => {
		expect(
			getSubstitutedValue('0 0 var(--foo) solid var(--bar)', substitutions.slice(0, 1), 2, 20),
		).toBe('0 1px solid');
	});
});

/**
 * @param {string} value
 * @param {Record<string, string[]>} customPropertyValues
 */
function run(value, customPropertyValues) {
	return substituteVarFunctions(value, new Map(Object.entries(customPropertyValues))).map(
		({ substitutions }) => substitutions,
	);
}

/**
 * @param {number} count
 * @returns {string[]}
 */
function lengths(count) {
	return Array.from({ length: count }, (_, index) => `${index}px`);
}
