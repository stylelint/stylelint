// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const process = require('node:process');
const globby = require('globby');
const resolveConfig = require('./resolveConfig.cjs');

/** @typedef {import('stylelint').Config} StylelintConfig */

/**
 * @param {import('stylelint').LinterOptions} options
 * @returns {Promise<StylelintConfig | null>}
 */
async function printConfig({
	cwd = process.cwd(),
	code,
	config,
	configBasedir,
	configFile,
	globbyOptions,
	files,
}) {
	const isCodeNotFile = code !== undefined;
	const filePath = files && files[0];

	if (!files || files.length !== 1 || !filePath || isCodeNotFile) {
		return Promise.reject(
			new Error('The --print-config option must be used with exactly one file path.'),
		);
	}

	if (globby.hasMagic(filePath)) {
		return Promise.reject(new Error('The --print-config option does not support globs.'));
	}

	return (
		(await resolveConfig(filePath, {
			cwd: (globbyOptions && globbyOptions.cwd) || cwd,
			config,
			configBasedir,
			configFile,
		})) || null
	);
}

module.exports = printConfig;
