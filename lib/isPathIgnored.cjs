'use strict';

const path = require('path');
const micromatch = require('micromatch');
const filterFilePaths = require('./utils/filterFilePaths.cjs');
const getConfigForFile = require('./getConfigForFile.cjs');
const getFileIgnorer = require('./utils/getFileIgnorer.cjs');

/**
 * To find out if a path is ignored, we need to load the config,
 * which may have an ignoreFiles property. We then check the path
 * against these.
 * @param {import('stylelint').InternalApi} stylelint
 * @param {string} [filePath]
 * @return {Promise<boolean>}
 */
async function isPathIgnored(stylelint, filePath) {
	if (!filePath) {
		return false;
	}

	const cwd = stylelint._options.cwd;
	const result = await getConfigForFile(stylelint, filePath, filePath);

	if (!result) {
		return true;
	}

	const ignoreFiles = result.config.ignoreFiles || [];
	const absoluteFilePath = path.isAbsolute(filePath) ? filePath : path.resolve(cwd, filePath);

	if (micromatch([absoluteFilePath], ignoreFiles).length > 0) {
		return true;
	}

	const ignorer = getFileIgnorer(stylelint._options);

	if (filterFilePaths(ignorer, [path.relative(cwd, absoluteFilePath)]).length === 0) {
		return true;
	}

	return false;
}

module.exports = isPathIgnored;