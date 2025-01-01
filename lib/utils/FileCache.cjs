// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const process = require('node:process');
const node_fs = require('node:fs');
const node_path = require('node:path');
const createDebug = require('debug');
const fileEntryCache = require('file-entry-cache');
const constants = require('../constants.cjs');
const getCacheFile = require('./getCacheFile.cjs');
const hash = require('./hash.cjs');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
const debug = createDebug('stylelint:file-cache');

const pkg = JSON.parse(node_fs.readFileSync(new URL('../../package.json', (typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('lib/utils/FileCache.cjs', document.baseURI).href))), 'utf8'));

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

		const cacheFile = node_path.resolve(getCacheFile(cacheLocation, cwd));
		const useCheckSum = cacheStrategy === constants.CACHE_STRATEGY_CONTENT;

		debug(`Cache file is created at ${cacheFile}`);
		this._fileCache = fileEntryCache.createFromFile(cacheFile, useCheckSum, undefined);
		this._hashOfConfig = '';
		this._useCheckSum = useCheckSum;
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
	 * @returns {boolean}
	 */
	hasFileChanged(absoluteFilepath) {
		// Get file descriptor compares current metadata against cached
		// one and stores the result to "changed" prop.w

		/** @type {import('file-entry-cache').FileDescriptorMeta | undefined} */
		const metaCache = this._fileCache.cache.getKey(this._fileCache.createFileKey(absoluteFilepath));
		const descriptor = this._fileCache.getFileDescriptor(absoluteFilepath);

		/** @type {{ hashOfConfig?: string; }} */
		const metadata = (descriptor.meta.data ??= {});

		const configChanged = metadata.hashOfConfig !== this._hashOfConfig;

		let changed;

		if (this._useCheckSum) {
			changed = configChanged || !metaCache?.hash || metaCache.hash !== descriptor.meta.hash;
		} else {
			changed = configChanged || Boolean(descriptor.changed);
		}

		if (!changed) {
			debug(`Skip linting ${absoluteFilepath}. File hasn't changed.`);
		}

		// Mutate file descriptor object and store config hash to each file.
		// Running lint with different config should invalidate the cache.
		if (metadata.hashOfConfig !== this._hashOfConfig) {
			metadata.hashOfConfig = this._hashOfConfig;
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
