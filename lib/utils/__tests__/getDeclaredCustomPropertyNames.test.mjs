import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import postcss from 'postcss';

import getDeclaredCustomPropertyNames from '../getDeclaredCustomPropertyNames.mjs';

describe('getDeclaredCustomPropertyNames', () => {
	it('returns the names of declared custom properties', () => {
		assert.deepEqual(run('a { --foo: 1px; --bar: red; color: red; }'), new Set(['--foo', '--bar']));
	});

	it('returns the names registered with @property', () => {
		assert.deepEqual(
			run('@property --foo, --bar { syntax: "*"; inherits: false; }'),
			new Set(['--foo', '--bar']),
		);
	});

	it('ignores the case of the at-rule name', () => {
		assert.deepEqual(run('@PROPERTY --foo { syntax: "*"; inherits: false; }'), new Set(['--foo']));
	});
});

/**
 * @param {string} source
 */
function run(source) {
	return getDeclaredCustomPropertyNames(postcss.parse(source));
}
