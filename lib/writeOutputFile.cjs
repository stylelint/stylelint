'use strict';

const node_path = require('node:path');
const promises = require('node:fs/promises');
const stripAnsi = require('strip-ansi');
const writeFileAtomic = require('write-file-atomic');

const _interopDefault = e => e && e.__esModule ? e : { default: e };

const stripAnsi__default = /*#__PURE__*/_interopDefault(stripAnsi);
const writeFileAtomic__default = /*#__PURE__*/_interopDefault(writeFileAtomic);

/**
 * @param {string} content
 * @param {string} filePath
 * @returns {Promise<void>}
 */
async function writeOutputFile(content, filePath) {
	await promises.mkdir(node_path.dirname(filePath), { recursive: true });

	await writeFileAtomic__default.default(node_path.normalize(filePath), stripAnsi__default.default(content));
}

module.exports = writeOutputFile;
