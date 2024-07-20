// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const process = require('node:process');
const fs = require('node:fs');
const path = require('node:path');
const createDebug = require('debug');
const fileEntryCache = require('file-entry-cache');
const constants = require('../constants.cjs');
const getCacheFile = require('./getCacheFile.cjs');
const hash = require('./hash.cjs');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
const debug = createDebug('stylelint:file-cache');

const pkg = JSON.parse(fs.readFileSync(new URL('../../package.json', (typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.src || new URL('lib/utils/FileCache.cjs', document.baseURI).href))), 'utf8'));

/** @typedef {import('file-entry-cache').FileDescriptor["meta"] & { hashOfConfig?: string }} CacheMetadata */

class FileCache {
	constructor(
		cacheLocation = constants.DEFAULT_CACHE_LOCATION,
		cacheStrategy = constants.DEFAULT_CACHE_STRATEGY,
		cwd = process.cwd(),
	) {
		if (![constants.CACHE_STRATEGY_METADATA, constants.CACHE_STRATEGY_CONTENT].includes(cacheStrategy)) {
			throw new Error(
				`"${cacheStrategy}" cache strategy is unsupported. Specify either "${constants.CACHE_STRATEGY_METADATA}" or "${constants.CACHE_STRATEGY_CONTENT}"`,
			);
		}

		const cacheFile = path.resolve(getCacheFile(cacheLocation, cwd));
		const useCheckSum = cacheStrategy === constants.CACHE_STRATEGY_CONTENT;

		debug(`Cache file is created at ${cacheFile}`);
		this._fileCache = fileEntryCache.create(cacheFile, undefined, useCheckSum);
		this._hashOfConfig = '';
	}

	/**
	 * @param {import('stylelint').Config} config
	 */
	calcHashOfConfig(config) {
		if (this._hashOfConfig) return;

		const stylelintVersion = pkg.version;
		const configString = JSON.stringify(config || {});

		this._hashOfConfig = hash(`${stylelintVersion}_${configString}`);
	}

	/**
	 * @param {string} absoluteFilepath
	 * @return {boolean}
	 */
	hasFileChanged(absoluteFilepath) {
		// Get file descriptor compares current metadata against cached
		// one and stores the result to "changed" prop.w
		const descriptor = this._fileCache.getFileDescriptor(absoluteFilepath);
		/** @type {CacheMetadata} */
		const meta = descriptor.meta || {};
		const changed = descriptor.changed || meta.hashOfConfig !== this._hashOfConfig;

		if (!changed) {
			debug(`Skip linting ${absoluteFilepath}. File hasn't changed.`);
		}

		// Mutate file descriptor object and store config hash to each file.
		// Running lint with different config should invalidate the cache.
		if (meta.hashOfConfig !== this._hashOfConfig) {
			meta.hashOfConfig = this._hashOfConfig;
		}

		return changed;
	}

	reconcile() {
		this._fileCache.reconcile();
	}

	destroy() {
		this._fileCache.destroy();
	}

	/**
	 * @param {string} absoluteFilepath
	 */
	removeEntry(absoluteFilepath) {
		this._fileCache.removeEntry(absoluteFilepath);
	}
}

module.exports = FileCache;
