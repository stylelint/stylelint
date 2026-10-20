import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isStandardSyntaxDeclaration from '../isStandardSyntaxDeclaration.mjs';
import postcss from 'postcss';
import postcssLess from 'postcss-less';
import postcssSass from 'postcss-sass';
import postcssScss from 'postcss-scss';

describe('isStandardSyntaxDeclaration', () => {
	it('standard prop and value', () => {
		assert.equal(isStandardSyntaxDeclaration(decl('a { a: b }')), true);
	});

	it('standard prop and scss var', () => {
		assert.equal(isStandardSyntaxDeclaration(decl('a { a: $b }')), true);
	});

	it('custom-property', () => {
		assert.equal(isStandardSyntaxDeclaration(decl('a { --custom-property: x }')), true);
	});

	it('standard prop and calc value', () => {
		assert.equal(isStandardSyntaxDeclaration(decl('a { a : calc(b + c) }')), true);
	});

	it('does not break @selector', () => {
		assert.equal(isStandardSyntaxDeclaration(decl('@page { size: A4 }')), true);
	});

	it('property with sass variable interpolation (only)', () => {
		assert.equal(isStandardSyntaxDeclaration(sassDecl('a\n\t#{$var}: 10px')), true);
	});

	it('property with scss variable interpolation (only)', () => {
		assert.equal(isStandardSyntaxDeclaration(scssDecl('a { #{$var}: 10px; }')), true);
	});

	it('property with sass variable interpolation (end)', () => {
		assert.equal(isStandardSyntaxDeclaration(sassDecl('a\n\tprop#{$var}: 10px')), true);
	});

	it('property with scss variable interpolation (end)', () => {
		assert.equal(isStandardSyntaxDeclaration(scssDecl('a { prop#{$var}: 10px; }')), true);
	});

	it('property with sass variable interpolation (middle)', () => {
		assert.equal(isStandardSyntaxDeclaration(sassDecl('a\n\tprop#{$var}erty: 10px')), true);
	});

	it('property with scss variable interpolation (middle)', () => {
		assert.equal(isStandardSyntaxDeclaration(scssDecl('a { prop#{$var}erty: 10px; }')), true);
	});

	it('property with less variable interpolation (only)', () => {
		assert.equal(isStandardSyntaxDeclaration(lessDecl('a { @{var}: 10px; }')), true);
	});

	it('property with less variable interpolation (end)', () => {
		assert.equal(isStandardSyntaxDeclaration(lessDecl('a { prop@{var}: 10px; }')), true);
	});

	it('property with less variable interpolation (middle)', () => {
		assert.equal(isStandardSyntaxDeclaration(lessDecl('a { prop@{var}erty: 10px; }')), true);
	});

	it('sass var', () => {
		assert.equal(isStandardSyntaxDeclaration(sassDecl('$var: b')), false);
	});

	it('scss var', () => {
		assert.equal(isStandardSyntaxDeclaration(scssDecl('$var: b')), false);
	});

	it('scss var within namespace', () => {
		assert.equal(isStandardSyntaxDeclaration(scssDecl('namespace.$var: b')), false);
	});

	it('nested scss var within namespace', () => {
		assert.equal(isStandardSyntaxDeclaration(scssDecl('a { namespace.$var: b }')), false);
	});

	it('sass list', () => {
		assert.equal(isStandardSyntaxDeclaration(sassDecl('$list: (key: value, key2: value2)')), false);
	});

	it('scss list', () => {
		assert.equal(isStandardSyntaxDeclaration(scssDecl('$list: (key: value, key2: value2)')), false);
	});

	it('sass map', () => {
		assert.equal(isStandardSyntaxDeclaration(sassDecl('$map: (value, value2)')), false);
	});

	it('scss map', () => {
		assert.equal(isStandardSyntaxDeclaration(scssDecl('$map: (value, value2)')), false);
	});

	it('nested sass var', () => {
		assert.equal(isStandardSyntaxDeclaration(sassDecl('a\n\t$var: b')), false);
	});

	it('nested scss var', () => {
		assert.equal(isStandardSyntaxDeclaration(scssDecl('a { $var: b }')), false);
	});

	it('nested sass list', () => {
		assert.equal(
			isStandardSyntaxDeclaration(sassDecl('a\n\t$list: (key: value, key2: value2)')),
			false,
		);
	});

	it('nested scss list', () => {
		assert.equal(
			isStandardSyntaxDeclaration(scssDecl('a { $list: (key: value, key2: value2) }')),
			false,
		);
	});

	it('sass nested property', () => {
		assert.equal(isStandardSyntaxDeclaration(sassDecl('a\n\tborder:\n\t\tstyle: solid')), false);
	});

	it('scss nested property', () => {
		assert.equal(isStandardSyntaxDeclaration(scssDecl('a { border: { style: solid; } }')), false);
	});

	it('nested sass map', () => {
		assert.equal(isStandardSyntaxDeclaration(sassDecl('a\n\t$map: (value, value2)')), false);
	});

	it('nested scss map', () => {
		assert.equal(isStandardSyntaxDeclaration(scssDecl('a { $map: (value, value2) }')), false);
	});

	it('less &:extend', () => {
		assert.equal(isStandardSyntaxDeclaration(lessDecl('a { &:extend(b) }')), false);
	});

	it('less map', () => {
		assert.equal(isStandardSyntaxDeclaration(lessDecl('@map: { key: value; }')), false);
	});

	it('less another map', () => {
		assert.equal(isStandardSyntaxDeclaration(lessDecl('#my-map() { key: value; }')), false);
	});

	it('scss map declaration', () => {
		assert.equal(isStandardSyntaxDeclaration(scssDecl('$foo: (key: value, key2: value2)')), false);
	});

	it('scss map declaration with quotes', () => {
		assert.equal(
			isStandardSyntaxDeclaration(scssDecl('$foo: ("key": value, "key2": value2)')),
			false,
		);
	});

	it('scss list declaration', () => {
		assert.equal(isStandardSyntaxDeclaration(scssDecl('$foo: (value, value2)')), false);
	});

	it('scss pure value in parentheses', () => {
		assert.equal(isStandardSyntaxDeclaration(scssDecl('a { height: (0) }')), true);
	});

	it('scss complex value in parentheses', () => {
		assert.equal(
			isStandardSyntaxDeclaration(scssDecl('a { height: (3px + 5px) * (2px + 4px) }')),
			true,
		);
	});

	it('supports root-level declarations', () => {
		assert.equal(isStandardSyntaxDeclaration(decl('color: yellow;')), true);
	});
});

function decl(css, parser = postcss) {
	const list = [];

	parser.parse(css).walkDecls((d) => list.push(d));

	if (list.length === 1) {
		return list[0];
	}

	throw new Error(`Expected length 1, but ${list.length}`);
}

function sassDecl(css) {
	return decl(css, postcssSass);
}

function scssDecl(css) {
	return decl(css, postcssScss);
}

function lessDecl(css) {
	return decl(css, postcssLess);
}
