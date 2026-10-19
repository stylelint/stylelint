import { dirname, resolve } from 'node:path';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import process from 'node:process';

import writeFileAtomic from 'write-file-atomic';

import {
	CACHE_STRATEGY_CONTENT,
	CACHE_STRATEGY_METADATA,
	DEFAULT_CACHE_LOCATION,
	DEFAULT_CACHE_STRATEGY,
} from '../constants.mjs';
import { isPlainObject, isString } from './validateTypes.mjs';
import createDebug from './createDebug.mjs';
import hash from './hash.mjs';
import resolveFilePath from './resolveFilePath.mjs';

const debug = createDebug('stylelint:file-cache');

const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));

/**
 * Persisted across runs, so that a linted file is skipped until it or the config changes
 */
export default class FileCache {
	/** @type {Map<string, string> | undefined} read on first use, as there's always a cache */
	#hashesByFile;
	#cacheFile;
	#cacheStrategy;
	#hashOfConfig = '';

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

		this.#cacheFile = resolve(resolveFilePath(cacheLocation, cwd, `.stylelintcache_${hash(cwd)}`));
		this.#cacheStrategy = cacheStrategy;

		debug(`Cache file is created at ${this.#cacheFile}`);
	}

	/**
	 * @param {import('stylelint').Config} config
	 */
	calcHashOfConfig(config) {
		if (this.#hashOfConfig) return;

		const stylelintVersion = pkg.version;
		const configString = JSON.stringify(config || {});

		this.#hashOfConfig = hash(`${stylelintVersion}_${configString}`);
	}

	/**
	 * @param {string} absoluteFilepath
	 * @returns {boolean}
	 */
	hasFileChanged(absoluteFilepath) {
		const hashesByFile = this.#getHashesByFile();
		const hashOfFile = this.#calcHashOfFile(absoluteFilepath);
		const changed = hashesByFile.get(absoluteFilepath) !== hashOfFile;

		hashesByFile.set(absoluteFilepath, hashOfFile);

		if (!changed) debug(`Skip linting ${absoluteFilepath}. File hasn't changed.`);

		return changed;
	}

	reconcile() {
		const hashesByFile = this.#getHashesByFile();

		for (const absoluteFilepath of hashesByFile.keys()) {
			if (!existsSync(absoluteFilepath)) hashesByFile.delete(absoluteFilepath);
		}

		mkdirSync(dirname(this.#cacheFile), { recursive: true });
		writeFileAtomic.sync(this.#cacheFile, JSON.stringify(Object.fromEntries(hashesByFile)), {
			fsync: false, // A cache needn't survive a crash
		});
	}

	destroy() {
		this.#hashesByFile = new Map();
		rmSync(this.#cacheFile, { force: true });
	}

	/**
	 * @param {string} absoluteFilepath
	 */
	removeEntry(absoluteFilepath) {
		this.#getHashesByFile().delete(absoluteFilepath);
	}

	#getHashesByFile() {
		return (this.#hashesByFile ??= readHashesByFile(this.#cacheFile));
	}

	/**
	 * @param {string} absoluteFilepath
	 * @returns {string} of the config with the file's metadata or content
	 */
	#calcHashOfFile(absoluteFilepath) {
		const metadataOrContent =
			this.#cacheStrategy === CACHE_STRATEGY_CONTENT
				? readFileSync(absoluteFilepath, 'utf8')
				: getMetadata(absoluteFilepath);

		return hash(`${this.#hashOfConfig}_${metadataOrContent}`);
	}
}

/**
 * @param {string} cacheFile
 * @returns {Map<string, string>} empty for a missing, corrupt or older-format file
 */
function readHashesByFile(cacheFile) {
	try {
		const hashesByFile = JSON.parse(readFileSync(cacheFile, 'utf8'));

		if (isHashesByFile(hashesByFile)) return new Map(Object.entries(hashesByFile));
	} catch (error) {
		debug(`Starting with an empty cache: ${error}`);
	}

	return new Map();
}

/**
 * @param {unknown} value
 * @returns {value is Record<string, string>}
 */
function isHashesByFile(value) {
	return isPlainObject(value) && Object.values(value).every(isString);
}

/**
 * @param {string} file
 * @returns {string} the size and modification time
 */
function getMetadata(file) {
	const { mtimeMs, size } = statSync(file);

	return `${mtimeMs}:${size}`;
}
