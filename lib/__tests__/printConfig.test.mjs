import { fileURLToPath } from 'node:url';
import pluginWarnAboutFoo from './fixtures/plugin-warn-about-foo.js';
import printConfig from '../printConfig.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';

it('printConfig uses getConfigForFile to retrieve the config', async () => {
	const filepath = replaceBackslashes(
		new URL('./fixtures/getConfigForFile/a/b/foo.css', import.meta.url),
	);

	const result = await printConfig({
		files: [filepath],
	});

	expect(result).toEqual({
		plugins: [fileURLToPath(new URL('./fixtures/plugin-warn-about-foo.js', import.meta.url))],
		rules: {
			'block-no-empty': [true],
			'plugin/warn-about-foo': ['always'],
		},
		pluginFunctions: {
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

	expect(result).toEqual({
		rules: {
			'block-no-empty': [true],
			'color-named': ['never'],
		},
	});
});

it('printConfig with input css should throw', async () => {
	await expect(
		printConfig({
			code: 'a {}',
		}),
	).rejects.toThrow('The --print-config option must be used with exactly one file path.');
});

it('printConfig with no path should throw', async () => {
	await expect(
		printConfig({
			files: [],
		}),
	).rejects.toThrow('The --print-config option must be used with exactly one file path.');
});

it('printConfig with multiple paths should throw', async () => {
	await expect(
		printConfig({
			files: ['./first-path.css', './second-path.css'],
		}),
	).rejects.toThrow('The --print-config option must be used with exactly one file path.');
});

it('printConfig with globs should throw', async () => {
	await expect(
		printConfig({
			files: ['./*.css'],
		}),
	).rejects.toThrow('The --print-config option does not support globs.');
});
