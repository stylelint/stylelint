'use strict';

const node_path = require('node:path');
const process = require('node:process');
const createStylelint = require('./createStylelint.cjs');
const validateTypes = require('./utils/validateTypes.cjs');
const lintSource = require('./lintSource.cjs');

/** @typedef {import('stylelint').PostcssPluginOptions} PostcssPluginOptions */
/** @typedef {import('stylelint').Config} StylelintConfig */

/**
 * @type {import('postcss').PluginCreator<PostcssPluginOptions>}
 */
function postcssPlugin(options = {}) {
	const [cwd, tailoredOptions] = isConfig(options)
		? [process.cwd(), { config: options }]
		: [('cwd' in options && validateTypes.isString(options.cwd) && options.cwd) || process.cwd(), options];
	const stylelint = createStylelint(tailoredOptions);

	return {
		postcssPlugin: 'stylelint',

		/**
		 * @param {import('postcss').Root} root
		 * @param {import('postcss').Helpers} helpers
		 * @returns {Promise<void>}
		 */
		async Once(root, { result }) {
			let filePath = root.source && root.source.input.file;

			if (filePath && !node_path.isAbsolute(filePath)) {
				filePath = node_path.join(cwd, filePath);
			}

			await lintSource(stylelint, {
				filePath,
				existingPostcssResult: result,
			});
		},
	};
}

postcssPlugin.postcss = true;

/**
 * @param {PostcssPluginOptions} options
 * @returns {options is StylelintConfig}
 */
function isConfig(options) {
	return 'rules' in options;
}

module.exports = postcssPlugin;
