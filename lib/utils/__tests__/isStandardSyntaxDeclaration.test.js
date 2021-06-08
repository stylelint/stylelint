'use strict';

const isStandardSyntaxDeclaration = require('../isStandardSyntaxDeclaration');
const postcss = require('postcss');
const postcssLess = require('postcss-less');
const postcssSass = require('postcss-sass');
const postcssScss = require('postcss-scss');

describe('isStandardSyntaxDeclaration', () => {
	it('standard prop and value', () => {
		expect(isStandardSyntaxDeclaration(decl('a { a: b }'))).toBe(true);
	});

	it('standard prop and scss var', () => {
		expect(isStandardSyntaxDeclaration(decl('a { a: $b }'))).toBe(true);
	});

	it('custom-property', () => {
		expect(isStandardSyntaxDeclaration(decl('a { --custom-property: x }'))).toBe(true);
	});

	it('standard prop and calc value', () => {
		expect(isStandardSyntaxDeclaration(decl('a { a : calc(b + c) }'))).toBe(true);
	});

	it('does not break @selector', () => {
		expect(isStandardSyntaxDeclaration(decl('@page { size: A4 }'))).toBe(true);
	});

	it('property with sass variable interpolation (only)', () => {
		expect(isStandardSyntaxDeclaration(sassDecl('a\n\t#{$var}: 10px'))).toBe(true);
	});

	it('property with scss variable interpolation (only)', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('a { #{$var}: 10px; }'))).toBe(true);
	});

	it('property with sass variable interpolation (end)', () => {
		expect(isStandardSyntaxDeclaration(sassDecl('a\n\tprop#{$var}: 10px'))).toBe(true);
	});

	it('property with scss variable interpolation (end)', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('a { prop#{$var}: 10px; }'))).toBe(true);
	});

	it('property with sass variable interpolation (middle)', () => {
		expect(isStandardSyntaxDeclaration(sassDecl('a\n\tprop#{$var}erty: 10px'))).toBe(true);
	});

	it('property with scss variable interpolation (middle)', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('a { prop#{$var}erty: 10px; }'))).toBe(true);
	});

	it('property with less variable interpolation (only)', () => {
		expect(isStandardSyntaxDeclaration(lessDecl('a { @{var}: 10px; }'))).toBe(true);
	});

	it('property with less variable interpolation (end)', () => {
		expect(isStandardSyntaxDeclaration(lessDecl('a { prop@{var}: 10px; }'))).toBe(true);
	});

	it('property with less variable interpolation (middle)', () => {
		expect(isStandardSyntaxDeclaration(lessDecl('a { prop@{var}erty: 10px; }'))).toBe(true);
	});

	it('sass var', () => {
		expect(isStandardSyntaxDeclaration(sassDecl('$var: b'))).toBe(false);
	});

	it('scss var', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('$var: b'))).toBe(false);
	});

	it('scss var within namespace', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('namespace.$var: b'))).toBe(false);
	});

	it('nested scss var within namespace', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('a { namespace.$var: b }'))).toBe(false);
	});

	it('sass list', () => {
		expect(isStandardSyntaxDeclaration(sassDecl('$list: (key: value, key2: value2)'))).toBe(false);
	});

	it('scss list', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('$list: (key: value, key2: value2)'))).toBe(false);
	});

	it('sass map', () => {
		expect(isStandardSyntaxDeclaration(sassDecl('$map: (value, value2)'))).toBe(false);
	});

	it('scss map', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('$map: (value, value2)'))).toBe(false);
	});

	it('nested sass var', () => {
		expect(isStandardSyntaxDeclaration(sassDecl('a\n\t$var: b'))).toBe(false);
	});

	it('nested scss var', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('a { $var: b }'))).toBe(false);
	});

	it('nested sass list', () => {
		expect(isStandardSyntaxDeclaration(sassDecl('a\n\t$list: (key: value, key2: value2)'))).toBe(
			false,
		);
	});

	it('nested scss list', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('a { $list: (key: value, key2: value2) }'))).toBe(
			false,
		);
	});

	it('sass nested property', () => {
		expect(isStandardSyntaxDeclaration(sassDecl('a\n\tborder:\n\t\tstyle: solid'))).toBe(false);
	});

	it('scss nested property', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('a { border: { style: solid; } }'))).toBe(false);
	});

	it('nested sass map', () => {
		expect(isStandardSyntaxDeclaration(sassDecl('a\n\t$map: (value, value2)'))).toBe(false);
	});

	it('nested scss map', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('a { $map: (value, value2) }'))).toBe(false);
	});

	it('less &:extend', () => {
		expect(isStandardSyntaxDeclaration(lessDecl('a { &:extend(b) }'))).toBe(false);
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
