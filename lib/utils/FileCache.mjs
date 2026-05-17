import { readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import process from 'node:process';
import { resolve } from 'node:path';

import createDebug from 'debug';

import {
	CACHE_STRATEGY_CONTENT,
	CACHE_STRATEGY_METADATA,
	DEFAULT_CACHE_LOCATION,
	DEFAULT_CACHE_STRATEGY,
} from '../constants.mjs';
import hash from './hash.mjs';
import resolveFilePath from './resolveFilePath.mjs';

const debug = createDebug('stylelint:file-cache');
const require = createRequire(import.meta.url);

/** @type {import('file-entry-cache') | undefined} */
let fileEntryCache;

/** @type {string | undefined} */
let stylelintVersion;

/**
 * @returns {import('file-entry-cache')}
 */
function getFileEntryCache() {
	return (fileEntryCache ??= require('file-entry-cache'));
}

/**
 * @returns {string}
 */
function getStylelintVersion() {
	return (stylelintVersion ??= JSON.parse(
		readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
	).version);
}

export default class FileCache {
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

		const cacheFile = resolve(resolveFilePath(cacheLocation, cwd, `.stylelintcache_${hash(cwd)}`));
		const useCheckSum = cacheStrategy === CACHE_STRATEGY_CONTENT;

		debug(`Cache file is created at ${cacheFile}`);

		this._cacheFile = cacheFile;
		this._useCheckSum = useCheckSum;

		/** @type {import('file-entry-cache').FileEntryCache | undefined} */
		this._fileCache = undefined;

		this._hashOfConfig = '';
	}

	get fileCache() {
		if (this._fileCache) return this._fileCache;

		try {
			this._fileCache = getFileEntryCache().createFromFile(this._cacheFile, {
				useCheckSum: this._useCheckSum,
				cwd: undefined,
			});
		} catch {
			debug(`Cache file might be corrupt, attempting to remove and recreate the cache file`);

			rmSync(this._cacheFile, { force: true });
			this._fileCache = getFileEntryCache().createFromFile(this._cacheFile, {
				useCheckSum: this._useCheckSum,
				cwd: undefined,
			});
		}

		return this._fileCache;
	}

	/**
	 * @param {import('stylelint').Config} config
	 */
	calcHashOfConfig(config) {
		if (this._hashOfConfig) return;

		const configString = JSON.stringify(config || {});

		this._hashOfConfig = hash(`${getStylelintVersion()}_${configString}`);
	}

	/**
	 * @param {string} absoluteFilepath
	 * @returns {boolean}
	 */
	hasFileChanged(absoluteFilepath) {
		// Get file descriptor compares current metadata against cached
		// one and stores the result to "changed" prop.w

		const fileCache = this.fileCache;

		/** @type {import('file-entry-cache').FileDescriptorMeta | undefined} */
		const metaCache = fileCache.cache.getKey(fileCache.createFileKey(absoluteFilepath));
		const descriptor = fileCache.getFileDescriptor(absoluteFilepath);

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
		this.fileCache.reconcile();
	}

	destroy() {
		if (this._fileCache) {
			this._fileCache.destroy();
		} else {
			rmSync(this._cacheFile, { force: true });
		}
	}

	/**
	 * @param {string} absoluteFilepath
	 */
	removeEntry(absoluteFilepath) {
		this.fileCache.removeEntry(absoluteFilepath);
	}
}
