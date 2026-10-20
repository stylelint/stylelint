import assert from 'node:assert/strict';
import { it } from 'node:test';

import { fileURLToPath } from 'node:url';
import pluginWarnAboutFoo from './fixtures/plugin-warn-about-foo.mjs';
import printConfig from '../printConfig.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';

it('printConfig uses getConfigForFile to retrieve the config', async () => {
	const filepath = replaceBackslashes(
		new URL('./fixtures/getConfigForFile/a/b/foo.css', import.meta.url),
	);

	const result = await printConfig({
		files: [filepath],
	});

	assert.deepEqual(result, {
		plugins: [fileURLToPath(new URL('./fixtures/plugin-warn-about-foo.mjs', import.meta.url))],
		rules: {
			'block-no-empty': [true],
			'plugin/warn-about-foo': ['always'],
		},
		_pluginFunctions: {
			'plugin/warn-about-foo': pluginWarnAboutFoo.rule,
		},
	});
});

it('config overrides should apply', async () => {
	const filepath = replaceBackslashes(
		new URL('./fixtures/config-overrides/testPrintConfig/style.css', import.meta.url),
	);

	const result = await printConfig({
		files: [filepath],
	});

	assert.deepEqual(result, {
		rules: {
			'block-no-empty': [true],
			'color-named': ['never'],
		},
	});
});

it('printConfig with input css should throw', async () => {
	await assert.rejects(
		printConfig({
			code: 'a {}',
		}),
		{ message: 'The --print-config option must be used with exactly one file path.' },
	);
});

it('printConfig with no path should throw', async () => {
	await assert.rejects(
		printConfig({
			files: [],
		}),
		{ message: 'The --print-config option must be used with exactly one file path.' },
	);
});

it('printConfig with multiple paths should throw', async () => {
	await assert.rejects(
		printConfig({
			files: ['./first-path.css', './second-path.css'],
		}),
		{ message: 'The --print-config option must be used with exactly one file path.' },
	);
});

it('printConfig with globs should throw', async () => {
	await assert.rejects(
		printConfig({
			files: ['./*.css'],
		}),
		{ message: 'The --print-config option does not support globs.' },
	);
});

it('printConfig with cwd', async () => {
	const result = await printConfig({
		files: ['a/b/foo.css'],
		cwd: fileURLToPath(new URL('./fixtures/getConfigForFile/', import.meta.url)),
	});

	assert.ok(Object.hasOwn(result, 'rules'));
	assert.ok(Object.hasOwn(result.rules, 'block-no-empty'));
});
