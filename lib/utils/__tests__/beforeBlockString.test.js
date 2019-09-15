'use strict';

const beforeBlockString = require('../beforeBlockString');
const postcss = require('postcss');
const sugarss = require('sugarss');

describe('beforeBlockString', () => {
	let css;
	let res;

	beforeEach(() => {
		css = '';
		res = '';
	});

	it('runs on rules', () => {
		expect(postcssCheck('a {}')).toBe('a ');
		expect(postcssCheck('\na\n{}')).toBe('\na\n');
		css = '\n\na,\nb,\n\tspan > .foo\n{}';
		res = '\n\na,\nb,\n\tspan > .foo\n';
		expect(postcssCheck(css)).toBe(res);
	});

	it('runs on at-rules', () => {
		expect(postcssCheck('@media print {}')).toBe('@media print ');

		css = '\n@media print, screen\n\t{}';
		res = '\n@media print, screen\n\t';
		expect(postcssCheck(css)).toBe(res);

		css = '@supports (animation-name: test) {}';
		res = '@supports (animation-name: test) ';
		expect(postcssCheck(css)).toBe(res);

		css =
			'@document url(http://www.w3.org/),\n ' +
			'url-prefix(http://www.w3.org/Style/),\n' +
			'domain(mozilla.org),\n' +
			'regexp("https:.*") {}';
		res =
			'@document url(http://www.w3.org/),\n ' +
			'url-prefix(http://www.w3.org/Style/),\n' +
			'domain(mozilla.org),\n' +
			'regexp("https:.*") ';
		expect(postcssCheck(css)).toBe(res);
	});

	it('runs with noRawBefore', () => {
		expect(postcssCheck({ noRawBefore: true }, '\na {}')).toBe('a ');

		css = '\n@media print {}';
		res = '@media print ';
		expect(postcssCheck({ noRawBefore: true }, css)).toBe(res);
	});

	it('runs with declaration directly at root', () => {
		expect(postcssCheck('foo: bar;')).toBe('');
	});

	it('runs with comment after selector', () => {
		expect(postcssCheck('a /* x */\n{}')).toBe('a /* x */\n');
	});

	it('runs without brackets using SugarSS parser', () => {
		expect(postcssCheck({ noRawBefore: true }, '.a', sugarss)).toBe('.a');
	});
});

function postcssCheck(options, cssString, parser) {
	if (typeof options === 'undefined') {
		options = {};
	}

	if (typeof parser === 'undefined') {
		parser = postcss;
	}

	if (typeof options === 'string') {
		cssString = options;
	}

	const root = parser.parse(cssString);

	return beforeBlockString(root.first, options);
}
