import { it } from 'node:test';

import vendor from '../vendor.mjs';

const VALUE = '-1px -1px 1px rgba(0, 0, 0, 0.2) inset';

it('returns prefix', (t) => {
	t.assert.strictEqual(vendor.prefix('-moz-color'), '-moz-');
	t.assert.strictEqual(vendor.prefix('color'), '');
	t.assert.strictEqual(vendor.prefix(VALUE), '');
});

it('returns unprefixed version', (t) => {
	t.assert.strictEqual(vendor.unprefixed('-moz-color'), 'color');
	t.assert.strictEqual(vendor.unprefixed('color'), 'color');
	t.assert.strictEqual(vendor.unprefixed(VALUE), VALUE);
});
