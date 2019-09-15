'use strict';

const isCustomElement = require('../isCustomElement');

describe('isCustomElement', () => {
	it('custom element', () => {
		expect(isCustomElement('x-foo')).toBeTruthy();
		expect(isCustomElement('math-α')).toBeTruthy();
		expect(isCustomElement('emotion-😍')).toBeTruthy();

		expect(isCustomElement('X-foo')).toBeFalsy();
		expect(isCustomElement('x-Foo')).toBeFalsy();
		expect(isCustomElement('X-FOO')).toBeFalsy();

		expect(isCustomElement('.foo')).toBeFalsy();
		expect(isCustomElement('.foo-bar')).toBeFalsy();
		expect(isCustomElement('#foo')).toBeFalsy();
		expect(isCustomElement('#foo-bar')).toBeFalsy();
		expect(isCustomElement(':foo')).toBeFalsy();
		expect(isCustomElement(':foo-bar')).toBeFalsy();
		expect(isCustomElement('::foo')).toBeFalsy();
		expect(isCustomElement('::foo-bar')).toBeFalsy();
	});

	// Html tags
	it('html tags', () => {
		expect(isCustomElement('div')).toBeFalsy();
		expect(isCustomElement('dIv')).toBeFalsy();
		expect(isCustomElement('DiV')).toBeFalsy();
		expect(isCustomElement('DIV')).toBeFalsy();
		expect(isCustomElement('foo')).toBeFalsy();
		expect(isCustomElement('acronym')).toBeFalsy();
	});

	// Svg tags
	it('Svg tags', () => {
		expect(isCustomElement('font-face')).toBeFalsy();
		expect(isCustomElement('clipPath')).toBeFalsy();
	});

	// Mathml tags
	it('Mathml tags', () => {
		expect(isCustomElement('abs')).toBeFalsy();
		expect(isCustomElement('annotation-xml')).toBeFalsy();
	});

	// keywordSets tags
	it('keywordSets tags', () => {
		expect(isCustomElement('acronym')).toBeFalsy();
		expect(isCustomElement('applet')).toBeFalsy();
	});
});
