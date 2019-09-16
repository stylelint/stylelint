'use strict';

const isStandardSyntaxFunction = require('../isStandardSyntaxFunction');
const postcss = require('postcss');
const valueParser = require('postcss-value-parser');

describe('isStandardSyntaxFunction', () => {
	it('calc', () => {
		funcs('a { prop: calc(a + b) }', (func) => {
			expect(isStandardSyntaxFunction(func)).toBeTruthy();
		});
	});

	it('url', () => {
		funcs("a { prop: url('x.css') }", (func) => {
			expect(isStandardSyntaxFunction(func)).toBeTruthy();
		});
	});

	it('scss list', () => {
		funcs('a { $list: (list) }', (func) => {
			expect(isStandardSyntaxFunction(func)).toBeFalsy();
		});
	});

	it('scss map', () => {
		funcs('a { $map: (key: value) }', (func) => {
			expect(isStandardSyntaxFunction(func)).toBeFalsy();
		});
	});
});

function funcs(css, cb) {
	postcss.parse(css).walkDecls((decl) => {
		valueParser(decl.value).walk((valueNode) => {
			if (valueNode.type !== 'function') {
				return;
			}

			cb(valueNode);
		});
	});
}
