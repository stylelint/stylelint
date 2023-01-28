'use strict';

const micromatch = require('micromatch');
const path = require('path');

const filterFilePaths = require('./utils/filterFilePaths');
const getConfigForFile = require('./getConfigForFile');
const getFileIgnorer = require('./utils/getFileIgnorer');

/**
 * To find out if a path is ignored, we need to load the config,
 * which may have an ignoreFiles property. We then check the path
 * against these.
 * @param {import('stylelint').InternalApi} stylelint
 * @param {string} [filePath]
 * @return {Promise<boolean>}
 */
module.exports = async function isPathIgnored(stylelint, filePath) {
	if (!filePath) {
		return false;
	}

	const cwd = stylelint._options.cwd;
	const ignorer = getFileIgnorer(stylelint._options);

	const result = await getConfigForFile(stylelint, filePath, filePath);

	if (!result) {
		return true;
	}

	const ignoreFiles = result.config.ignoreFiles || [];
	const absoluteFilePath = path.isAbsolute(filePath) ? filePath : path.resolve(cwd, filePath);

	if (micromatch([absoluteFilePath], ignoreFiles).length > 0) {
		return true;
	}

	// Check filePath with .stylelintignore file
	if (filterFilePaths(ignorer, [path.relative(cwd, absoluteFilePath)]).length === 0) {
		return true;
	}

	return false;
};
