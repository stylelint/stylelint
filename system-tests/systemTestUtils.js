'use strict';

const _ = require('lodash');
const path = require('path');
const stripAnsi = require('strip-ansi');

function caseFilePath(caseNumber, fileName) {
	return replaceBackslashes(path.join(__dirname, caseNumber, fileName));
}

function caseStylesheetGlob(caseNumber) {
	return caseFilePath(caseNumber, 'stylesheet.*');
}

function caseConfig(caseNumber, ext) {
	ext = ext || 'json';

	return caseFilePath(caseNumber, `config.${ext}`);
}

function prepResults(results) {
	return results.map((result) => {
		// The _postcssResult object is not part of our API and is huge
		const preppedResult = _.omit(result, '_postcssResult');

		// The `source` of each file will not be the same on different machines or platforms
		preppedResult.source = path
			.relative(__dirname, result.source)
			.replace(new RegExp(`\\${path.sep}`, 'g'), '/');

		return preppedResult;
	});
}

function replaceBackslashes(str) {
  return str.replace(/\\/g, "/");
}

function stripColors(input) {
	return stripAnsi(input);
}

module.exports = {
	caseFilePath,
	replaceBackslashes,
  caseStylesheetGlob,
  caseConfig,
  prepResults,
  stripColors,
};
