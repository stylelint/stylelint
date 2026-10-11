import postcss from 'postcss';

import getDeclaredCustomPropertyNames from '../getDeclaredCustomPropertyNames.mjs';

describe('getDeclaredCustomPropertyNames', () => {
	it('returns the names of declared custom properties', () => {
		expect(run('a { --foo: 1px; --bar: red; color: red; }')).toEqual(new Set(['--foo', '--bar']));
	});

	it('returns the names registered with @property', () => {
		expect(run('@property --foo, --bar { syntax: "*"; inherits: false; }')).toEqual(
			new Set(['--foo', '--bar']),
		);
	});

	it('ignores the case of the at-rule name', () => {
		expect(run('@PROPERTY --foo { syntax: "*"; inherits: false; }')).toEqual(new Set(['--foo']));
	});
});

/**
 * @param {string} source
 */
function run(source) {
	return getDeclaredCustomPropertyNames(postcss.parse(source));
}
