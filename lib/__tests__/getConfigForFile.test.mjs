import { fileURLToPath } from 'node:url';
import path from 'node:path';

import createStylelint from '../createStylelint.mjs';
import getConfigForFile from '../getConfigForFile.mjs';
import pluginWarnAboutFoo from './fixtures/plugin-warn-about-foo.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

test('augmented config loads', async () => {
	const stylelint = createStylelint();
	const filepath = path.join(__dirname, 'fixtures/getConfigForFile/a/b/foo.css');

	await expect(getConfigForFile(stylelint, filepath)).resolves.toEqual({
		config: {
			plugins: [path.join(__dirname, '/fixtures/plugin-warn-about-foo.js')],
			rules: {
				'block-no-empty': [true],
				'plugin/warn-about-foo': ['always'],
			},
			pluginFunctions: {
				'plugin/warn-about-foo': pluginWarnAboutFoo.rule,
			},
		},
		filepath: path.join(__dirname, 'fixtures/getConfigForFile/a/.stylelintrc'),
	});
});
