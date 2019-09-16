/* @flow */
'use strict';

const path = require('path');
const stripAnsi = require('strip-ansi');
const writeFileAtomic /*: Function*/ = require('./vendor/writeFileAtomic');
const { promisify } = require('util');
const writeFileAtomicAsync = promisify(writeFileAtomic);

module.exports = (content /*: string*/, filePath /*: string*/) =>
	writeFileAtomicAsync(path.normalize(filePath), stripAnsi(content));
