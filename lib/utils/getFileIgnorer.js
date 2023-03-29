'use strict';
// Try to get file ignorer from '.stylelintignore'

const fs = require('fs');
const path = require('path');
const { default: ignore } = require('ignore');

const isPathNotFoundError = require('./isPathNotFoundError');

const DEFAULT_IGNORE_FILENAME = '.stylelintignore';

/**
 * @typedef {import('stylelint').LinterOptions} LinterOptions
 *
 * @param {Pick<LinterOptions, 'ignorePath' | 'ignorePattern'> & { cwd: string }} options
 * @return {import('ignore').Ignore}
 */
module.exports = function getFileIgnorer({ ignorePath, ignorePattern, cwd }) {
	const ignorer = ignore();
	const ignorePaths = [ignorePath || []].flat();

	if (ignorePaths.length === 0) {
		ignorePaths.push(DEFAULT_IGNORE_FILENAME);
	}

	for (const ignoreFilePath of ignorePaths) {
		const absoluteIgnoreFilePath = path.isAbsolute(ignoreFilePath)
			? ignoreFilePath
			: path.resolve(cwd, ignoreFilePath);

		try {
			const ignoreText = fs.readFileSync(absoluteIgnoreFilePath, 'utf8');

			ignorer.add(ignoreText);
		} catch (readError) {
			if (!isPathNotFoundError(readError)) {
				throw readError;
			}
		}
	}

	if (ignorePattern) ignorer.add(ignorePattern);

	return ignorer;
};
