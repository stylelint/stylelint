'use strict';

const vendor = require('../vendor');

const VALUE = '-1px -1px 1px rgba(0, 0, 0, 0.2) inset';

it('returns prefix', () => {
	expect(vendor.prefix('-moz-color')).toBe('-moz-');
	expect(vendor.prefix('color')).toBe('');
	expect(vendor.prefix(VALUE)).toBe('');
});

it('returns unprefixed version', () => {
	expect(vendor.unprefixed('-moz-color')).toBe('color');
	expect(vendor.unprefixed('color')).toBe('color');
	expect(vendor.unprefixed(VALUE)).toBe(VALUE);
});
