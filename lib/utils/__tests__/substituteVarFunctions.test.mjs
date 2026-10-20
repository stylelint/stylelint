import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import substituteVarFunctions, { getSubstitutedValue } from '../substituteVarFunctions.mjs';
import assertItemsPartialDeepStrictEqual from '../../testUtils/assertItemsPartialDeepStrictEqual.mjs';

/** @import { VarFunctionSubstitution } from '../substituteVarFunctions.mjs' */

describe('substituteVarFunctions', () => {
	it('substitutes each var() with a value of its custom property', () => {
		assertItemsPartialDeepStrictEqual(
			run('var(--foo) solid var(--bar)', {
				'--foo': ['1px'],
				'--bar': ['red'],
			}),
			[
				[
					{ start: 0, end: 10, name: '--foo', value: '1px' },
					{ start: 17, end: 27, name: '--bar', value: 'red' },
				],
			],
		);
	});

	it('substitutes every combination of values, in the order they are given', () => {
		const substitutedValues = run('var(--foo) var(--bar)', {
			'--foo': ['1px', '2px'],
			'--bar': ['red', 'blue'],
		});

		assert.deepEqual(
			substitutedValues.map((substitutions) => substitutions.map(({ value }) => value)),
			[
				['1px', 'red'],
				['1px', 'blue'],
				['2px', 'red'],
				['2px', 'blue'],
			],
		);
	});

	it('substitutes each distinct value of a custom property once', () => {
		assertItemsPartialDeepStrictEqual(run('var(--foo)', { '--foo': ['red', 'red'] }), [
			[{ value: 'red' }],
		]);
	});

	it('substitutes var()s within the values of custom properties', () => {
		assertItemsPartialDeepStrictEqual(
			run('var(--foo)', { '--foo': ['1px var(--bar)'], '--bar': ['red'] }),
			[[{ start: 0, end: 10, value: '1px red' }]],
		);
	});

	it('substitutes var()s within functions', () => {
		assertItemsPartialDeepStrictEqual(run('rgb(var(--foo) 0 0)', { '--foo': ['0'] }), [
			[{ start: 4, end: 14, value: '0' }],
		]);
	});

	it('ignores the fallback of a known custom property', () => {
		assertItemsPartialDeepStrictEqual(run('var(--foo, var(--bar))', { '--foo': ['red'] }), [
			[{ start: 0, end: 22, value: 'red' }],
		]);
	});

	it('matches var() case-insensitively', () => {
		assertItemsPartialDeepStrictEqual(run('VAR(--foo)', { '--foo': ['red'] }), [
			[{ start: 0, end: 10, value: 'red' }],
		]);
	});

	it('substitutes a var() whose custom property follows a comment', () => {
		assertItemsPartialDeepStrictEqual(run('var(/* qux */ --foo)', { '--foo': ['red'] }), [
			[{ start: 0, end: 20, value: 'red' }],
		]);
	});

	it('substituted tokens take the source indices of the var(), padded with whitespace', () => {
		const [substitutedValue] = substituteVarFunctions(
			'1px var(--foo)',
			new Map([['--foo', ['solid red']]]),
		);

		assert.deepEqual(
			substitutedValue?.tokens.map(([, representation, start, end]) => [
				representation,
				start,
				end,
			]),
			[
				['1px', 0, 2],
				[' ', 3, 3],
				[' ', 4, 13],
				['solid', 4, 13],
				[' ', 4, 13],
				['red', 4, 13],
				[' ', 4, 13],
			],
		);
	});

	it('substitutes nothing when there are no var()s', () => {
		assert.deepEqual(run('red', {}), [[]]);
	});

	it('substitutes nothing for an unknown custom property', () => {
		assert.deepEqual(run('var(--foo)', {}), []);
	});

	it('substitutes nothing for a custom property without values', () => {
		assert.deepEqual(run('var(--foo)', { '--foo': [] }), []);
	});

	it('substitutes nothing for a custom property that references itself', () => {
		assert.deepEqual(run('var(--foo)', { '--foo': ['var(--foo)'] }), []);
	});

	it('substitutes nothing for the custom properties in a cycle and those that reach it', () => {
		const customPropertyValues = new Map([
			['--foo', ['var(--bar)']],
			['--bar', ['var(--foo)']],
			['--baz', ['var(--bar)']],
		]);

		assert.deepEqual(substituteVarFunctions('var(--foo)', customPropertyValues), []);
		assert.deepEqual(substituteVarFunctions('var(--bar)', customPropertyValues), []);
		assert.deepEqual(substituteVarFunctions('var(--baz)', customPropertyValues), []);
	});

	it('substitutes nothing for a custom property with a CSS-wide keyword', () => {
		assert.deepEqual(run('var(--foo)', { '--foo': ['red', 'INHERIT'] }), []);
	});

	it('substitutes nothing for a var() without a custom property', () => {
		assert.deepEqual(run('var(foo)', { foo: ['red'] }), []);
		assert.deepEqual(run('var()', {}), []);
	});

	it('substitutes nothing when any value of the custom property cannot be substituted', () => {
		assert.deepEqual(run('var(--foo)', { '--foo': ['red', 'var(--bar)'] }), []);
	});

	it('substitutes nothing when there would be more than 1000 combinations of values', () => {
		assert.equal(
			run('var(--foo) var(--bar)', { '--foo': lengths(10), '--bar': lengths(100) }).length,
			1000,
		);
		assert.deepEqual(
			run('var(--foo) var(--bar)', { '--foo': lengths(11), '--bar': lengths(100) }),
			[],
		);
		assert.deepEqual(run('var(--bar)', { '--foo': lengths(1001), '--bar': ['var(--foo)'] }), []);
	});
});

describe('getSubstitutedValue', () => {
	/** @type {VarFunctionSubstitution[]} */
	const substitutions = [
		{ start: 4, end: 14, name: '--foo', value: '1px', tokens: [] },
		{ start: 21, end: 31, name: '--bar', value: 'red', tokens: [] },
	];

	it('gets the value with its var()s substituted', () => {
		assert.equal(
			getSubstitutedValue('0 0 var(--foo) solid var(--bar)', substitutions),
			'0 0 1px solid red',
		);
	});

	it('gets a range of the value with its var()s substituted', () => {
		assert.equal(
			getSubstitutedValue('0 0 var(--foo) solid var(--bar)', substitutions.slice(0, 1), 2, 20),
			'0 1px solid',
		);
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
