import { fileURLToPath } from 'node:url';

import safeChdir from '../testUtils/safeChdir.js';
import standalone from '../standalone.js';

import configExtendingAnotherExtend from './fixtures/config-extending-another-extend.json';
import configExtendingOne from './fixtures/config-extending-one.json';
import configExtendingThreeWithOverride from './fixtures/config-extending-three-with-override.json';

const fixturesPath = fileURLToPath(new URL('fixtures', import.meta.url));

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
	).rejects.toHaveProperty('code', 78);
});

it('extending a config that is overridden', async () => {
	const linted = await standalone({
		code: 'a { b: "c" }',
		config: {
			extends: [`${fixturesPath}/config-string-quotes-single`],
			rules: { 'string-quotes': 'double' },
		},
	});

	expect(linted.results[0].warnings).toHaveLength(0);
});

describe('extending a config from process.cwd', () => {
	safeChdir(new URL('.', import.meta.url));

	it('works', async () => {
		const linted = await standalone({
			code: 'a { b: "c" }',
			config: {
				extends: ['./fixtures/config-string-quotes-single'],
			},
		});

		expect(linted.results[0].warnings).toHaveLength(1);
	});
});

describe('extending a config from options.cwd', () => {
	it('works', async () => {
		const linted = await standalone({
			code: 'a { b: "c" }',
			config: {
				extends: ['./fixtures/config-string-quotes-single'],
			},
			cwd: fileURLToPath(new URL('.', import.meta.url)),
		});

		expect(linted.results[0].warnings).toHaveLength(1);
	});
});
