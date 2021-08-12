'use strict';

const isStandardSyntaxComment = require('../isStandardSyntaxComment');

const postcss = require('postcss');
const postcssLess = require('postcss-less');
const postcssScss = require('postcss-scss');

describe('isStandardSyntaxComment', () => {
	test('standard single-line comment', () => {
		expect(isStandardSyntaxComment(css('/* foo */'))).toBe(true);
	});

	test('standard multi-line comment', () => {
		expect(isStandardSyntaxComment(css('/*\n foo \n*/'))).toBe(true);
	});

	test('LESS inline comment', () => {
		expect(isStandardSyntaxComment(less('// foo'))).toBe(false);
	});

	test('SCSS inline comment', () => {
		expect(isStandardSyntaxComment(scss('// foo'))).toBe(false);
	});
});

function css(code) {
	return postcss.parse(code).first;
}

function less(code) {
	return postcssLess.parse(code).first;
}

function scss(code) {
	return postcssScss.parse(code).first;
}
