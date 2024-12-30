import process from 'node:process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import createDebug from 'debug';
import fileEntryCache from 'file-entry-cache';

import {
	CACHE_STRATEGY_CONTENT,
	CACHE_STRATEGY_METADATA,
	DEFAULT_CACHE_LOCATION,
	DEFAULT_CACHE_STRATEGY,
} from '../constants.mjs';
import { assert, isPlainObject } from './validateTypes.mjs';
import getCacheFile from './getCacheFile.mjs';
import hash from './hash.mjs';

const debug = createDebug('stylelint:file-cache');

const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));

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

		const cacheFile = resolve(getCacheFile(cacheLocation, cwd));
		const useCheckSum = cacheStrategy === CACHE_STRATEGY_CONTENT;

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

		const fileCheckSumChanged = this._useCheckSum
			? this.hasFileCheckSumChanged(absoluteFilepath)
			: false;
		const descriptor = this._fileCache.getFileDescriptor(absoluteFilepath);

		descriptor.meta.data ??= {};

		assert(isPlainObject(descriptor.meta.data));

		const configChanged = descriptor.meta.data.hashOfConfig !== this._hashOfConfig;

		let changed = false;

		if (this._useCheckSum) {
			changed = configChanged || fileCheckSumChanged;
		} else {
			changed = configChanged || Boolean(descriptor.changed);
		}

		if (!changed) {
			debug(`Skip linting ${absoluteFilepath}. File hasn't changed.`);
		}

		// Mutate file descriptor object and store config hash to each file.
		// Running lint with different config should invalidate the cache.
		if (descriptor.meta.data.hashOfConfig !== this._hashOfConfig) {
			descriptor.meta.data.hashOfConfig = this._hashOfConfig;
		}

		return changed;
	}

	/**
	 * @param {string} absoluteFilepath
	 * @returns {boolean}
	 */
	hasFileCheckSumChanged(absoluteFilepath) {
		const metaCache = this._fileCache.cache.getKey(this._fileCache.createFileKey(absoluteFilepath));

		if (!metaCache?.hash) {
			return true;
		}

		const buffer = readFileSync(absoluteFilepath);

		if (this._fileCache.getHash(buffer) !== metaCache.hash) {
			return true;
		}

		return false;
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
