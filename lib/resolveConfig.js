'use strict';

const path = require('path');

const createStylelint = require('./createStylelint');
const getConfigForFile = require('./getConfigForFile');

/**
 * @type {import('stylelint')['resolveConfig']}
 */
module.exports = async function resolveConfig(
	filePath,
	{ cwd = process.cwd(), config, configBasedir, configFile } = {},
) {
	if (!filePath) {
		return undefined;
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

	const resolved = await getConfigForFile(stylelint, configSearchPath, absoluteFilePath);

	if (!resolved) {
		return undefined;
	}

	return resolved.config;
};
