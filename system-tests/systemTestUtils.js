'use strict';

const path = require('path');
const stripAnsi = require('strip-ansi');

function caseFilePath(caseNumber, fileName) {
	return path.join(__dirname, caseNumber, fileName);
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
		// eslint-disable-next-line no-unused-vars
		const { _postcssResult, source, ...preppedResult } = result;

		// The `source` of each file will not be the same on different machines or platforms
		preppedResult.source = path
			.relative(__dirname, source)
			.replace(new RegExp(`\\${path.sep}`, 'g'), '/');

		return preppedResult;
	});
}

function stripColors(input) {
	return stripAnsi(input);
}

module.exports = {
	caseFilePath,
	caseStylesheetGlob,
	caseConfig,
	prepResults,
	stripColors,
};
