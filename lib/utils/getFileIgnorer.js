'use strict';
// Try to get file ignorer from '.stylelintignore'

const fs = require('fs');
const path = require('path');
const { default: ignore } = require('ignore');

const isPathNotFoundError = require('./isPathNotFoundError');

const DEFAULT_IGNORE_FILENAME = '.stylelintignore';

/** @typedef {import('stylelint').LinterOptions} StylelintOptions */

/**
 * @param {StylelintOptions} options
 * @return {import('ignore').Ignore}
 */
module.exports = function (options) {
	const ignoreFilePath = options.ignorePath || DEFAULT_IGNORE_FILENAME;
	const absoluteIgnoreFilePath = path.isAbsolute(ignoreFilePath)
		? ignoreFilePath
		: path.resolve(process.cwd(), ignoreFilePath);
	let ignoreText = '';

	try {
		ignoreText = fs.readFileSync(absoluteIgnoreFilePath, 'utf8');
	} catch (readError) {
		if (!isPathNotFoundError(readError)) throw readError;
	}

	const ignorePattern = options.ignorePattern || [];
	const ignorer = ignore().add(ignoreText).add(ignorePattern);

	return ignorer;
};
