import postcss from 'postcss';

import getCustomPropertyNames from '../getCustomPropertyNames.mjs';

describe('getCustomPropertyNames', () => {
	it('returns the name of a custom property', () => {
		expect(run('@property --foo {}')).toEqual(['--foo']);
	});

	it('returns each name of a list of custom properties', () => {
		expect(run('@property --foo, --bar,--baz {}')).toEqual(['--foo', '--bar', '--baz']);
	});

	it('omits names that are not custom properties', () => {
		expect(run('@property foo, --bar {}')).toEqual(['--bar']);
	});

	it('returns no names for an empty prelude', () => {
		expect(run('@property {}')).toEqual([]);
	});
});

/**
 * @param {string} source
 */
function run(source) {
	return getCustomPropertyNames(postcss.parse(source).first);
}
