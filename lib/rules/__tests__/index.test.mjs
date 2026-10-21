import { after, before, describe, test } from 'node:test';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

import postcss from 'postcss';

import rules from '../index.mjs';

const require = createRequire(import.meta.url);

const ruleNames = Object.keys(rules);
let rulesListDoc;

before(async () => {
	rulesListDoc = await readFile(
		new URL('../../../docs/user-guide/rules.md', import.meta.url),
		'utf8',
	);
});

describe('all rules', () => {
	for (const name of ruleNames) {
		test(`"${name}" should have metadata`, async (t) => {
			const rule = await rules[name];

			t.assert.strictEqual(rule.meta.url, `https://stylelint.io/user-guide/rules/${name}`);
			t.assert.ok([true, undefined].includes(rule.meta.fixable));
		});
	}

	for (const name of ruleNames) {
		test(`"${name}" should have a link to a rule doc in the rules page`, (t) => {
			t.assert.ok(rulesListDoc.includes(`[\`${name}\`](../../lib/`));
		});
	}
});

describe('fixability', () => {
	for (const name of ruleNames) {
		test(`"${name}" should be properly documented`, async (t) => {
			const rule = await rules[name];
			const cell = rule.meta.fixable ? '\\s+🔧\\s+' : ' ';
			const needle = '`fix` option';
			const rulePattern = rule.meta.fixable ? needle : `^((?!${needle})(\\s|\\S))*$`;
			const rulesPattern = `^.+\`${name}\`.+\\|.+\\|${cell}\\|$`;
			const ruleDoc = await readFile(new URL(`../${name}/README.md`, import.meta.url), 'utf8');

			t.assert.match(ruleDoc, new RegExp(rulePattern));
			t.assert.match(rulesListDoc, new RegExp(rulesPattern, 'm'));
		});
	}
});

describe('message arguments', () => {
	for (const name of ruleNames) {
		test(`"${name}" should document message arguments`, async (t) => {
			const rule = await rules[name];
			const ruleDoc = await readFile(new URL(`../${name}/README.md`, import.meta.url), 'utf8');

			t.assert.match(
				ruleDoc,
				/\[message arguments?\]\(\.\.\/\.\.\/\.\.\/docs\/user-guide\/configure\.md#message\)/,
			);

			const noneMatch = ruleDoc.match(/This rule doesn't have any \[message arguments?\]\(/);
			const upToMatch = ruleDoc.match(/This rule supports up to (\d+) \[message arguments?\]\(/);
			const perMatch = ruleDoc.match(/This rule supports \d+ \[message arguments?\]\(.*\bper\b/);
			const exactMatch =
				!perMatch && ruleDoc.match(/This rule supports (\d+) \[message arguments?\]\(/);

			t.assert.notStrictEqual(noneMatch ?? upToMatch ?? exactMatch ?? perMatch, null);

			const messageFns = Object.values(rule.messages).filter((m) => typeof m === 'function');

			if (noneMatch) {
				t.assert.strictEqual(messageFns.length, 0);

				return;
			}

			const match = upToMatch ?? exactMatch;

			if (!match) return;

			const documentedCount = Number(match[1]);
			const maxActual = Math.max(...messageFns.map((fn) => fn.length));

			if (upToMatch) {
				t.assert.ok(maxActual <= documentedCount);
			} else {
				t.assert.strictEqual(maxActual, documentedCount);
			}
		});
	}
});

describe('deprecated rules', () => {
	for (const name of ruleNames) {
		test(`"${name}" should describe deprecation in the document`, async (t) => {
			const rule = await rules[name];

			if (!rule.meta.deprecated) return;

			const ruleDoc = await readFile(new URL(`../${name}/README.md`, import.meta.url), 'utf8');

			t.assert.ok(ruleDoc.includes('> **Warning**'));
		});
	}
});

describe('invalid options', () => {
	for (const name of ruleNames) {
		test(`"${name}" should handle invalid options`, async (t) => {
			const rule = await rules[name];
			const primaryOption = false;
			const secondaryOptions = {};
			const context = {};
			const root = postcss.root();
			const result = Object.assign(root.toResult(), {
				stylelint: { config: { validate: true } },
			});

			await rule(primaryOption, secondaryOptions, context)(root, result);

			t.assert.strictEqual(result.messages.length, 1);
			t.assert.ok(result.messages[0].text.includes(`rule "${name}"`));
			t.assert.strictEqual(result.messages[0].stylelintType, 'invalidOption');
		});
	}
});

// To prevent a failure when adding a new rule to the sharable config. See #7045.
describe.skip('standard config', () => {
	let tmpDir;
	let standardRules;

	before(() => {
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

	after(() => {
		rmSync(tmpDir, { recursive: true, force: true });
	});

	test('the rules are present in the rules doc', (t) => {
		t.assert.notStrictEqual(standardRules.length, 0);

		for (const name of standardRules) {
			t.assert.match(rulesListDoc, new RegExp(`^.+\`${name}\`.+\\|\\s+✅\\s+\\|.+\\|$`, 'm'));
		}
	});
});
