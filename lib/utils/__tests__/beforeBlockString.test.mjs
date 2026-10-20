import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';

import beforeBlockString from '../beforeBlockString.mjs';
import postcss from 'postcss';
import sugarss from 'sugarss';

describe('beforeBlockString', () => {
	let css;
	let res;

	beforeEach(() => {
		css = '';
		res = '';
	});

	it('runs on rules', () => {
		assert.equal(postcssCheck('a {}'), 'a ');
		assert.equal(postcssCheck('\na\n{}'), '\na\n');

		css = '\n\na,\nb,\n\tspan > .foo\n{}';
		res = '\n\na,\nb,\n\tspan > .foo\n';
		assert.equal(postcssCheck(css), res);

		css = 'a, b {}';
		res = 'a, b ';
		assert.equal(postcssCheck(css), res);

		css = 'a /* comment */, b {}';
		res = 'a /* comment */, b ';
		assert.equal(postcssCheck(css), res);
	});

	it('runs on at-rules', () => {
		assert.equal(postcssCheck('@media print {}'), '@media print ');

		css = '\n@media print, screen\n\t{}';
		res = '\n@media print, screen\n\t';
		assert.equal(postcssCheck(css), res);

		css = '\n@media print /* comment */, screen\n\t{}';
		res = '\n@media print /* comment */, screen\n\t';
		assert.equal(postcssCheck(css), res);

		css = '@supports (animation-name: test) {}';
		res = '@supports (animation-name: test) ';
		assert.equal(postcssCheck(css), res);

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
		assert.equal(postcssCheck(css), res);
	});

	it('runs with noRawBefore', () => {
		assert.equal(postcssCheck({ noRawBefore: true }, '\na {}'), 'a ');

		css = '\n@media print {}';
		res = '@media print ';
		assert.equal(postcssCheck({ noRawBefore: true }, css), res);
	});

	it('runs with declaration directly at root', () => {
		assert.equal(postcssCheck('foo: bar;'), '');
	});

	it('runs with comment after selector', () => {
		assert.equal(postcssCheck('a /* x */\n{}'), 'a /* x */\n');
	});

	it('runs without brackets using SugarSS parser', () => {
		assert.equal(postcssCheck({ noRawBefore: true }, '.a', sugarss), '.a');
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
