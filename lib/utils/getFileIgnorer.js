'use strict';
// Try to get file ignorer from '.stylelintignore'

const fs = require('fs');
const ignore = require('ignore');
const path = require('path');

const DEFAULT_IGNORE_FILENAME = '.stylelintignore';
const FILE_NOT_FOUND_ERROR_CODE = 'ENOENT';

module.exports = function(options /*: stylelint$standaloneOptions */) {
	const ignoreFilePath = options.ignorePath || DEFAULT_IGNORE_FILENAME;
	const absoluteIgnoreFilePath = path.isAbsolute(ignoreFilePath)
		? ignoreFilePath
		: path.resolve(process.cwd(), ignoreFilePath);
	let ignoreText = '';

	try {
		ignoreText = fs.readFileSync(absoluteIgnoreFilePath, 'utf8');
	} catch (readError) {
		if (readError.code !== FILE_NOT_FOUND_ERROR_CODE) throw readError;
	}

	const ignorePattern = options.ignorePattern || [];
	const ignorer = ignore()
		.add(ignoreText)
		.add(ignorePattern);

	return ignorer;
};
