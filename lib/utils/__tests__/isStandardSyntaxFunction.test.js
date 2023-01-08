'use strict';

const isStandardSyntaxFunction = require('../isStandardSyntaxFunction');
const postcss = require('postcss');
const valueParser = require('postcss-value-parser');

describe('isStandardSyntaxFunction', () => {
	it('calc', () => {
		expect(isStandardSyntaxFunction(func('a { prop: calc(a + b) }'))).toBe(true);
	});

	it('url', () => {
		expect(isStandardSyntaxFunction(func("a { prop: url('x.css') }"))).toBe(true);
	});

	it('scss list', () => {
		expect(isStandardSyntaxFunction(func('a { $list: (list) }'))).toBe(false);
	});

	it('scss map', () => {
		expect(isStandardSyntaxFunction(func('a { $map: (key: value) }'))).toBe(false);
	});

	it('scss function in custom prop', () => {
		expect(isStandardSyntaxFunction(func('a { --primary-color: #{darken(#fff, 0.2)} }'))).toBe(
			false,
		);
	});

	it('CSS-in-JS interpolation', () => {
		const functions = [];

		valueParser('${({ size }) => (size === "small") ? "0.8em" : "1em"}').walk((valueNode) => {
			if (valueNode.type === 'function') {
				functions.push(valueNode);
			}
		});

		expect(isStandardSyntaxFunction(functions[0])).toBe(false);
	});

	it('CSS-in-JS syntax', () => {
		const functions = [];

		valueParser('`calc(${token.radiusBase} + 2px)`').walk((valueNode) => {
			if (valueNode.type === 'function') {
				functions.push(valueNode);
			}
		});

		expect(isStandardSyntaxFunction(functions[0])).toBe(false);
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
