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
module.exports = (content, filePath) =>
	mkdir(path.dirname(filePath), { recursive: true }).then(() =>
		writeFileAtomic(path.normalize(filePath), stripAnsi(content)),
	);
