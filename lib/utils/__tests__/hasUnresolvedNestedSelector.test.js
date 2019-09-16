'use strict';

const hasUnresolvedNestedSelector = require('../hasUnresolvedNestedSelector');
const postcss = require('postcss');
const scss = require('postcss-scss');

describe('hasUnresolvedNestedSelector', () => {
	it('type', () => {
		expect.assertions(1);
		rules('a {}', (rule) => {
			expect(hasUnresolvedNestedSelector(rule)).toBeFalsy();
		});
	});
	it('class', () => {
		expect.assertions(1);
		rules('.foo {}', (rule) => {
			expect(hasUnresolvedNestedSelector(rule)).toBeFalsy();
		});
	});
	it('nested type', () => {
		expect.assertions(1);
		const parsed = postcss.parse('.foo { a {} }');

		expect(hasUnresolvedNestedSelector(parsed.first)).toBeTruthy();
	});
	it('nested selector', () => {
		expect.assertions(1);
		const parsed = postcss.parse('.foo { .bar {} }');

		expect(hasUnresolvedNestedSelector(parsed.first)).toBeTruthy();
	});
	it('SCSS mixin', () => {
		expect.assertions(1);
		scssRules('@include test-mixin {}', (rule) => {
			expect(hasUnresolvedNestedSelector(rule)).toBeFalsy();
		});
	});
	it('SCSS nested mixin no children', () => {
		expect.assertions(2);
		scssRules('.foo { @include test-mixin; }', (rule) => {
			expect(hasUnresolvedNestedSelector(rule)).toBeFalsy();
		});
	});
	it('SCSS nested mixin children', () => {
		expect.assertions(2);
		scssRules('.foo { @include test-mixin {} }', (rule) => {
			expect(hasUnresolvedNestedSelector(rule)).toBeFalsy();
		});
	});
	it('SCSS multiple mixins', () => {
		expect.assertions(2);
		scssRules('@include test-mixin { @media (min-width: 10rem) {} }', (rule) => {
			expect(hasUnresolvedNestedSelector(rule)).toBeFalsy();
		});
	});
});

function rules(css, cb) {
	postcss.parse(css).walk(cb);
}

function scssRules(css, cb) {
	scss.parse(css).walk(cb);
}
