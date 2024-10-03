import customFormatter from './fixtures/custom-formatter.mjs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import postcss from 'postcss';
import postcssPlugin from '../postcssPlugin.mjs';
import readJSONFile from '../testUtils/readJSONFile.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import standalone from '../standalone.mjs';
import stringFormatter from '../formatters/stringFormatter.mjs';
import { stripVTControlCharacters } from 'node:util';

const configBlockNoEmpty = readJSONFile(
	new URL('./fixtures/config-block-no-empty.json', import.meta.url),
);

const fixturesPath = (...elems) =>
	replaceBackslashes(path.join(fileURLToPath(new URL('./fixtures', import.meta.url)), ...elems));

it('standalone with input css and alternate formatter specified by keyword', async () => {
	const { report } = await standalone({
		code: 'a {}',
		config: configBlockNoEmpty,
		formatter: 'string',
	});

	const strippedOutput = stripVTControlCharacters(report);

	expect(strippedOutput).toContain('1:3');
	expect(strippedOutput).toContain('block-no-empty');
});

it('standalone with input css and alternate formatter function', async () => {
	const { report } = await standalone({
		code: 'a {}',
		config: configBlockNoEmpty,
		formatter: stringFormatter,
	});

	const strippedOutput = stripVTControlCharacters(report);

	expect(strippedOutput).toContain('1:3');
	expect(strippedOutput).toContain('block-no-empty');
});

it('standalone with invalid formatter option', async () => {
	await expect(
		standalone({
			code: 'a {}',
			config: configBlockNoEmpty,
			formatter: 'invalid',
		}),
	).rejects.toThrow(
		'You must use a valid formatter option: "compact", "github", "json", "string", "tap", "unix", "verbose" or a function',
	);
});

it('standalone with input css and custom promised formatter', async () => {
	const { report } = await standalone({
		code: 'a {}',
		config: configBlockNoEmpty,
		formatter: Promise.resolve((results) => {
			return results[0].warnings.map((w) => w.rule).join();
		}),
	});

	expect(report).toContain('block-no-empty');
});

it('standalone with formatter specified in configuration', async () => {
	const configWithFormatter = {
		...configBlockNoEmpty,
		formatter: 'string',
	};

	const { report } = await standalone({
		code: 'a {}',
		config: configWithFormatter,
	});

	const strippedOutput = stripVTControlCharacters(report);

	expect(strippedOutput).toContain('1:3');
	expect(strippedOutput).toContain('block-no-empty');
});

it('standalone with formatter argument overriding configuration formatter', async () => {
	const configWithFormatter = {
		...configBlockNoEmpty,
		formatter: 'json',
	};

	const { report } = await standalone({
		code: 'a {}',
		config: configWithFormatter,
		formatter: 'string',
	});

	const strippedOutput = stripVTControlCharacters(report);

	expect(strippedOutput).toContain('1:3');
	expect(strippedOutput).toContain('block-no-empty');
});

it('standalone with custom formatter function specified in configuration', async () => {
	const configWithCustomFormatter = {
		...configBlockNoEmpty,
		formatter: customFormatter,
	};

	const { report } = await standalone({
		code: 'a {}',
		config: configWithCustomFormatter,
	});

	expect(report).toContain('errored: true');
});

it('standalone with custom formatter path specified in configuration', async () => {
	const configWithCustomFormatter = {
		...configBlockNoEmpty,
		formatter: fixturesPath('custom-formatter.mjs'),
	};

	const { report } = await standalone({
		code: 'a {}',
		config: configWithCustomFormatter,
	});

	expect(report).toContain('errored: true');
});

it('standalone without configuration and no formatter argument', async () => {
	return expect(
		postcss([postcssPlugin()]).process('a {}', { from: undefined }),
	).rejects.toMatchObject({
		message: expect.stringMatching('No configuration provided'),
	});
});
