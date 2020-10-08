'use strict';

const isStandardSyntaxDeclaration = require('../isStandardSyntaxDeclaration');
const postcss = require('postcss');
const postcssLess = require('postcss-less');
const postcssSass = require('postcss-sass');
const postcssScss = require('postcss-scss');

describe('isStandardSyntaxDeclaration', () => {
	it('standard prop and value', () => {
		expect(isStandardSyntaxDeclaration(decl('a { a: b }'))).toBeTruthy();
	});

	it('standard prop and scss var', () => {
		expect(isStandardSyntaxDeclaration(decl('a { a: $b }'))).toBeTruthy();
	});

	it('custom-property', () => {
		expect(isStandardSyntaxDeclaration(decl('a { --custom-property: x }'))).toBeTruthy();
	});

	it('standard prop and calc value', () => {
		expect(isStandardSyntaxDeclaration(decl('a { a : calc(b + c) }'))).toBeTruthy();
	});

	it('does not break @selector', () => {
		expect(isStandardSyntaxDeclaration(decl('@page { size: A4 }'))).toBeTruthy();
	});

	it('custom property set in SASS parser', () => {
		expect(
			isStandardSyntaxDeclaration(sassDecl('a\n\t--custom-property-set:\n\t\tcolor: blue')),
		).toBeTruthy();
	});

	it('custom property set in SCSS parser', () => {
		expect(
			isStandardSyntaxDeclaration(scssDecl('a { --custom-property-set: { color: blue; } }')),
		).toBeTruthy();
	});

	it('custom property set in LESS parser', () => {
		expect(
			isStandardSyntaxDeclaration(lessDecl('a { --custom-property-set: { color: blue; } }')),
		).toBeTruthy();
	});

	it('property with sass variable interpolation (only)', () => {
		expect(isStandardSyntaxDeclaration(sassDecl('a\n\t#{$var}: 10px'))).toBeTruthy();
	});

	it('property with scss variable interpolation (only)', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('a { #{$var}: 10px; }'))).toBeTruthy();
	});

	it('property with sass variable interpolation (end)', () => {
		expect(isStandardSyntaxDeclaration(sassDecl('a\n\tprop#{$var}: 10px'))).toBeTruthy();
	});

	it('property with scss variable interpolation (end)', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('a { prop#{$var}: 10px; }'))).toBeTruthy();
	});

	it('property with sass variable interpolation (middle)', () => {
		expect(isStandardSyntaxDeclaration(sassDecl('a\n\tprop#{$var}erty: 10px'))).toBeTruthy();
	});

	it('property with scss variable interpolation (middle)', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('a { prop#{$var}erty: 10px; }'))).toBeTruthy();
	});

	it('property with less variable interpolation (only)', () => {
		expect(isStandardSyntaxDeclaration(lessDecl('a { @{var}: 10px; }'))).toBeTruthy();
	});

	it('property with less variable interpolation (end)', () => {
		expect(isStandardSyntaxDeclaration(lessDecl('a { prop@{var}: 10px; }'))).toBeTruthy();
	});

	it('property with less variable interpolation (middle)', () => {
		expect(isStandardSyntaxDeclaration(lessDecl('a { prop@{var}erty: 10px; }'))).toBeTruthy();
	});

	it('sass var', () => {
		expect(isStandardSyntaxDeclaration(sassDecl('$var: b'))).toBeFalsy();
	});

	it('scss var', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('$var: b'))).toBeFalsy();
	});

	it('scss var within namespace', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('namespace.$var: b'))).toBeFalsy();
	});

	it('nested scss var within namespace', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('a { namespace.$var: b }'))).toBeFalsy();
	});

	it('sass list', () => {
		expect(isStandardSyntaxDeclaration(sassDecl('$list: (key: value, key2: value2)'))).toBeFalsy();
	});

	it('scss list', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('$list: (key: value, key2: value2)'))).toBeFalsy();
	});

	it('sass map', () => {
		expect(isStandardSyntaxDeclaration(sassDecl('$map: (value, value2)'))).toBeFalsy();
	});

	it('scss map', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('$map: (value, value2)'))).toBeFalsy();
	});

	it('nested sass var', () => {
		expect(isStandardSyntaxDeclaration(sassDecl('a\n\t$var: b'))).toBeFalsy();
	});

	it('nested scss var', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('a { $var: b }'))).toBeFalsy();
	});

	it('nested sass list', () => {
		expect(
			isStandardSyntaxDeclaration(sassDecl('a\n\t$list: (key: value, key2: value2)')),
		).toBeFalsy();
	});

	it('nested scss list', () => {
		expect(
			isStandardSyntaxDeclaration(scssDecl('a { $list: (key: value, key2: value2) }')),
		).toBeFalsy();
	});

	it('sass nested property', () => {
		expect(isStandardSyntaxDeclaration(sassDecl('a\n\tborder:\n\t\tstyle: solid'))).toBeFalsy();
	});

	it('scss nested property', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('a { border: { style: solid; } }'))).toBeFalsy();
	});

	it('nested sass map', () => {
		expect(isStandardSyntaxDeclaration(sassDecl('a\n\t$map: (value, value2)'))).toBeFalsy();
	});

	it('nested scss map', () => {
		expect(isStandardSyntaxDeclaration(scssDecl('a { $map: (value, value2) }'))).toBeFalsy();
	});

	it('less &:extend', () => {
		expect(isStandardSyntaxDeclaration(lessDecl('a { &:extend(b) }'))).toBeFalsy();
	});
});

function decl(css, parser = postcss) {
	const list = [];

	parser.parse(css).walkDecls((decl) => list.push(decl));

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
