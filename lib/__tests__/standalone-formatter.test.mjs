import { it } from 'node:test';

import customFormatter from './fixtures/custom-formatter.mjs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import postcss from 'postcss';
import postcssPlugin from '../postcssPlugin.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import standalone from '../standalone.mjs';
import stringFormatter from '../formatters/stringFormatter.mjs';
import { stripVTControlCharacters } from 'node:util';

import configBlockNoEmpty from './fixtures/config-block-no-empty.json' with { type: 'json' };

const fixturesPath = (...elems) =>
	replaceBackslashes(path.join(fileURLToPath(new URL('./fixtures', import.meta.url)), ...elems));

it('standalone with input css and alternate formatter specified by keyword', async (t) => {
	const { report } = await standalone({
		code: 'a {}',
		config: configBlockNoEmpty,
		formatter: 'string',
	});

	const strippedOutput = stripVTControlCharacters(report);

	t.assert.ok(strippedOutput.includes('1:3'));
	t.assert.ok(strippedOutput.includes('block-no-empty'));
});

it('standalone with input css and alternate formatter function', async (t) => {
	const { report } = await standalone({
		code: 'a {}',
		config: configBlockNoEmpty,
		formatter: stringFormatter,
	});

	const strippedOutput = stripVTControlCharacters(report);

	t.assert.ok(strippedOutput.includes('1:3'));
	t.assert.ok(strippedOutput.includes('block-no-empty'));
});

it('standalone with invalid formatter option', async (t) => {
	await t.assert.rejects(
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

it('standalone with removed "github" formatter option', async (t) => {
	await t.assert.rejects(
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

it('standalone with input css and custom promised formatter', async (t) => {
	const { report } = await standalone({
		code: 'a {}',
		config: configBlockNoEmpty,
		formatter: Promise.resolve((results) => {
			return results[0].warnings.map((w) => w.rule).join();
		}),
	});

	t.assert.ok(report.includes('block-no-empty'));
});

it('standalone with formatter specified in configuration', async (t) => {
	const configWithFormatter = {
		...configBlockNoEmpty,
		formatter: 'string',
	};

	const { report } = await standalone({
		code: 'a {}',
		config: configWithFormatter,
	});

	const strippedOutput = stripVTControlCharacters(report);

	t.assert.ok(strippedOutput.includes('1:3'));
	t.assert.ok(strippedOutput.includes('block-no-empty'));
});

it('standalone with formatter argument overriding configuration formatter', async (t) => {
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

	t.assert.ok(strippedOutput.includes('1:3'));
	t.assert.ok(strippedOutput.includes('block-no-empty'));
});

it('standalone with custom formatter function specified in configuration', async (t) => {
	const configWithCustomFormatter = {
		...configBlockNoEmpty,
		formatter: customFormatter,
	};

	const { report } = await standalone({
		code: 'a {}',
		config: configWithCustomFormatter,
	});

	t.assert.ok(report.includes('errored: true'));
});

it('standalone with custom formatter path specified in configuration', async (t) => {
	const configWithCustomFormatter = {
		...configBlockNoEmpty,
		formatter: fixturesPath('custom-formatter.mjs'),
	};

	const { report } = await standalone({
		code: 'a {}',
		config: configWithCustomFormatter,
	});

	t.assert.ok(report.includes('errored: true'));
});

it('standalone without configuration and no formatter argument', async (t) => {
	await t.assert.rejects(postcss([postcssPlugin()]).process('a {}', { from: undefined }), {
		message: /No configuration provided/,
	});
});

it('standalone passes the color option to the formatter', async (t) => {
	const lintWithColor = (color) =>
		standalone({
			code: 'a {}',
			config: configBlockNoEmpty,
			formatter: (results, returnValue) => String(returnValue.color),
			color,
		});

	t.assert.strictEqual((await lintWithColor(true)).report, 'true');
	t.assert.strictEqual((await lintWithColor(false)).report, 'false');
});

it('standalone omits the color option from the return value when not set', async (t) => {
	const { report } = await standalone({
		code: 'a {}',
		config: configBlockNoEmpty,
		formatter: (results, returnValue) => String(Object.hasOwn(returnValue, 'color')),
	});

	t.assert.strictEqual(report, 'false');
});
