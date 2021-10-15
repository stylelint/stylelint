'use strict';

const createStylelint = require('./createStylelint');
const globby = require('globby');
const path = require('path');

/** @typedef {import('stylelint').Config} StylelintConfig */

/**
 * @param {import('stylelint').LinterOptions} options
 * @returns {Promise<StylelintConfig | null>}
 */
module.exports = function printConfig({
	code,
	config,
	configBasedir,
	configFile,
	globbyOptions,
	files,
}) {
	const isCodeNotFile = code !== undefined;

	if (!files || files.length !== 1 || isCodeNotFile) {
		return Promise.reject(
			new Error('The --print-config option must be used with exactly one file path.'),
		);
	}

	const filePath = files[0];

	if (globby.hasMagic(filePath)) {
		return Promise.reject(new Error('The --print-config option does not support globs.'));
	}

	const stylelint = createStylelint({
		config,
		configFile,
		configBasedir,
	});

	const cwd = (globbyOptions && globbyOptions.cwd) || process.cwd();
	const absoluteFilePath = !path.isAbsolute(filePath)
		? path.join(cwd, filePath)
		: path.normalize(filePath);

	const configSearchPath = stylelint._options.configFile || absoluteFilePath;

	return stylelint.getConfigForFile(configSearchPath, absoluteFilePath).then((result) => {
		if (result === null) {
			return result;
		}

		return result.config;
	});
};
