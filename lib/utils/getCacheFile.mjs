import { join, normalize, resolve, sep } from 'node:path';
import { lstatSync } from 'node:fs';

import hash from './hash.mjs';

/**
 * Return the cacheFile to be used by stylelint, based on whether the provided parameter is
 * a directory or looks like a directory (ends in `path.sep`), in which case the file
 * name will be `cacheFile/.cache_hashOfCWD`.
 *
 * If cacheFile points to a file or looks like a file, then it will just use that file.
 *
 * @param {string} cacheFile - The name of file to be used to store the cache
 * @param {string} cwd - Current working directory. Used for tests
 * @returns {string} Resolved path to the cache file
 */
export default function getCacheFile(cacheFile, cwd) {
	/*
	 * Make sure path separators are normalized for environment/os.
	 * Also, keep trailing path separator if present.
	 */
	cacheFile = normalize(cacheFile);

	const resolvedCacheFile = resolve(cwd, cacheFile);
	// If the last character passed is a path separator, we assume is a directory.
	const looksLikeADirectory = cacheFile[cacheFile.length - 1] === sep;

	/**
	 * Return the default cache file name when provided parameter is a directory.
	 * @returns {string} - Resolved path to the cacheFile
	 */
	function getCacheFileForDirectory() {
		return join(resolvedCacheFile, `.stylelintcache_${hash(cwd)}`);
	}

	let fileStats;

	try {
		fileStats = lstatSync(resolvedCacheFile);
	} catch {
		fileStats = null;
	}

	if (looksLikeADirectory || (fileStats && fileStats.isDirectory())) {
		// Return path to provided directory with generated file name.
		return getCacheFileForDirectory();
	}

	// Return normalized path to cache file.
	return resolvedCacheFile;
}
