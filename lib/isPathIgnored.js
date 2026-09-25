'use strict';

const filterFilePaths = require('./utils/filterFilePaths');
const getFileIgnorer = require('./utils/getFileIgnorer');
const normalizePath = require('normalize-path');
const path = require('path');
const picomatch = require('picomatch');

/**
 * Same semantics as `micromatch([filePath], globs).length > 0`, including negated globs.
 * @param {string} filePath
 * @param {string[]} globs
 * @return {boolean}
 */
function isMatchedByGlobs(filePath, globs) {
	let negatives = 0;
	let kept = false;
	let omitted = false;

	for (const glob of globs) {
		const matcher = picomatch(glob, {}, true);
		const negated = matcher.state.negated || matcher.state.negatedExtglob;
		const isMatch = matcher(filePath);

		if (negated) {
			negatives++;

			if (!isMatch) omitted = true;
		} else if (isMatch) {
			omitted = false;
			kept = true;
		}
	}

	return (kept || (negatives > 0 && negatives === globs.length)) && !omitted;
}

/**
 * To find out if a path is ignored, we need to load the config,
 * which may have an ignoreFiles property. We then check the path
 * against these.
 * @param {import('stylelint').InternalApi} stylelint
 * @param {string} [filePath]
 * @return {Promise<boolean>}
 */
module.exports = async function isPathIgnored(stylelint, filePath) {
	if (!filePath) {
		return false;
	}

	const cwd = stylelint._options.cwd;
	const ignorer = getFileIgnorer(stylelint._options);

	const result = await stylelint.getConfigForFile(filePath, filePath);

	if (!result) {
		return true;
	}

	// Glob patterns for picomatch should be in POSIX-style
	const ignoreFiles = /** @type {Array<string>} */ (result.config.ignoreFiles || []).map((s) =>
		normalizePath(s),
	);

	const absoluteFilePath = path.isAbsolute(filePath) ? filePath : path.resolve(cwd, filePath);

	if (isMatchedByGlobs(absoluteFilePath, ignoreFiles)) {
		return true;
	}

	// Check filePath with .stylelintignore file
	if (filterFilePaths(ignorer, [path.relative(cwd, absoluteFilePath)]).length === 0) {
		return true;
	}

	return false;
};
