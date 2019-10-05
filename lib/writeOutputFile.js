'use strict';

const path = require('path');
const writeFileAtomic = require('./vendor/writeFileAtomic');
const { default: stripAnsi } = require('strip-ansi');
const { promisify } = require('util');
/** @type {(path: string, data: string) => Promise<void>} */
const writeFileAtomicAsync = promisify(writeFileAtomic);

/**
 *
 * @param {string} content
 * @param {string} filePath
 * @return {Promise<void>}
 */
module.exports = (content, filePath) =>
	writeFileAtomicAsync(path.normalize(filePath), stripAnsi(content));
