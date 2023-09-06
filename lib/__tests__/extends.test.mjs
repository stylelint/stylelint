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
	const linted = await standalone({
		code: 'a {}',
		config: configExtendingOne,
		configBasedir: fixturesPath,
	});

	expect(typeof linted.output).toBe('string');
	expect(linted.results).toHaveLength(1);
	expect(linted.results[0].warnings).toHaveLength(1);
	expect(linted.results[0].warnings[0].rule).toBe('block-no-empty');
});

it('basic extending with object', async () => {
	const linted = await standalone({
		code: 'a {}',
		config: configExtendingWithObject,
		configBasedir: fixturesPath,
	});

	expect(typeof linted.output).toBe('string');
	expect(linted.results).toHaveLength(1);
	expect(linted.results[0].warnings).toHaveLength(1);
	expect(linted.results[0].warnings[0].rule).toBe('block-no-empty');
});

it('recursive extending', async () => {
	const linted = await standalone({
		code: 'a {}',
		config: configExtendingAnotherExtend,
		configBasedir: fixturesPath,
	});

	expect(typeof linted.output).toBe('string');
	expect(linted.results).toHaveLength(1);
	expect(linted.results[0].warnings).toHaveLength(1);
	expect(linted.results[0].warnings[0].rule).toBe('block-no-empty');
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
			extends: [`${fixturesPath}/config-length-zero-no-unit-true`],
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
				extends: ['./fixtures/config-length-zero-no-unit-true'],
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
				extends: ['./fixtures/config-length-zero-no-unit-true'],
			},
			cwd: fileURLToPath(new URL('.', import.meta.url)),
		});

		expect(linted.results[0].warnings).toHaveLength(1);
	});
});
