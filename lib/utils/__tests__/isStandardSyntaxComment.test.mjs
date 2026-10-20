import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import isStandardSyntaxComment from '../isStandardSyntaxComment.mjs';

import postcss from 'postcss';
import postcssLess from 'postcss-less';
import postcssSass from 'postcss-sass';
import postcssScss from 'postcss-scss';

describe('isStandardSyntaxComment', () => {
	test('standard single-line comment', () => {
		assert.equal(isStandardSyntaxComment(css('/* foo */')), true);
	});

	test('standard multi-line comment', () => {
		assert.equal(isStandardSyntaxComment(css('/*\n foo \n*/')), true);
	});

	test('LESS inline comment', () => {
		assert.equal(isStandardSyntaxComment(less('// foo')), false);
	});

	test('Sass inline comment', () => {
		assert.equal(isStandardSyntaxComment(sass('// foo')), false);
	});

	test('SCSS inline comment', () => {
		assert.equal(isStandardSyntaxComment(scss('// foo')), false);
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
