'use strict';

const isAutoprefixable = require('../isAutoprefixable');

describe('isAutoprefixable.atRuleName()', () => {
	it('returns true', () => {
		expect(isAutoprefixable.atRuleName('-moz-keyframes')).toBe(true);
		expect(isAutoprefixable.atRuleName('-ms-viewport')).toBe(true);
		expect(isAutoprefixable.atRuleName('resolution')).toBe(true);
	});

	it('returns false', () => {
		expect(isAutoprefixable.atRuleName('keyframes')).toBe(false);
		expect(isAutoprefixable.atRuleName('viewport')).toBe(false);
	});
});

describe('isAutoprefixable.selector()', () => {
	it('returns true', () => {
		expect(isAutoprefixable.selector(':-moz-any-link')).toBe(true);
		expect(isAutoprefixable.selector('::-webkit-backdrop')).toBe(true);
		expect(isAutoprefixable.selector(':-ms-input-placeholder')).toBe(true);
		expect(isAutoprefixable.selector('::-webkit-input-placeholder')).toBe(true);
	});

	it('returns false', () => {
		expect(isAutoprefixable.selector('::placeholder')).toBe(false);
		expect(isAutoprefixable.selector(':any-link')).toBe(false);
	});
});

describe('isAutoprefixable.property()', () => {
	it('returns true', () => {
		expect(isAutoprefixable.property('-webkit-transition')).toBe(true);
		expect(isAutoprefixable.property('-ms-interpolation-mode')).toBe(true);
	});

	it('returns false', () => {
		expect(isAutoprefixable.property('transition')).toBe(false);
		expect(isAutoprefixable.property('-webkit-touch-callout')).toBe(false);
	});
});

describe('isAutoprefixable.propertyValue()', () => {
	it('returns true', () => {
		expect(isAutoprefixable.propertyValue('-webkit-max-content')).toBe(true);
	});

	it('returns false', () => {
		expect(isAutoprefixable.propertyValue('max-content')).toBe(false);
	});
});
