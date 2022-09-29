'use strict';

const path = require('path');
const { mkdir } = require('fs').promises;
const stripAnsi = require('strip-ansi');
const writeFileAtomic = require('write-file-atomic');

/**
 * @param {string} content
 * @param {string} filePath
 * @returns {Promise<void>}
 */
module.exports = async function writeOutputFile(content, filePath) {
	await mkdir(path.dirname(filePath), { recursive: true });

	await writeFileAtomic(path.normalize(filePath), stripAnsi(content));
};
