'use strict';
// Try to get file ignorer from '.stylelintignore'

const fs = require('fs');
const path = require('path');
const { default: ignore } = require('ignore');

const isPathNotFoundError = require('./isPathNotFoundError');

const DEFAULT_IGNORE_FILENAME = '.stylelintignore';

/**
 * @param {{ cwd: string, ignorePath?: string, ignorePattern?: string[] }} options
 * @return {import('ignore').Ignore}
 */
module.exports = function getFileIgnorer(options) {
	const ignoreFilePath = options.ignorePath || DEFAULT_IGNORE_FILENAME;
	const absoluteIgnoreFilePath = path.isAbsolute(ignoreFilePath)
		? ignoreFilePath
		: path.resolve(options.cwd, ignoreFilePath);
	let ignoreText = '';

	try {
		ignoreText = fs.readFileSync(absoluteIgnoreFilePath, 'utf8');
	} catch (readError) {
		if (!isPathNotFoundError(readError)) {
			throw readError;
		}
	}

	return ignore()
		.add(ignoreText)
		.add(options.ignorePattern || []);
};
