'use strict';

const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const rules = require('..');
const ruleEntries = Object.entries(rules);

let rulesListDoc;

beforeAll(async () => {
	rulesListDoc = await fs.promises.readFile(
		path.join(__dirname, '..', '..', '..', 'docs', 'user-guide', 'rules.md'),
		'utf8',
	);
});

describe('all rules', () => {
	test.each(ruleEntries)('"%s" should have metadata', (_name, rule) => {
		expect(rule.meta).toBeTruthy();
		expect(rule.meta.url).toMatch(/^https:\/\/stylelint\.io\/.+/);
		expect([true, undefined]).toContain(rule.meta.fixable);
	});

	test.each(ruleEntries)('"%s" should have a link to a rule doc in the rules page', (name) => {
		expect(rulesListDoc).toContain(`[\`${name}\`](../../lib/`);
	});
});

describe('fixable rules', () => {
	const fixableRules = ruleEntries.filter(([, rule]) => rule.meta.fixable);

	test.each(fixableRules)('"%s" should describe fixable in the rules doc', async (name) => {
		const doc = await fs.promises.readFile(path.join(__dirname, '..', name, 'README.md'), 'utf8');

		expect(doc).toMatch('`fix` option');
	});

	test.each(fixableRules)('"%s" should describe fixable in the rules doc', (name) => {
		expect(rulesListDoc).toMatch(new RegExp(`^.+\\b${name}\\b.+\\|.+\\|\\s+🔧\\s+\\|$`, 'm'));
	});
});

describe('deprecated rules', () => {
	const deprecatedRules = ruleEntries.filter(([, rule]) => rule.meta.deprecated);

	test.each(deprecatedRules)('"%s" should describe deprecation in the rules doc', async (name) => {
		const doc = await fs.promises.readFile(path.join(__dirname, '..', name, 'README.md'), 'utf8');

		expect(doc).toMatch('> **Warning**');
	});
});

describe('custom message option', () => {
	test.each(ruleEntries)(
		'"%s" should describe a custom message option in its doc',
		async (ruleName) => {
			const jsFile = path.join(__dirname, '..', ruleName, 'index.js');
			const jsCode = await fs.promises.readFile(jsFile, 'utf8');

			// NOTE: If all rules support a custom message option, we should remove this `if` statement.
			if (!jsCode.includes('\tmessageArgs: [')) return;

			const doc = await fs.promises.readFile(jsFile.replace('index.js', 'README.md'), 'utf8');

			expect(doc).toContain('`message` secondary option');
		},
	);
});

describe('recommended and standard configs', () => {
	const cwd = path.join(__dirname, 'tmp');

	fs.rmSync(cwd, { recursive: true, force: true });
	fs.mkdirSync(cwd, { recursive: true });
	fs.writeFileSync(path.join(cwd, 'package.json'), '{}');
	cp.execSync(
		'npm install --silent --no-package-lock --no-audit --omit=peer stylelint-config-standard',
		{ cwd },
	);

	const configRules = (name) => Object.keys(require(path.join(cwd, 'node_modules', name)).rules);
	const standardRules = configRules('stylelint-config-standard');

	test('standard config is not empty', () => {
		expect(standardRules).not.toHaveLength(0);
	});

	test.each(standardRules)(
		'"%s" should be included in the standard config in the rules doc',
		(name) => {
			expect(rulesListDoc).toMatch(new RegExp(`^.+\\b${name}\\b.+\\|\\s+✅\\s+\\|.+\\|$`, 'm'));
		},
	);
});
