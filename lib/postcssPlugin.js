'use strict';

const path = require('path');

const createStylelint = require('./createStylelint');
const lintSource = require('./lintSource');

/** @typedef {import('stylelint').PostcssPluginOptions} PostcssPluginOptions */
/** @typedef {import('stylelint').Config} StylelintConfig */

/**
 * @type {import('postcss').PluginCreator<PostcssPluginOptions>}
 * */
module.exports = (options = {}) => {
	const [cwd, tailoredOptions] = isConfig(options)
		? [process.cwd(), { config: options }]
		: [options.cwd || process.cwd(), options];
	const stylelint = createStylelint(tailoredOptions);

	return {
		postcssPlugin: 'stylelint',
		Once(root, { result }) {
			let filePath = root.source && root.source.input.file;

			if (filePath && !path.isAbsolute(filePath)) {
				filePath = path.join(cwd, filePath);
			}

			return lintSource(stylelint, {
				filePath,
				existingPostcssResult: result,
			});
		},
	};
};

module.exports.postcss = true;

/**
 * @param {PostcssPluginOptions} options
 * @returns {options is StylelintConfig}
 */
function isConfig(options) {
	return 'rules' in options;
}
