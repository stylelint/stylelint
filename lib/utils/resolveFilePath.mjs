import { join, normalize, resolve, sep } from 'node:path';
import { lstatSync } from 'node:fs';

/**
 * Return the resolved file path, based on whether the provided parameter is
 * a directory or looks like a directory (ends in `path.sep`), in which case the file
 * name will be `location/defaultFileName`.
 *
 * If location points to a file or looks like a file, then it will just use that file.
 *
 * @param {string} location - The name of file or directory to be used
 * @param {string} cwd - Current working directory. Used for tests
 * @param {string} defaultFileName - Default filename to use when location is a directory
 * @returns {string} Resolved path to the file
 */
export default function resolveFilePath(location, cwd, defaultFileName) {
	/*
	 * Make sure path separators are normalized for environment/os.
	 * Also, keep trailing path separator if present.
	 */
	location = normalize(location);

	const resolvedLocation = resolve(cwd, location);
	// If the last character passed is a path separator, we assume is a directory.
	const looksLikeADirectory = location[location.length - 1] === sep;

	/**
	 * Return the file path when the location is a directory.
	 * @returns {string} - Resolved path to the file
	 */
	function getFilePathForDirectory() {
		return join(resolvedLocation, defaultFileName);
	}

	if (
		looksLikeADirectory ||
		lstatSync(resolvedLocation, { throwIfNoEntry: false })?.isDirectory()
	) {
		// Return path to provided directory with the specified file name.
		return getFilePathForDirectory();
	}

	// Return normalized path to file.
	return resolvedLocation;
}
