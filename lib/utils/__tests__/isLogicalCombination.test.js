'use strict';

const isLogicalCombination = require('../isLogicalCombination');
const parseSelector = require('postcss-selector-parser');
const postcss = require('postcss');

function selector(css, cb) {
	postcss.parse(css).walkRules((rule) => {
		parseSelector((selectorAST) => {
			selectorAST.walkPseudos(cb);
		}).processSync(rule.selector);
	});
}

describe('isLogicalCombination', () => {
	it('hover pseudo class is NOT logical combination', () => {
		selector('a:hover {}', (selector) => {
			expect(isLogicalCombination(selector)).toBe(false);
		});
	});

	it('not pseudo class is logical combination', () => {
		selector('a:not(.foo) {}', (selector) => {
			expect(isLogicalCombination(selector)).toBe(true);
		});
	});

	it('has pseudo class is logical combination', () => {
		selector('a:has(.foo) {}', (selector) => {
			expect(isLogicalCombination(selector)).toBe(true);
		});
	});

	it('matches pseudo class is logical combination', () => {
		selector('a:matches(.foo) {}', (selector) => {
			expect(isLogicalCombination(selector)).toBe(true);
		});
	});
});
