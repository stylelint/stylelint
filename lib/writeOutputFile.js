/* @flow */
'use strict';

const path = require('path');
const writeFileAtomic = require('write-file-atomic');
const { default: stripAnsi } = require('strip-ansi');

/**
 * @param {string} content
 * @param {string} filePath
 * @returns {Promise<Error | undefined>}
 */
module.exports = (content /*: string*/, filePath /*: string*/) =>
	writeFileAtomic(path.normalize(filePath), stripAnsi(content));
