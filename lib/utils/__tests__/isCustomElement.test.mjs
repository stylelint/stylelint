import { describe, it } from 'node:test';

import isCustomElement from '../isCustomElement.mjs';

describe('isCustomElement', () => {
	it('custom element', (t) => {
		t.assert.ok(isCustomElement('x-foo'));
		t.assert.ok(isCustomElement('math-α'));
		t.assert.ok(isCustomElement('emotion-😍'));

		t.assert.ok(!isCustomElement('X-foo'));
		t.assert.ok(!isCustomElement('x-Foo'));
		t.assert.ok(!isCustomElement('X-FOO'));

		t.assert.ok(!isCustomElement('.foo'));
		t.assert.ok(!isCustomElement('.foo-bar'));
		t.assert.ok(!isCustomElement('#foo'));
		t.assert.ok(!isCustomElement('#foo-bar'));
		t.assert.ok(!isCustomElement(':foo'));
		t.assert.ok(!isCustomElement(':foo-bar'));
		t.assert.ok(!isCustomElement('::foo'));
		t.assert.ok(!isCustomElement('::foo-bar'));
	});

	// Html tags
	it('html tags', (t) => {
		t.assert.ok(!isCustomElement('div'));
		t.assert.ok(!isCustomElement('dIv'));
		t.assert.ok(!isCustomElement('DiV'));
		t.assert.ok(!isCustomElement('DIV'));
		t.assert.ok(!isCustomElement('foo'));
		t.assert.ok(!isCustomElement('acronym'));
	});

	// Svg tags
	it('Svg tags', (t) => {
		t.assert.ok(!isCustomElement('font-face'));
		t.assert.ok(!isCustomElement('clipPath'));
	});

	// Mathml tags
	it('Mathml tags', (t) => {
		t.assert.ok(!isCustomElement('abs'));
		t.assert.ok(!isCustomElement('annotation-xml'));
	});

	// keywords tags
	it('keywords tags', (t) => {
		t.assert.ok(!isCustomElement('acronym'));
		t.assert.ok(!isCustomElement('applet'));
	});
});
