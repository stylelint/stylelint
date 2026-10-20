import assert from 'node:assert/strict';
import { it } from 'node:test';

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

	assert.ok(strippedOutput.includes('1:3'));
	assert.ok(strippedOutput.includes('block-no-empty'));
});

it('standalone with input css and alternate formatter function', async () => {
	const { report } = await standalone({
		code: 'a {}',
		config: configBlockNoEmpty,
		formatter: stringFormatter,
	});

	const strippedOutput = stripVTControlCharacters(report);

	assert.ok(strippedOutput.includes('1:3'));
	assert.ok(strippedOutput.includes('block-no-empty'));
});

it('standalone with invalid formatter option', async () => {
	await assert.rejects(
		standalone({
			code: 'a {}',
			config: configBlockNoEmpty,
			formatter: 'invalid',
		}),
		{
			message:
				'You must use a valid formatter option: "compact", "json", "string", "tap", "unix", "verbose" or a function',
		},
	);
});

it('standalone with removed "github" formatter option', async () => {
	await assert.rejects(
		standalone({
			code: 'a {}',
			config: configBlockNoEmpty,
			formatter: 'github',
		}),
		{
			message:
				'You must use a valid formatter option: "compact", "json", "string", "tap", "unix", "verbose" or a function',
		},
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

	assert.ok(report.includes('block-no-empty'));
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

	assert.ok(strippedOutput.includes('1:3'));
	assert.ok(strippedOutput.includes('block-no-empty'));
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

	assert.ok(strippedOutput.includes('1:3'));
	assert.ok(strippedOutput.includes('block-no-empty'));
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

	assert.ok(report.includes('errored: true'));
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

	assert.ok(report.includes('errored: true'));
});

it('standalone without configuration and no formatter argument', async () => {
	await assert.rejects(postcss([postcssPlugin()]).process('a {}', { from: undefined }), {
		message: /No configuration provided/,
	});
});

it('standalone passes the color option to the formatter', async () => {
	const lintWithColor = (color) =>
		standalone({
			code: 'a {}',
			config: configBlockNoEmpty,
			formatter: (results, returnValue) => String(returnValue.color),
			color,
		});

	assert.equal((await lintWithColor(true)).report, 'true');
	assert.equal((await lintWithColor(false)).report, 'false');
});

it('standalone omits the color option from the return value when not set', async () => {
	const { report } = await standalone({
		code: 'a {}',
		config: configBlockNoEmpty,
		formatter: (results, returnValue) => String(Object.hasOwn(returnValue, 'color')),
	});

	assert.equal(report, 'false');
});
