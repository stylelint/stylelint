'use strict';

const createStylelint = require('./createStylelint');
const path = require('path');

/** @typedef {import('stylelint').PostcssPluginOptions} PostcssPluginOptions */
/** @typedef {import('stylelint').Config} StylelintConfig */

/**
 * @type {import('postcss').PluginCreator<PostcssPluginOptions>}
 * */
module.exports = (options = {}) => {
	const tailoredOptions = isConfig(options) ? { config: options } : options;
	const stylelint = createStylelint(tailoredOptions);

	return {
		postcssPlugin: 'stylelint',
		Once(root, { result }) {
			let filePath = root.source && root.source.input.file;

			if (filePath && !path.isAbsolute(filePath)) {
				filePath = path.join(process.cwd(), filePath);
			}

			return stylelint._lintSource({
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
