'use strict';

const createStylelint = require('./createStylelint');
const path = require('path');

/**
 * Resolves the effective configuation for a given file. Resolves to `null` if
 * no config is found.
 * @param {string} filePath The path to the file to get the config for.
 * @param {Pick<
 *   import('stylelint').LinterOptions,
 *   | 'cwd'
 *   | 'config'
 *   | 'configBasedir'
 *   | 'configFile'
 * >} options The options to use when creating the Stylelint instance.
 * @returns {Promise<import('stylelint').Config | null>}
 */
module.exports = function resolveConfig(
	filePath,
	{ cwd = process.cwd(), config, configBasedir, configFile } = {},
) {
	if (!filePath) {
		return Promise.resolve(null);
	}

	const stylelint = createStylelint({
		config,
		configFile,
		configBasedir,
		cwd,
	});

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
