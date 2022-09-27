'use strict';

const debug = require('debug')('stylelint:file-cache');
const fileEntryCache = require('file-entry-cache');
const getCacheFile = require('./getCacheFile');
const hash = require('./hash');
const pkg = require('../../package.json');
const path = require('path');

const CACHE_STRATEGY_METADATA = 'metadata';
const CACHE_STRATEGY_CONTENT = 'content';

const DEFAULT_CACHE_LOCATION = './.stylelintcache';
const DEFAULT_CACHE_STRATEGY = CACHE_STRATEGY_METADATA;

/** @typedef {import('file-entry-cache').FileDescriptor["meta"] & { hashOfConfig?: string }} CacheMetadata */

class FileCache {
	constructor(
		cacheLocation = DEFAULT_CACHE_LOCATION,
		cacheStrategy = DEFAULT_CACHE_STRATEGY,
		cwd = process.cwd(),
	) {
		if (![CACHE_STRATEGY_METADATA, CACHE_STRATEGY_CONTENT].includes(cacheStrategy)) {
			throw new Error(
				`"${cacheStrategy}" cache strategy is unsupported. Specify either "${CACHE_STRATEGY_METADATA}" or "${CACHE_STRATEGY_CONTENT}"`,
			);
		}

		const cacheFile = path.resolve(getCacheFile(cacheLocation, cwd));
		const useCheckSum = cacheStrategy === CACHE_STRATEGY_CONTENT;

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
