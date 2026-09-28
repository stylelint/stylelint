import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { fileURLToPath } from 'node:url';

import { EXIT_CODE_INVALID_CONFIG } from '../constants.mjs';
import configExtendingWithObject from './fixtures/config-extending-with-object.mjs';
import readJSONFile from '../testUtils/readJSONFile.mjs';
import safeChdir from '../testUtils/safeChdir.mjs';
import standalone from '../standalone.mjs';

const configExtendingAnotherExtend = readJSONFile(
	new URL('./fixtures/config-extending-another-extend.json', import.meta.url),
);
const configExtendingOne = readJSONFile(
	new URL('./fixtures/config-extending-one.json', import.meta.url),
);
const configExtendingThreeWithOverride = readJSONFile(
	new URL('./fixtures/config-extending-three-with-override.json', import.meta.url),
);

const fixturesPath = fileURLToPath(new URL('./fixtures', import.meta.url));

it('basic extending', async () => {
	const { report, results } = await standalone({
		code: 'a {}',
		config: configExtendingOne,
		configBasedir: fixturesPath,
	});

	expect(report).toContain('block-no-empty');
	expect(results).toHaveLength(1);
	expect(results[0].warnings).toHaveLength(1);
	expect(results[0].warnings[0].rule).toBe('block-no-empty');
});

it('basic extending with object', async () => {
	const { report, results } = await standalone({
		code: 'a {}',
		config: configExtendingWithObject,
		configBasedir: fixturesPath,
	});

	expect(report).toContain('block-no-empty');
	expect(results).toHaveLength(1);
	expect(results[0].warnings).toHaveLength(1);
	expect(results[0].warnings[0].rule).toBe('block-no-empty');
});

it('recursive extending', async () => {
	const { report, results } = await standalone({
		code: 'a {}',
		config: configExtendingAnotherExtend,
		configBasedir: fixturesPath,
	});

	expect(report).toContain('block-no-empty');
	expect(results).toHaveLength(1);
	expect(results[0].warnings).toHaveLength(1);
	expect(results[0].warnings[0].rule).toBe('block-no-empty');
});

it('extending with overrides', async () => {
	const linted = await standalone({
		code: 'a {}',
		config: configExtendingThreeWithOverride,
		configBasedir: fixturesPath,
	});

	expect(linted.results[0].warnings).toHaveLength(0);
});

it('extending configuration and no configBasedir', () => {
	return expect(
		standalone({
			code: 'a {}',
			config: configExtendingOne,
		}),
	).rejects.toHaveProperty('code', EXIT_CODE_INVALID_CONFIG);
});

it('extending a config that is overridden', async () => {
	const linted = await standalone({
		code: 'a { top: 0px; }',
		config: {
			extends: [path.join(fixturesPath, 'config-length-zero-no-unit-true.json')],
			rules: { 'length-zero-no-unit': false },
		},
	});

	expect(linted.results[0].warnings).toHaveLength(0);
});

describe('extending a config from process.cwd', () => {
	safeChdir(new URL('.', import.meta.url));

	it('works', async () => {
		const linted = await standalone({
			code: 'a { top: 0px; }',
			config: {
				extends: ['./fixtures/config-length-zero-no-unit-true.json'],
			},
		});

		expect(linted.results[0].warnings).toHaveLength(1);
	});
});

describe('extending a config from options.cwd', () => {
	it('works', async () => {
		const linted = await standalone({
			code: 'a { top: 0px; }',
			config: {
				extends: ['./fixtures/config-length-zero-no-unit-true.json'],
			},
			cwd: fileURLToPath(new URL('.', import.meta.url)),
		});

		expect(linted.results[0].warnings).toHaveLength(1);
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

	it("resolves the package from the config file's directory", async () => {
		const linted = await standalone({
			code: 'a {}',
			codeFilename: path.join(ancestorDir, 'project', 'a.css'),
			cwd: os.tmpdir(),
		});

		expect(linted.results[0].warnings).toHaveLength(1);
		expect(linted.results[0].warnings[0].rule).toBe('block-no-empty');
	});
});
