// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const path = require('node:path');
const process = require('node:process');
const createStylelint = require('./createStylelint.cjs');
const getConfigForFile = require('./getConfigForFile.cjs');

/**
 * @type {import('stylelint').PublicApi['resolveConfig']}
 */
async function resolveConfig(
	filePath,
	{
		cwd = process.cwd(),
		config = undefined,
		configBasedir = undefined,
		configFile = undefined,
	} = {},
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

	const absoluteFilePath = !path.isAbsolute(filePath) ? path.join(cwd, filePath) : path.normalize(filePath);

	const configSearchPath = stylelint._options.configFile || absoluteFilePath;

	const resolved = await getConfigForFile(stylelint, configSearchPath, absoluteFilePath);

	if (!resolved) {
		return undefined;
	}

	return resolved.config;
}

module.exports = resolveConfig;
