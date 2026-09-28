import { isAbsolute, relative, resolve } from 'node:path';
import picomatch from 'picomatch';

import filterFilePaths from './utils/filterFilePaths.mjs';
import getConfigForFile from './getConfigForFile.mjs';
import getFileIgnorer from './utils/getFileIgnorer.mjs';
import normalizeFilePath from './utils/normalizeFilePath.mjs';

/**
 * To find out if a path is ignored, we need to load the config,
 * which may have an ignoreFiles property. We then check the path
 * against these.
 * @param {import('stylelint').InternalApi} stylelint
 * @param {string} [filePath]
 * @returns {Promise<boolean>}
 */
export default async function isPathIgnored(stylelint, filePath) {
	if (!filePath) {
		return false;
	}

	const cwd = stylelint._options.cwd;
	const result = await getConfigForFile({ stylelint, searchPath: filePath, filePath });

	if (!result) {
		return true;
	}

	const ignoreFiles = result.config.ignoreFiles || [];
	const absoluteFilePath = isAbsolute(filePath) ? filePath : resolve(cwd, filePath);

	const normalizedAbsolutePath = normalizeFilePath(absoluteFilePath);
	const normalizedIgnoreFiles = ignoreFiles.map((/** @type {string} */ glob) =>
		normalizeFilePath(String(glob)),
	);

	if (isMatchedByGlobs(normalizedAbsolutePath, normalizedIgnoreFiles)) {
		return true;
	}

	const ignorer = getFileIgnorer(stylelint._options);

	if (filterFilePaths(ignorer, [relative(cwd, absoluteFilePath)]).length === 0) {
		return true;
	}

	return false;
}

/**
 * @param {string} glob
 * @returns {boolean}
 */
function isNegatedGlob(glob) {
	return glob.startsWith('!');
}

/**
 * Whether the path matches the globs as a list: a negated glob removes a match
 * made by an earlier glob, a later glob restores it, and a list of only negated
 * globs matches every path that none of them excludes.
 *
 * @param {string} filePath
 * @param {string[]} globs
 * @returns {boolean}
 */
function isMatchedByGlobs(filePath, globs) {
	if (globs.length === 0) return false;

	// picomatch matches a negated glob against the paths it keeps
	return globs.reduce(
		(matched, glob) =>
			isNegatedGlob(glob)
				? matched && picomatch.isMatch(filePath, glob)
				: matched || picomatch.isMatch(filePath, glob),
		globs.every(isNegatedGlob),
	);
}
