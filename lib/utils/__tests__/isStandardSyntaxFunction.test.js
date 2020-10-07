'use strict';

const isStandardSyntaxFunction = require('../isStandardSyntaxFunction');
const postcss = require('postcss');
const valueParser = require('postcss-value-parser');

describe('isStandardSyntaxFunction', () => {
	it('calc', () => {
		expect(isStandardSyntaxFunction(func('a { prop: calc(a + b) }'))).toBeTruthy();
	});

	it('url', () => {
		expect(isStandardSyntaxFunction(func("a { prop: url('x.css') }"))).toBeTruthy();
	});

	it('scss list', () => {
		expect(isStandardSyntaxFunction(func('a { $list: (list) }'))).toBeFalsy();
	});

	it('scss map', () => {
		expect(isStandardSyntaxFunction(func('a { $map: (key: value) }'))).toBeFalsy();
	});
});

function func(css) {
	const functions = [];

	postcss.parse(css).walkDecls((decl) => {
		valueParser(decl.value).walk((valueNode) => {
			if (valueNode.type === 'function') {
				functions.push(valueNode);
			}
		});
	});

	return functions[0];
}
