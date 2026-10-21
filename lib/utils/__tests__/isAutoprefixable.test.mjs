import { describe, it } from 'node:test';

import isAutoprefixable from '../isAutoprefixable.mjs';

describe('isAutoprefixable.atRuleName()', () => {
	it('returns true', (t) => {
		t.assert.strictEqual(isAutoprefixable.atRuleName('-moz-keyframes'), true);
		t.assert.strictEqual(isAutoprefixable.atRuleName('-ms-viewport'), true);
		t.assert.strictEqual(isAutoprefixable.atRuleName('-moz-document'), true);
	});

	it('returns false', (t) => {
		t.assert.strictEqual(isAutoprefixable.atRuleName('keyframes'), false);
		t.assert.strictEqual(isAutoprefixable.atRuleName('viewport'), false);
	});
});

describe('isAutoprefixable.selector()', () => {
	it('returns true', (t) => {
		t.assert.strictEqual(isAutoprefixable.selector(':-moz-any-link'), true);
		t.assert.strictEqual(isAutoprefixable.selector('::-webkit-backdrop'), true);
		t.assert.strictEqual(isAutoprefixable.selector(':-ms-input-placeholder'), true);
		t.assert.strictEqual(isAutoprefixable.selector('::-webkit-input-placeholder'), true);
	});

	it('returns false', (t) => {
		t.assert.strictEqual(isAutoprefixable.selector('::placeholder'), false);
		t.assert.strictEqual(isAutoprefixable.selector(':any-link'), false);
	});
});

describe('isAutoprefixable.property()', () => {
	it('returns true', (t) => {
		t.assert.strictEqual(isAutoprefixable.property('-webkit-transition'), true);
	});

	it('returns false', (t) => {
		t.assert.strictEqual(isAutoprefixable.property('transition'), false);
		t.assert.strictEqual(isAutoprefixable.property('-webkit-touch-callout'), false);
		t.assert.strictEqual(isAutoprefixable.property('-ms-interpolation-mode'), false);
	});
});

describe('isAutoprefixable.propertyValue()', () => {
	it('returns true', (t) => {
		t.assert.strictEqual(isAutoprefixable.propertyValue('-webkit-max-content'), true);
	});

	it('returns false', (t) => {
		t.assert.strictEqual(isAutoprefixable.propertyValue('max-content'), false);
	});
});
