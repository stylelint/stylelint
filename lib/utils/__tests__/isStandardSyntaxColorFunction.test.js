'use strict';

const isStandardSyntaxColorFunction = require('../isStandardSyntaxColorFunction');
const postcss = require('postcss');
const valueParser = require('postcss-value-parser');

describe('isStandardSyntaxFunction', () => {
	it('legacy syntax', () => {
		expect(isStandardSyntaxColorFunction(func('a { color: rgb(0, 0, 0) }'))).toBe(true);
	});

	it('legacy syntax alpha', () => {
		expect(isStandardSyntaxColorFunction(func('a { color: rgba(0, 0, 0, 0) }'))).toBe(true);
	});

	it('modern syntax', () => {
		expect(isStandardSyntaxColorFunction(func('a { color: rgba(0 0 0) }'))).toBe(true);
	});

	it('modern syntax alpha', () => {
		expect(isStandardSyntaxColorFunction(func('a { color: rgba(0 0 0 / 50%) }'))).toBe(true);
	});

	it('space', () => {
		expect(isStandardSyntaxColorFunction(func('a { color: rgba( 0 0 0 / 50% ) }'))).toBe(true);
	});

	it('comment', () => {
		expect(isStandardSyntaxColorFunction(func('a { color: rgba(/* #aaa */ 0 0 0 / 50%) }'))).toBe(
			true,
		);
	});

	it('custom property', () => {
		expect(isStandardSyntaxColorFunction(func('a { color: rgba(--red 0 0 / 50%) }'))).toBe(true);
	});

	it('function', () => {
		expect(
			isStandardSyntaxColorFunction(func('a { color: rgba(calc(--red + 50) 0 0 / 50%) }')),
		).toBe(true);
	});

	it('scss color function conversion', () => {
		expect(isStandardSyntaxColorFunction(func('a { color: rbga(#aaa, 0.5) }'))).toBe(false);
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
