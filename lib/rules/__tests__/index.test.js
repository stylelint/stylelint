'use strict';

const fs = require('node:fs');
const path = require('node:path');

const rules = require('..');

describe('all rules', () => {
	test.each(Object.entries(rules))('"%s" should have metadata', (_name, rule) => {
		expect(rule.meta).toBeTruthy();
		expect(rule.meta.url).toMatch(/^https:\/\/stylelint\.io\/.+/);
		expect([true, undefined]).toContain(rule.meta.fixable);
	});
});

describe('fixable rules', () => {
	const fixableRules = Object.entries(rules).filter(([, rule]) => rule.meta.fixable);

	test.each(fixableRules)('"%s" should describe fixable in the doc', async (name) => {
		const doc = await fs.promises.readFile(path.join('lib', 'rules', name, 'README.md'), 'utf8');

		expect(doc).toMatch('`fix` option');
	});

	const rulesListDoc = fs.readFileSync(path.join('docs', 'user-guide', 'rules', 'list.md'), 'utf8');

	test.each(fixableRules)('"%s" should describe fixable in the rule list doc', (name) => {
		expect(rulesListDoc).toMatch(new RegExp(`^.+\\b${name}\\b.+\\(Autofixable\\)\\.$`, 'm'));
	});
});
