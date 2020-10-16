'use strict';

const declarationValueIndex = require('../declarationValueIndex');
const postcss = require('postcss');

describe('declarationValueIndex', () => {
	it('has a space before the value', () => {
		expect(declarationValueIndex(decl('a { a: b}'))).toBe(3);
	});

	it('has a colon before the value', () => {
		expect(declarationValueIndex(decl('a { a :b }'))).toBe(3);
	});

	it('has no spaces before the value', () => {
		expect(declarationValueIndex(decl('a { a:b }'))).toBe(2);
	});

	it('has multiple characters before the value', () => {
		expect(declarationValueIndex(decl('a { a  : b }'))).toBe(5);
	});

	it('has a newline before the value', () => {
		expect(declarationValueIndex(decl('a { a:\nb }'))).toBe(3);
	});
});

function decl(css) {
	const list = [];

	// TODO: Issue #4985
	// eslint-disable-next-line no-shadow
	postcss.parse(css).walkDecls((decl) => list.push(decl));

	return list[0];
}
