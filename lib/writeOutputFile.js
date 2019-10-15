/* @flow */
'use strict';

const path = require('path');
const writeFileAtomic /*: Function*/ = require('./vendor/writeFileAtomic');
const { default: stripAnsi } = require('strip-ansi');
const { promisify } = require('util');

/**
 * @typedef {Object} WriteFileAtomicOptions
 * @property {{uid: number, gid: number}} chown
 * @property {string | null} [encoding='utf8']
 * @property {boolean} [fsync=true]
 * @property {number} [mode]
 * @property {Function} [tmpfileCreated]
 */

/**
 * @type {((
 *  filename: string,
 *  data: string | Buffer,
 *  options?: string | WriteFileAtomicOptions
 *  ) => Promise<Error | undefined>)}
 */
const writeFileAtomicAsync = promisify(writeFileAtomic);

/**
 * @param {string} content
 * @param {string} filePath
 * @returns {Promise<Error | undefined>}
 */
module.exports = (content /*: string*/, filePath /*: string*/) =>
	writeFileAtomicAsync(path.normalize(filePath), stripAnsi(content));
