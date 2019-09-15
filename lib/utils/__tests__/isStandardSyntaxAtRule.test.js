'use strict';

const isStandardSyntaxAtRule = require('../isStandardSyntaxAtRule');
const less = require('postcss-less');
const postcss = require('postcss');
const sass = require('postcss-sass');
const scss = require('postcss-scss');

describe('isStandardSyntaxAtRule', () => {
	it('non nested at-rules without quotes', () => {
		atRules('@charset UTF-8;', (atRule) => {
			expect(isStandardSyntaxAtRule(atRule)).toBeTruthy();
		});
	});

	it("non nested at-rules with `'` quotes", () => {
		atRules("@charset 'UTF-8';", (atRule) => {
			expect(isStandardSyntaxAtRule(atRule)).toBeTruthy();
		});
	});

	it('non nested at-rules with `"` quotes', () => {
		atRules('@charset "UTF-8";', (atRule) => {
			expect(isStandardSyntaxAtRule(atRule)).toBeTruthy();
		});
	});

	it("non nested at-rules with `'` quotes and without space after name", () => {
		atRules("@charset'UTF-8';", (atRule) => {
			expect(isStandardSyntaxAtRule(atRule)).toBeTruthy();
		});
	});

	it('non nested at-rules with `"` quotes and without space after name', () => {
		atRules('@charset"UTF-8";', (atRule) => {
			expect(isStandardSyntaxAtRule(atRule)).toBeTruthy();
		});
	});

	it('non nested at-rules with function and without space after name', () => {
		atRules('@import url("fineprint.css") print;', (atRule) => {
			expect(isStandardSyntaxAtRule(atRule)).toBeTruthy();
		});
	});

	it('nested at-rules', () => {
		atRules('@media (min-width: 100px) {};', (atRule) => {
			expect(isStandardSyntaxAtRule(atRule)).toBeTruthy();
		});
	});

	it('nested at-rules with newline after name', () => {
		atRules('@media\n(min-width: 100px) {};', (atRule) => {
			expect(isStandardSyntaxAtRule(atRule)).toBeTruthy();
		});
	});

	it('nested at-rules with windows newline after name', () => {
		atRules('@media\r\n(min-width: 100px) {};', (atRule) => {
			expect(isStandardSyntaxAtRule(atRule)).toBeTruthy();
		});
	});

	it('nested at-rules without space after name', () => {
		atRules('@media(min-width: 100px) {};', (atRule) => {
			expect(isStandardSyntaxAtRule(atRule)).toBeTruthy();
		});
	});

	it('ignore `@content` inside mixins newline', () => {
		const sass = '@mixin mixin()\n  @content';

		sassAtRules(sass, (atRule) => {
			if (atRule.name === 'mixin') {
				return;
			}

			expect(isStandardSyntaxAtRule(atRule)).toBeFalsy();
		});
	});

	it('ignore `@content` inside mixins space', () => {
		const scss = '@mixin mixin() { @content; };';

		scssAtRules(scss, (atRule) => {
			if (atRule.name === 'mixin') {
				return;
			}

			expect(isStandardSyntaxAtRule(atRule)).toBeFalsy();
		});
	});

	it('ignore passing rulesets to mixins', () => {
		const less = '@detached-ruleset: { background: red; }; .top { @detached-ruleset(); }';

		lessAtRules(less, (atRule) => {
			expect(isStandardSyntaxAtRule(atRule)).toBeFalsy();
		});
	});

	it('ignore calling of mixins', () => {
		const less = 'a { .mixin(); }';

		lessAtRules(less, (atRule) => {
			expect(isStandardSyntaxAtRule(atRule)).toBeFalsy();
		});
	});

	it('ignore variables', () => {
		const less = `
        @my-variable: 10px;
        .top { margin-top: @my-variable; }
    `;

		lessAtRules(less, (atRule) => {
			expect(isStandardSyntaxAtRule(atRule)).toBeFalsy();
		});
	});
});

function atRules(css, cb) {
	postcss.parse(css).walkAtRules(cb);
}

function sassAtRules(css, cb) {
	sass.parse(css).walkAtRules(cb);
}

function scssAtRules(css, cb) {
	scss.parse(css).walkAtRules(cb);
}

function lessAtRules(css, cb) {
	less.parse(css).walkAtRules(cb);
}
