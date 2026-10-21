import { describe, it } from 'node:test';

import postcss from 'postcss';

import getCustomPropertyValues from '../getCustomPropertyValues.mjs';

describe('getCustomPropertyValues', () => {
	it('collects the values of each custom property, in source order', (t) => {
		t.assert.deepStrictEqual(
			run('a { --foo: red; --bar: 1px; } b { --foo: blue; }'),
			new Map([
				['--foo', ['red', 'blue']],
				['--bar', ['1px']],
			]),
		);
	});

	it('collects the initial value of a custom property defined using @property with its declarations', (t) => {
		t.assert.deepStrictEqual(
			run(
				'@property --foo { syntax: "<color>"; inherits: false; initial-value: red; } a { --foo: blue; }',
			),
			new Map([['--foo', ['red', 'blue']]]),
		);
	});

	it('collects the initial value of each custom property in a list defined using @property', (t) => {
		t.assert.deepStrictEqual(
			run('@property --foo, --bar { initial-value: red; }'),
			new Map([
				['--foo', ['red']],
				['--bar', ['red']],
			]),
		);
	});

	it('matches @property and initial-value case-insensitively', (t) => {
		t.assert.deepStrictEqual(
			run('@PROPERTY --foo { INITIAL-VALUE: red; }'),
			new Map([['--foo', ['red']]]),
		);
	});

	it('collects the values across roots, in the order the roots are given', (t) => {
		t.assert.deepStrictEqual(
			run('a { --foo: red; }', 'a { --foo: blue; }'),
			new Map([['--foo', ['red', 'blue']]]),
		);
	});
});

/**
 * @param {...string} sources
 */
function run(...sources) {
	return getCustomPropertyValues(sources.map((source) => postcss.parse(source)));
}
