'use strict';

const isStandardSyntaxRule = require('../isStandardSyntaxRule');
const less = require('postcss-less');
const postcss = require('postcss');

describe('isStandardSyntaxRule', () => {
	it('type', () => {
		rules('a {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeTruthy();
		});
	});
	it('when type selector before selector', () => {
		rules('when a {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeTruthy();
		});
	});
	it('when type selector after selector', () => {
		rules('a when {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeTruthy();
		});
	});
	it('pseudo-class', () => {
		rules('a:last-child {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeTruthy();
		});
	});
	it('pseudo-class not', () => {
		rules('a:not(.a) {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeTruthy();
		});
	});
	it('pseudo-element', () => {
		rules('a::after {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeTruthy();
		});
	});
	it('custom-selector', () => {
		rules(':--custom-selector {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeTruthy();
		});
	});
	it('compound custom-selectors', () => {
		rules(':--custom-selector:--custom-selector {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeTruthy();
		});
	});
	it('custom-property-set', () => {
		rules('--custom-property-set: {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('Scss nested properties', () => {
		rules('foo: {};', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('called Less class parametric mixin', () => {
		lessRules('.mixin-name(@var);', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('non-outputting parametric Less class mixin definition', () => {
		lessRules('.mixin-name() {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('non-outputting Less class mixin definition', () => {
		lessRules('.mixin-name(@a, @b) {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('non-outputting parametric Less class mixin definition ending in number', () => {
		lessRules('.mixin-name3(@a, @b) {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('non-outputting Less ID mixin definition', () => {
		lessRules('#mixin-name() {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('called Less ID mixin', () => {
		lessRules('#mixin-name;', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('called namespaced Less mixin (child)', () => {
		lessRules('#namespace > .mixin-name;', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('called namespaced Less mixin (descendant)', () => {
		lessRules('#namespace .mixin-name;', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('called namespaced Less mixin (compound)', () => {
		lessRules('#namespace.mixin-name;', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('less mixin', () => {
		lessRules('.box-shadow(@style, @c) when (iscolor(@c)) {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('less extend', () => {
		lessRules('&:extend(.inline);', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('less detached rulesets', () => {
		lessRules('@foo: {};', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('less guarded namespaces', () => {
		lessRules('#namespace when (@mode=huge) {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('mixin guards', () => {
		lessRules('.mixin (@variable) when (@variable = 10px) {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('css guards', () => {
		lessRules('.foo() when (@variable = true) {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('css guards without spaces', () => {
		lessRules('.foo()when(@variable = true) {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('css guards with multiple spaces', () => {
		lessRules('.foo()   when   (@variable = true) {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('css guards with newlines', () => {
		lessRules('.foo()\nwhen\n(@variable = true) {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('css guards with CLRF', () => {
		lessRules('.foo()\r\nwhen\r\n(@variable = true) {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('css guards with parenthesis', () => {
		lessRules('.foo() when (default()) {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
	it('css guards with not', () => {
		lessRules('.foo() when not (@variable = true) {}', (rule) => {
			expect(isStandardSyntaxRule(rule)).toBeFalsy();
		});
	});
});

function rules(css, cb) {
	postcss.parse(css).walkRules(cb);
}

function lessRules(css, cb) {
	less.parse(css).walkRules(cb);
}
