import { beforeEach, describe, it } from 'node:test';

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

	it('runs on rules', (t) => {
		t.assert.strictEqual(postcssCheck('a {}'), 'a ');
		t.assert.strictEqual(postcssCheck('\na\n{}'), '\na\n');

		css = '\n\na,\nb,\n\tspan > .foo\n{}';
		res = '\n\na,\nb,\n\tspan > .foo\n';
		t.assert.strictEqual(postcssCheck(css), res);

		css = 'a, b {}';
		res = 'a, b ';
		t.assert.strictEqual(postcssCheck(css), res);

		css = 'a /* comment */, b {}';
		res = 'a /* comment */, b ';
		t.assert.strictEqual(postcssCheck(css), res);
	});

	it('runs on at-rules', (t) => {
		t.assert.strictEqual(postcssCheck('@media print {}'), '@media print ');

		css = '\n@media print, screen\n\t{}';
		res = '\n@media print, screen\n\t';
		t.assert.strictEqual(postcssCheck(css), res);

		css = '\n@media print /* comment */, screen\n\t{}';
		res = '\n@media print /* comment */, screen\n\t';
		t.assert.strictEqual(postcssCheck(css), res);

		css = '@supports (animation-name: test) {}';
		res = '@supports (animation-name: test) ';
		t.assert.strictEqual(postcssCheck(css), res);

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
		t.assert.strictEqual(postcssCheck(css), res);
	});

	it('runs with noRawBefore', (t) => {
		t.assert.strictEqual(postcssCheck({ noRawBefore: true }, '\na {}'), 'a ');

		css = '\n@media print {}';
		res = '@media print ';
		t.assert.strictEqual(postcssCheck({ noRawBefore: true }, css), res);
	});

	it('runs with declaration directly at root', (t) => {
		t.assert.strictEqual(postcssCheck('foo: bar;'), '');
	});

	it('runs with comment after selector', (t) => {
		t.assert.strictEqual(postcssCheck('a /* x */\n{}'), 'a /* x */\n');
	});

	it('runs without brackets using SugarSS parser', (t) => {
		t.assert.strictEqual(postcssCheck({ noRawBefore: true }, '.a', sugarss), '.a');
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
