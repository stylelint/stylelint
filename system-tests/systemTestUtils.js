'use strict';

const _ = require('lodash');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { promisify } = require('util');

const replaceBackslashes = require('../lib/testUtils/replaceBackslashes');

const copyFile = promisify(fs.copyFile);
const readFile = promisify(fs.readFile);

function caseFilePath(caseNumber, fileName = 'stylesheet') {
	return replaceBackslashes(path.join(__dirname, caseNumber, fileName));
}

function caseFiles(caseNumber) {
	return caseFilePath(caseNumber, 'stylesheet.*');
}

function caseConfigFile(caseNumber, ext = 'json') {
	return caseFilePath(caseNumber, `config.${ext}`);
}

async function caseConfig(caseNumber) {
	return JSON.parse(await readFile(caseConfigFile(caseNumber, 'json'), 'utf8'));
}

async function caseCode(caseNumber, ext = 'css') {
	return await readFile(`${caseFilePath(caseNumber)}.${ext}`, 'utf8');
}

async function caseFilesForFix(caseNumber, ext = 'css') {
	const tempPath = replaceBackslashes(path.join(os.tmpdir(), `stylesheet-${_.uniqueId()}.${ext}`));

	await copyFile(path.join(__dirname, caseNumber, `stylesheet.${ext}`), tempPath);

	return tempPath;
}

function prepForSnapshot({ results, output, ...rest }) {
	// If output isn't fixed code
	if (output.startsWith('[')) {
		// The `source` of each file varies between platforms or if a tmp file is used
		output = JSON.parse(output).map((warning) => {
			delete warning.source;

			return warning;
		});
	}

	return {
		// The _postcssResult object is not part of our API and is huge
		results: results.map(({ _postcssResult, ...rest }) => {
			delete rest.source;

			return rest;
		}),
		output,
		...rest,
	};
}

module.exports = {
	caseCode,
	caseConfig,
	caseConfigFile,
	caseFilePath,
	caseFilesForFix,
	caseFiles,
	prepForSnapshot,
};
