'use strict';

const isStandardSyntaxDeclaration = require('../isStandardSyntaxDeclaration');
const less = require('postcss-less');
const postcss = require('postcss');
const sass = require('postcss-sass');
const scss = require('postcss-scss');

describe('isStandardSyntaxDeclaration', () => {
	it('standard prop and value', () => {
		decls('a { a: b }', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
		});
	});

	it('standard prop and scss var', () => {
		decls('a { a: $b }', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
		});
	});

	it('custom-property', () => {
		decls('a { --custom-property: x }', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
		});
	});

	it('standard prop and calc value', () => {
		decls('a { a : calc(b + c) }', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
		});
	});

	it('does not break @selector', () => {
		decls('@page { size: A4 }', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
		});
	});

	it('custom property set in SASS paser', () => {
		sassDecls('a\n\t--custom-property-set:\n\t\tcolor: blue', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
		});
	});

	it('custom property set in SCSS paser', () => {
		scssDecls('a { --custom-property-set: { color: blue; } }', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
		});
	});

	it('custom property set in LESS paser', () => {
		lessDecls('a { --custom-property-set: { color: blue; } }', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
		});
	});

	it('property with sass variable interpolation (only)', () => {
		sassDecls('a\n\t#{$var}: 10px', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
		});
	});

	it('property with scss variable interpolation (only)', () => {
		scssDecls('a { #{$var}: 10px; }', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
		});
	});

	it('property with sass variable interpolation (end)', () => {
		sassDecls('a\n\tprop#{$var}: 10px', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
		});
	});

	it('property with scss variable interpolation (end)', () => {
		scssDecls('a { prop#{$var}: 10px; }', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
		});
	});

	it('property with sass variable interpolation (middle)', () => {
		sassDecls('a\n\tprop#{$var}erty: 10px', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
		});
	});

	it('property with scss variable interpolation (middle)', () => {
		scssDecls('a { prop#{$var}erty: 10px; }', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
		});
	});

	it('property with less variable interpolation (only)', () => {
		lessDecls('a { @{var}: 10px; }', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
		});
	});

	it('property with less variable interpolation (end)', () => {
		lessDecls('a { prop@{var}: 10px; }', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
		});
	});

	it('property with less variable interpolation (middle)', () => {
		lessDecls('a { prop@{var}erty: 10px; }', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
		});
	});

	it('sass var', () => {
		sassDecls('$var: b', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
		});
	});

	it('scss var', () => {
		scssDecls('$var: b', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
		});
	});

	it('scss var within namespace', () => {
		scssDecls('namespace.$var: b', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
		});
	});

	it('nested scss var within namespace', () => {
		scssDecls('a { namespace.$var: b }', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
		});
	});

	it('sass list', () => {
		sassDecls('$list: (key: value, key2: value2)', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
		});
	});

	it('scss list', () => {
		scssDecls('$list: (key: value, key2: value2)', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
		});
	});

	it('sass map', () => {
		sassDecls('$map: (value, value2)', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
		});
	});

	it('scss map', () => {
		scssDecls('$map: (value, value2)', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
		});
	});

	it('nested sass var', () => {
		sassDecls('a\n\t$var: b', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
		});
	});

	it('nested scss var', () => {
		scssDecls('a { $var: b }', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
		});
	});

	it('nested sass list', () => {
		sassDecls('a\n\t$list: (key: value, key2: value2)', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
		});
	});

	it('nested scss list', () => {
		scssDecls('a { $list: (key: value, key2: value2) }', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
		});
	});

	it('sass nested property', () => {
		sassDecls('a\n\tborder:\n\t\tstyle: solid\n\t\tcolor: red', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
		});
	});

	it('scss nested property', () => {
		scssDecls('a { border: { style: solid; color: red; } }', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
		});
	});

	it('nested sass map', () => {
		sassDecls('a\n\t$map: (value, value2)', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
		});
	});

	it('nested scss map', () => {
		scssDecls('a { $map: (value, value2) }', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
		});
	});

	it('less var', () => {
		lessDecls('@var: b', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
		});
	});

	it('nested less var', () => {
		lessDecls('a { @var: b }', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
		});
	});

	it('less &:extend', () => {
		lessDecls('a { &:extend(b) }', (decl) => {
			expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
		});
	});
});

function decls(css, cb) {
	postcss.parse(css).walkDecls(cb);
}

function sassDecls(css, cb) {
	sass.parse(css).walkDecls(cb);
}

function scssDecls(css, cb) {
	scss.parse(css).walkDecls(cb);
}

function lessDecls(css, cb) {
	less.parse(css).walkDecls(cb);
}
