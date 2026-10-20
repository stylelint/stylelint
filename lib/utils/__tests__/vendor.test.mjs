import assert from 'node:assert/strict';
import { it } from 'node:test';

import vendor from '../vendor.mjs';

const VALUE = '-1px -1px 1px rgba(0, 0, 0, 0.2) inset';

it('returns prefix', () => {
	assert.equal(vendor.prefix('-moz-color'), '-moz-');
	assert.equal(vendor.prefix('color'), '');
	assert.equal(vendor.prefix(VALUE), '');
});

it('returns unprefixed version', () => {
	assert.equal(vendor.unprefixed('-moz-color'), 'color');
	assert.equal(vendor.unprefixed('color'), 'color');
	assert.equal(vendor.unprefixed(VALUE), VALUE);
});
