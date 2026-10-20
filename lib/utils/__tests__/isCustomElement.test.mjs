import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isCustomElement from '../isCustomElement.mjs';

describe('isCustomElement', () => {
	it('custom element', () => {
		assert.ok(isCustomElement('x-foo'));
		assert.ok(isCustomElement('math-α'));
		assert.ok(isCustomElement('emotion-😍'));

		assert.ok(!isCustomElement('X-foo'));
		assert.ok(!isCustomElement('x-Foo'));
		assert.ok(!isCustomElement('X-FOO'));

		assert.ok(!isCustomElement('.foo'));
		assert.ok(!isCustomElement('.foo-bar'));
		assert.ok(!isCustomElement('#foo'));
		assert.ok(!isCustomElement('#foo-bar'));
		assert.ok(!isCustomElement(':foo'));
		assert.ok(!isCustomElement(':foo-bar'));
		assert.ok(!isCustomElement('::foo'));
		assert.ok(!isCustomElement('::foo-bar'));
	});

	// Html tags
	it('html tags', () => {
		assert.ok(!isCustomElement('div'));
		assert.ok(!isCustomElement('dIv'));
		assert.ok(!isCustomElement('DiV'));
		assert.ok(!isCustomElement('DIV'));
		assert.ok(!isCustomElement('foo'));
		assert.ok(!isCustomElement('acronym'));
	});

	// Svg tags
	it('Svg tags', () => {
		assert.ok(!isCustomElement('font-face'));
		assert.ok(!isCustomElement('clipPath'));
	});

	// Mathml tags
	it('Mathml tags', () => {
		assert.ok(!isCustomElement('abs'));
		assert.ok(!isCustomElement('annotation-xml'));
	});

	// keywords tags
	it('keywords tags', () => {
		assert.ok(!isCustomElement('acronym'));
		assert.ok(!isCustomElement('applet'));
	});
});
