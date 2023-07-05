import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readFile } from 'node:fs/promises';

import rules from '../index.js';

const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const ruleEntries = Object.entries(rules);
let rulesListDoc;

beforeAll(async () => {
	rulesListDoc = await readFile(
		path.join(__dirname, '..', '..', '..', 'docs', 'user-guide', 'rules.md'),
		'utf8',
	);
});

describe('all rules', () => {
	test.each(ruleEntries)('"%s" should have metadata', (name, rule) => {
		expect(rule.meta).toBeTruthy();
		expect(rule.meta.url).toBe(`https://stylelint.io/user-guide/rules/${name}`);
		expect([true, undefined]).toContain(rule.meta.fixable);
	});

	test.each(ruleEntries)('"%s" should have a link to a rule doc in the rules page', (name) => {
		expect(rulesListDoc).toContain(`[\`${name}\`](../../lib/`);
	});
});

describe('fixable rules', () => {
	const fixableRules = ruleEntries.filter(([, rule]) => rule.meta.fixable);

	test.each(fixableRules)('"%s" should describe fixable in the rules doc', async (name) => {
		const doc = await readFile(path.join(__dirname, '..', name, 'README.md'), 'utf8');

		expect(doc).toMatch('`fix` option');
	});

	test.each(fixableRules)('"%s" should describe fixable in the rules doc', (name) => {
		expect(rulesListDoc).toMatch(new RegExp(`^.+\`${name}\`.+\\|.+\\|\\s+🔧\\s+\\|$`, 'm'));
	});
});

describe('deprecated rules', () => {
	const deprecatedRules = ruleEntries.filter(([, rule]) => rule.meta.deprecated);

	test.each(deprecatedRules)('"%s" should describe deprecation in the rules doc', async (name) => {
		const doc = await readFile(path.join(__dirname, '..', name, 'README.md'), 'utf8');

		expect(doc).toMatch('> **Warning**');
	});
});

describe('custom message option', () => {
	test.each(ruleEntries)(
		'"%s" should describe a custom message option in its doc',
		async (ruleName) => {
			const jsFile = path.join(__dirname, '..', ruleName, 'index.js');
			const jsCode = await readFile(jsFile, 'utf8');

			// NOTE: If all rules support a custom message option, we should remove this `if` statement.
			if (!jsCode.includes('\tmessageArgs: [')) return;

			const doc = await readFile(jsFile.replace('index.js', 'README.md'), 'utf8');

			expect(doc).toContain('`message` secondary option');
		},
	);
});

describe('standard config', () => {
	// eslint-disable-next-line jest/no-disabled-tests -- To prevent a failure when adding a new rule to the sharable config. See #7045.
	describe.skip('due to chicken and egg problem #7045', () => {
		const tmpDir = path.join(__dirname, 'tmp');

		// NOTE: The use of Promised-based APIs may cause flaky test on CI.
		rmSync(tmpDir, { recursive: true, force: true });
		mkdirSync(tmpDir, { recursive: true });
		writeFileSync(path.join(tmpDir, 'package.json'), '{}');
		execSync(
			'npm install --silent --no-package-lock --no-audit --omit=peer stylelint-config-standard',
			{ cwd: tmpDir },
		);

		const configRules = (name) => {
			const config = require(path.join(tmpDir, 'node_modules', name));

			return Object.keys(config.rules);
		};

		const standardRules = configRules('stylelint-config-standard');

		standardRules.push(...configRules('stylelint-config-recommended'));

		afterAll(() => {
			rmSync(tmpDir, { recursive: true, force: true });
		});

		test('the rules are not empty', () => {
			expect(standardRules).not.toHaveLength(0);
		});

		test.each(standardRules)('the rule "%s" are present in the rules doc', (name) => {
			expect(rulesListDoc).toMatch(new RegExp(`^.+\`${name}\`.+\\|\\s+✅\\s+\\|.+\\|$`, 'm'));
		});
	});
});
