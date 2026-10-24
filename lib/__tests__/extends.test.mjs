import { afterEach, beforeEach, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { EXIT_CODE_INVALID_CONFIG } from '../constants.mjs';
import configExtendingWithObject from './fixtures/config-extending-with-object.mjs';
import safeChdir from '../testUtils/safeChdir.mjs';
import standalone from '../standalone.mjs';

import configExtendingAnotherExtend from './fixtures/config-extending-another-extend.json' with { type: 'json' };
import configExtendingOne from './fixtures/config-extending-one.json' with { type: 'json' };
import configExtendingThreeWithOverride from './fixtures/config-extending-three-with-override.json' with { type: 'json' };

const fixturesPath = fileURLToPath(new URL('./fixtures', import.meta.url));

it('basic extending', async (t) => {
	const { report, results } = await standalone({
		code: 'a {}',
		config: configExtendingOne,
		configBasedir: fixturesPath,
	});

	t.assert.ok(report.includes('block-no-empty'));
	t.assert.strictEqual(results.length, 1);
	t.assert.strictEqual(results[0].warnings.length, 1);
	t.assert.strictEqual(results[0].warnings[0].rule, 'block-no-empty');
});

it('basic extending with object', async (t) => {
	const { report, results } = await standalone({
		code: 'a {}',
		config: configExtendingWithObject,
		configBasedir: fixturesPath,
	});

	t.assert.ok(report.includes('block-no-empty'));
	t.assert.strictEqual(results.length, 1);
	t.assert.strictEqual(results[0].warnings.length, 1);
	t.assert.strictEqual(results[0].warnings[0].rule, 'block-no-empty');
});

it('recursive extending', async (t) => {
	const { report, results } = await standalone({
		code: 'a {}',
		config: configExtendingAnotherExtend,
		configBasedir: fixturesPath,
	});

	t.assert.ok(report.includes('block-no-empty'));
	t.assert.strictEqual(results.length, 1);
	t.assert.strictEqual(results[0].warnings.length, 1);
	t.assert.strictEqual(results[0].warnings[0].rule, 'block-no-empty');
});

it('extending with overrides', async (t) => {
	const linted = await standalone({
		code: 'a {}',
		config: configExtendingThreeWithOverride,
		configBasedir: fixturesPath,
	});

	t.assert.strictEqual(linted.results[0].warnings.length, 0);
});

it('extending configuration and no configBasedir', (t) => {
	return t.assert.rejects(
		standalone({
			code: 'a {}',
			config: configExtendingOne,
		}),
		{ code: EXIT_CODE_INVALID_CONFIG },
	);
});

it('extending a config that is overridden', async (t) => {
	const linted = await standalone({
		code: 'a { top: 0px; }',
		config: {
			extends: [path.join(fixturesPath, 'config-length-zero-no-unit-true.json')],
			rules: { 'length-zero-no-unit': false },
		},
	});

	t.assert.strictEqual(linted.results[0].warnings.length, 0);
});

describe('extending a config from process.cwd', () => {
	safeChdir(new URL('.', import.meta.url));

	it('works', async (t) => {
		const linted = await standalone({
			code: 'a { top: 0px; }',
			config: {
				extends: ['./fixtures/config-length-zero-no-unit-true.json'],
			},
		});

		t.assert.strictEqual(linted.results[0].warnings.length, 1);
	});
});

describe('extending a config from options.cwd', () => {
	it('works', async (t) => {
		const linted = await standalone({
			code: 'a { top: 0px; }',
			config: {
				extends: ['./fixtures/config-length-zero-no-unit-true.json'],
			},
			cwd: fileURLToPath(new URL('.', import.meta.url)),
		});

		t.assert.strictEqual(linted.results[0].warnings.length, 1);
	});
});

describe('extending a package installed next to a config file in an ancestor directory', () => {
	let ancestorDir = '';

	beforeEach(() => {
		ancestorDir = fs.mkdtempSync(path.join(os.tmpdir(), 'stylelint-extends-'));

		const packageDir = path.join(ancestorDir, 'node_modules', 'stylelint-config-foo');

		fs.mkdirSync(packageDir, { recursive: true });
		fs.writeFileSync(
			path.join(packageDir, 'package.json'),
			JSON.stringify({ name: 'stylelint-config-foo', main: 'index.js' }),
		);
		fs.writeFileSync(
			path.join(packageDir, 'index.js'),
			'module.exports = { rules: { "block-no-empty": true } };\n',
		);
		fs.writeFileSync(
			path.join(ancestorDir, '.stylelintrc.json'),
			JSON.stringify({ extends: 'stylelint-config-foo' }),
		);
	});

	afterEach(() => {
		fs.rmSync(ancestorDir, { recursive: true, force: true });
	});

	it("resolves the package from the config file's directory", async (t) => {
		const linted = await standalone({
			code: 'a {}',
			codeFilename: path.join(ancestorDir, 'project', 'a.css'),
			cwd: path.dirname(ancestorDir),
		});

		t.assert.strictEqual(linted.results[0].warnings.length, 1);
		t.assert.strictEqual(linted.results[0].warnings[0].rule, 'block-no-empty');
	});

	it('throws when the package is not installed next to the config file', async (t) => {
		fs.rmSync(path.join(ancestorDir, 'node_modules'), { recursive: true, force: true });

		await t.assert.rejects(
			standalone({
				code: 'a {}',
				codeFilename: path.join(ancestorDir, 'project', 'a.css'),
				cwd: path.dirname(ancestorDir),
			}),
			{ message: /Could not find "stylelint-config-foo"/ },
		);
	});
});
