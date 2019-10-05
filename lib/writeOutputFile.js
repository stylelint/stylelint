'use strict';

const path = require('path');
// TODO TYPES found out how to map from {default:...}
const stripAnsi = require('strip-ansi');
const writeFileAtomic = require('./vendor/writeFileAtomic');
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
