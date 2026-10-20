import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isAutoprefixable from '../isAutoprefixable.mjs';

describe('isAutoprefixable.atRuleName()', () => {
	it('returns true', () => {
		assert.equal(isAutoprefixable.atRuleName('-moz-keyframes'), true);
		assert.equal(isAutoprefixable.atRuleName('-ms-viewport'), true);
		assert.equal(isAutoprefixable.atRuleName('-moz-document'), true);
	});

	it('returns false', () => {
		assert.equal(isAutoprefixable.atRuleName('keyframes'), false);
		assert.equal(isAutoprefixable.atRuleName('viewport'), false);
	});
});

describe('isAutoprefixable.selector()', () => {
	it('returns true', () => {
		assert.equal(isAutoprefixable.selector(':-moz-any-link'), true);
		assert.equal(isAutoprefixable.selector('::-webkit-backdrop'), true);
		assert.equal(isAutoprefixable.selector(':-ms-input-placeholder'), true);
		assert.equal(isAutoprefixable.selector('::-webkit-input-placeholder'), true);
	});

	it('returns false', () => {
		assert.equal(isAutoprefixable.selector('::placeholder'), false);
		assert.equal(isAutoprefixable.selector(':any-link'), false);
	});
});

describe('isAutoprefixable.property()', () => {
	it('returns true', () => {
		assert.equal(isAutoprefixable.property('-webkit-transition'), true);
	});

	it('returns false', () => {
		assert.equal(isAutoprefixable.property('transition'), false);
		assert.equal(isAutoprefixable.property('-webkit-touch-callout'), false);
		assert.equal(isAutoprefixable.property('-ms-interpolation-mode'), false);
	});
});

describe('isAutoprefixable.propertyValue()', () => {
	it('returns true', () => {
		assert.equal(isAutoprefixable.propertyValue('-webkit-max-content'), true);
	});

	it('returns false', () => {
		assert.equal(isAutoprefixable.propertyValue('max-content'), false);
	});
});
