import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

import rules from '../index.mjs';

const require = createRequire(import.meta.url);

const ruleNames = Object.keys(rules);
let rulesListDoc;

beforeAll(async () => {
	rulesListDoc = await readFile(
		new URL('../../../docs/user-guide/rules.md', import.meta.url),
		'utf8',
	);
});

describe('all rules', () => {
	test.each(ruleNames)('"%s" should have metadata', async (name) => {
		const rule = await rules[name];

		expect(rule).toHaveProperty('meta.url', `https://stylelint.io/user-guide/rules/${name}`);
		expect([true, undefined]).toContain(rule.meta.fixable);
	});

	test.each(ruleNames)('"%s" should have a link to a rule doc in the rules page', (name) => {
		expect(rulesListDoc).toContain(`[\`${name}\`](../../lib/`);
	});
});

describe('fixable rules', () => {
	test.each(ruleNames)('"%s" should describe fixable in the documents', async (name) => {
		const rule = await rules[name];

		if (!rule.meta.fixable) return;

		const ruleDoc = await readFile(new URL(`../${name}/README.md`, import.meta.url), 'utf8');

		expect(ruleDoc).toMatch('`fix` option');
		expect(rulesListDoc).toMatch(new RegExp(`^.+\`${name}\`.+\\|.+\\|\\s+🔧\\s+\\|$`, 'm'));
	});
});

describe('deprecated rules', () => {
	test.each(ruleNames)('"%s" should describe deprecation in the document', async (name) => {
		const rule = await rules[name];

		if (!rule.meta.deprecated) return;

		const ruleDoc = await readFile(new URL(`../${name}/README.md`, import.meta.url), 'utf8');

		expect(ruleDoc).toMatch('> **Warning**');
	});
});

describe('custom message option', () => {
	test.each(ruleNames)(
		'"%s" should describe a custom message option in the document',
		async (name) => {
			const jsCode = await readFile(new URL(`../${name}/index.mjs`, import.meta.url), 'utf8');

			// NOTE: If all rules support a custom message option, we should remove this `if` statement.
			if (!jsCode.includes('\tmessageArgs: [')) return;

			const doc = await readFile(new URL(`../${name}/README.md`, import.meta.url), 'utf8');

			expect(doc).toContain('`message` secondary option');
		},
	);
});

// eslint-disable-next-line jest/no-disabled-tests -- To prevent a failure when adding a new rule to the sharable config. See #7045.
describe.skip('standard config', () => {
	let tmpDir;
	let standardRules;

	beforeAll(() => {
		tmpDir = fileURLToPath(new URL('./tmp', import.meta.url));

		// NOTE: The use of Promised-based APIs may cause flaky test on CI.
		rmSync(tmpDir, { recursive: true, force: true });
		mkdirSync(tmpDir, { recursive: true });
		writeFileSync(join(tmpDir, 'package.json'), '{}');
		execSync(
			'npm install --silent --no-package-lock --no-audit --omit=peer stylelint-config-standard',
			{ cwd: tmpDir },
		);

		const configRules = (name) => {
			const config = require(join(tmpDir, 'node_modules', name));

			return Object.keys(config.rules);
		};

		standardRules = [
			...configRules('stylelint-config-standard'),
			...configRules('stylelint-config-recommended'),
		];
	});

	afterAll(() => {
		rmSync(tmpDir, { recursive: true, force: true });
	});

	test('the rules are present in the rules doc', () => {
		expect(standardRules).not.toHaveLength(0);

		for (const name of standardRules) {
			expect(rulesListDoc).toMatch(new RegExp(`^.+\`${name}\`.+\\|\\s+✅\\s+\\|.+\\|$`, 'm'));
		}
	});
});
