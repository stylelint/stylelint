import { describe, it } from 'node:test';

import postcss from 'postcss';

import getCustomPropertyNames from '../getCustomPropertyNames.mjs';

describe('getCustomPropertyNames', () => {
	it('returns the name of a custom property', (t) => {
		t.assert.deepStrictEqual(run('@property --foo {}'), ['--foo']);
	});

	it('returns each name of a list of custom properties', (t) => {
		t.assert.deepStrictEqual(run('@property --foo, --bar,--baz {}'), ['--foo', '--bar', '--baz']);
	});

	it('omits names that are not custom properties', (t) => {
		t.assert.deepStrictEqual(run('@property foo, --bar {}'), ['--bar']);
	});

	it('returns no names for an empty prelude', (t) => {
		t.assert.deepStrictEqual(run('@property {}'), []);
	});
});

/**
 * @param {string} source
 */
function run(source) {
	return getCustomPropertyNames(postcss.parse(source).first);
}
