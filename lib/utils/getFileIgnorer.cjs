'use strict';

const node_path = require('node:path');
const node_fs = require('node:fs');
const ignore = require('ignore');
const constants = require('../constants.cjs');
const isPathNotFoundError = require('./isPathNotFoundError.cjs');

/**
 * @typedef {import('stylelint').LinterOptions} LinterOptions
 *
 * @param {Pick<LinterOptions, 'ignorePath' | 'ignorePattern'> & { cwd: string }} options
 * @return {import('ignore').Ignore}
 */
function getFileIgnorer({ ignorePath, ignorePattern, cwd }) {
	const ignorer = ignore();
	const ignorePaths = [ignorePath || []].flat();

	if (ignorePaths.length === 0) {
		ignorePaths.push(constants.DEFAULT_IGNORE_FILENAME);
	}

	for (const ignoreFilePath of ignorePaths) {
		const absoluteIgnoreFilePath = node_path.isAbsolute(ignoreFilePath)
			? ignoreFilePath
			: node_path.resolve(cwd, ignoreFilePath);

		try {
			const ignoreText = node_fs.readFileSync(absoluteIgnoreFilePath, 'utf8');

			ignorer.add(ignoreText);
		} catch (readError) {
			if (!isPathNotFoundError(readError)) {
				throw readError;
			}
		}
	}

	if (ignorePattern) ignorer.add(ignorePattern);

	return ignorer;
}

module.exports = getFileIgnorer;