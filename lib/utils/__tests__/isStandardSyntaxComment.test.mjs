import { describe, test } from 'node:test';

import isStandardSyntaxComment from '../isStandardSyntaxComment.mjs';

import postcss from 'postcss';
import postcssLess from 'postcss-less';
import postcssSass from 'postcss-sass';
import postcssScss from 'postcss-scss';

describe('isStandardSyntaxComment', () => {
	test('standard single-line comment', (t) => {
		t.assert.strictEqual(isStandardSyntaxComment(css('/* foo */')), true);
	});

	test('standard multi-line comment', (t) => {
		t.assert.strictEqual(isStandardSyntaxComment(css('/*\n foo \n*/')), true);
	});

	test('LESS inline comment', (t) => {
		t.assert.strictEqual(isStandardSyntaxComment(less('// foo')), false);
	});

	test('Sass inline comment', (t) => {
		t.assert.strictEqual(isStandardSyntaxComment(sass('// foo')), false);
	});

	test('SCSS inline comment', (t) => {
		t.assert.strictEqual(isStandardSyntaxComment(scss('// foo')), false);
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
