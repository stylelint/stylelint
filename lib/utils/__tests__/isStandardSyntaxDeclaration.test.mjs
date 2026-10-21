import { describe, it } from 'node:test';

import isStandardSyntaxDeclaration from '../isStandardSyntaxDeclaration.mjs';
import postcss from 'postcss';
import postcssLess from 'postcss-less';
import postcssSass from 'postcss-sass';
import postcssScss from 'postcss-scss';

describe('isStandardSyntaxDeclaration', () => {
	it('standard prop and value', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(decl('a { a: b }')), true);
	});

	it('standard prop and scss var', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(decl('a { a: $b }')), true);
	});

	it('custom-property', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(decl('a { --custom-property: x }')), true);
	});

	it('standard prop and calc value', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(decl('a { a : calc(b + c) }')), true);
	});

	it('does not break @selector', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(decl('@page { size: A4 }')), true);
	});

	it('property with sass variable interpolation (only)', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(sassDecl('a\n\t#{$var}: 10px')), true);
	});

	it('property with scss variable interpolation (only)', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(scssDecl('a { #{$var}: 10px; }')), true);
	});

	it('property with sass variable interpolation (end)', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(sassDecl('a\n\tprop#{$var}: 10px')), true);
	});

	it('property with scss variable interpolation (end)', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(scssDecl('a { prop#{$var}: 10px; }')), true);
	});

	it('property with sass variable interpolation (middle)', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(sassDecl('a\n\tprop#{$var}erty: 10px')), true);
	});

	it('property with scss variable interpolation (middle)', (t) => {
		t.assert.strictEqual(
			isStandardSyntaxDeclaration(scssDecl('a { prop#{$var}erty: 10px; }')),
			true,
		);
	});

	it('property with less variable interpolation (only)', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(lessDecl('a { @{var}: 10px; }')), true);
	});

	it('property with less variable interpolation (end)', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(lessDecl('a { prop@{var}: 10px; }')), true);
	});

	it('property with less variable interpolation (middle)', (t) => {
		t.assert.strictEqual(
			isStandardSyntaxDeclaration(lessDecl('a { prop@{var}erty: 10px; }')),
			true,
		);
	});

	it('sass var', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(sassDecl('$var: b')), false);
	});

	it('scss var', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(scssDecl('$var: b')), false);
	});

	it('scss var within namespace', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(scssDecl('namespace.$var: b')), false);
	});

	it('nested scss var within namespace', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(scssDecl('a { namespace.$var: b }')), false);
	});

	it('sass list', (t) => {
		t.assert.strictEqual(
			isStandardSyntaxDeclaration(sassDecl('$list: (key: value, key2: value2)')),
			false,
		);
	});

	it('scss list', (t) => {
		t.assert.strictEqual(
			isStandardSyntaxDeclaration(scssDecl('$list: (key: value, key2: value2)')),
			false,
		);
	});

	it('sass map', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(sassDecl('$map: (value, value2)')), false);
	});

	it('scss map', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(scssDecl('$map: (value, value2)')), false);
	});

	it('nested sass var', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(sassDecl('a\n\t$var: b')), false);
	});

	it('nested scss var', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(scssDecl('a { $var: b }')), false);
	});

	it('nested sass list', (t) => {
		t.assert.strictEqual(
			isStandardSyntaxDeclaration(sassDecl('a\n\t$list: (key: value, key2: value2)')),
			false,
		);
	});

	it('nested scss list', (t) => {
		t.assert.strictEqual(
			isStandardSyntaxDeclaration(scssDecl('a { $list: (key: value, key2: value2) }')),
			false,
		);
	});

	it('sass nested property', (t) => {
		t.assert.strictEqual(
			isStandardSyntaxDeclaration(sassDecl('a\n\tborder:\n\t\tstyle: solid')),
			false,
		);
	});

	it('scss nested property', (t) => {
		t.assert.strictEqual(
			isStandardSyntaxDeclaration(scssDecl('a { border: { style: solid; } }')),
			false,
		);
	});

	it('nested sass map', (t) => {
		t.assert.strictEqual(
			isStandardSyntaxDeclaration(sassDecl('a\n\t$map: (value, value2)')),
			false,
		);
	});

	it('nested scss map', (t) => {
		t.assert.strictEqual(
			isStandardSyntaxDeclaration(scssDecl('a { $map: (value, value2) }')),
			false,
		);
	});

	it('less &:extend', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(lessDecl('a { &:extend(b) }')), false);
	});

	it('less map', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(lessDecl('@map: { key: value; }')), false);
	});

	it('less another map', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(lessDecl('#my-map() { key: value; }')), false);
	});

	it('scss map declaration', (t) => {
		t.assert.strictEqual(
			isStandardSyntaxDeclaration(scssDecl('$foo: (key: value, key2: value2)')),
			false,
		);
	});

	it('scss map declaration with quotes', (t) => {
		t.assert.strictEqual(
			isStandardSyntaxDeclaration(scssDecl('$foo: ("key": value, "key2": value2)')),
			false,
		);
	});

	it('scss list declaration', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(scssDecl('$foo: (value, value2)')), false);
	});

	it('scss pure value in parentheses', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(scssDecl('a { height: (0) }')), true);
	});

	it('scss complex value in parentheses', (t) => {
		t.assert.strictEqual(
			isStandardSyntaxDeclaration(scssDecl('a { height: (3px + 5px) * (2px + 4px) }')),
			true,
		);
	});

	it('supports root-level declarations', (t) => {
		t.assert.strictEqual(isStandardSyntaxDeclaration(decl('color: yellow;')), true);
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
