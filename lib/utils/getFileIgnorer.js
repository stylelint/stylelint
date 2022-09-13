'use strict';
// Try to get file ignorer from '.stylelintignore'

const fs = require('fs');
const path = require('path');
const { default: ignore } = require('ignore');

const isPathNotFoundError = require('./isPathNotFoundError');

const DEFAULT_IGNORE_FILENAME = '.stylelintignore';

/**
 * @param {{ cwd: string, ignorePath?: string | string[], ignorePattern?: string[] }} options
 * @return {import('ignore').Ignore}
 */
module.exports = function getFileIgnorer(options) {
	const ignorer = ignore();
	const ignorePaths = [options.ignorePath || []].flat();

	if (ignorePaths.length === 0) {
		ignorePaths.push(DEFAULT_IGNORE_FILENAME);
	}

	for (const ignoreFilePath of ignorePaths) {
		const absoluteIgnoreFilePath = path.isAbsolute(ignoreFilePath)
			? ignoreFilePath
			: path.resolve(options.cwd, ignoreFilePath);

		try {
			const ignoreText = fs.readFileSync(absoluteIgnoreFilePath, 'utf8');

			ignorer.add(ignoreText);
		} catch (readError) {
			if (!isPathNotFoundError(readError)) {
				throw readError;
			}
		}
	}

	ignorer.add(options.ignorePattern || []);

	return ignorer;
};
