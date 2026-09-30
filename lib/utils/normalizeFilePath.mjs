import process from 'node:process';

import toUnixPath from './toUnixPath.mjs';

/**
 * Normalize a path for comparisons on Windows while keeping POSIX platforms
 * untouched. On Windows, this lowercases the drive letter and converts
 * backslashes to forward slashes. Only the drive letter is lowercased, since
 * the rest of the path may be case-sensitive on certain file systems mounted
 * on Windows.
 *
 * @param {string} filePath
 * @param {NodeJS.Platform} [platform=process.platform]
 * @returns {string}
 */
export default function normalizeFilePath(filePath, platform = process.platform) {
	if (platform !== 'win32') {
		return filePath;
	}

	const negated = filePath.startsWith('!');
	const positive = negated ? filePath.slice(1) : filePath;
	const loweredDrive = positive.replace(/^[a-z]:/i, (drive) => drive.toLowerCase());
	const normalizedPath = toUnixPath(loweredDrive);

	return negated ? `!${normalizedPath}` : normalizedPath;
}
