import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import postcss from 'postcss';

import getCustomPropertyNames from '../getCustomPropertyNames.mjs';

describe('getCustomPropertyNames', () => {
	it('returns the name of a custom property', () => {
		assert.deepEqual(run('@property --foo {}'), ['--foo']);
	});

	it('returns each name of a list of custom properties', () => {
		assert.deepEqual(run('@property --foo, --bar,--baz {}'), ['--foo', '--bar', '--baz']);
	});

	it('omits names that are not custom properties', () => {
		assert.deepEqual(run('@property foo, --bar {}'), ['--bar']);
	});

	it('returns no names for an empty prelude', () => {
		assert.deepEqual(run('@property {}'), []);
	});
});

/**
 * @param {string} source
 */
function run(source) {
	return getCustomPropertyNames(postcss.parse(source).first);
}
