import { describe, it } from 'node:test';

import postcss from 'postcss';

import getDeclaredCustomPropertyNames from '../getDeclaredCustomPropertyNames.mjs';

describe('getDeclaredCustomPropertyNames', () => {
	it('returns the names of declared custom properties', (t) => {
		t.assert.deepStrictEqual(
			run('a { --foo: 1px; --bar: red; color: red; }'),
			new Set(['--foo', '--bar']),
		);
	});

	it('returns the names registered with @property', (t) => {
		t.assert.deepStrictEqual(
			run('@property --foo, --bar { syntax: "*"; inherits: false; }'),
			new Set(['--foo', '--bar']),
		);
	});

	it('ignores the case of the at-rule name', (t) => {
		t.assert.deepStrictEqual(
			run('@PROPERTY --foo { syntax: "*"; inherits: false; }'),
			new Set(['--foo']),
		);
	});
});

/**
 * @param {string} source
 */
function run(source) {
	return getDeclaredCustomPropertyNames(postcss.parse(source));
}
