'use strict';

const rules = require('..');

describe('rules', () => {
	for (const [ruleName, rule] of Object.entries(rules)) {
		test(`the "${ruleName}" rule has metadata`, () => {
			expect(rule.meta).toBeTruthy();
			expect(rule.meta.url).toMatch(/^https:\/\/stylelint\.io\/.+/);
		});
	}
});
