import isStandardSyntaxComment from '../isStandardSyntaxComment.js';

import postcss from 'postcss';
import postcssLess from 'postcss-less';
import postcssSass from 'postcss-sass';
import postcssScss from 'postcss-scss';

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

	test('Sass inline comment', () => {
		expect(isStandardSyntaxComment(sass('// foo'))).toBe(false);
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

function sass(code) {
	return postcssSass.parse(code).first;
}

function scss(code) {
	return postcssScss.parse(code).first;
}
