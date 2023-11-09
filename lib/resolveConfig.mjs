import { isAbsolute, join, normalize } from 'node:path';
import process from 'node:process';

import createStylelint from './createStylelint.mjs';
import getConfigForFile from './getConfigForFile.mjs';

/**
 * @type {import('stylelint').PublicApi['resolveConfig']}
 */
export default async function resolveConfig(
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

	const absoluteFilePath = !isAbsolute(filePath) ? join(cwd, filePath) : normalize(filePath);

	const configSearchPath = stylelint._options.configFile || absoluteFilePath;

	const resolved = await getConfigForFile(stylelint, configSearchPath, absoluteFilePath);

	if (!resolved) {
		return undefined;
	}

	return resolved.config;
}
