import { access } from 'node:fs/promises';

/**
 * Check if a file or directory exists at the given path.
 * @param {string} path
 * @returns {Promise<boolean>}
 */
export default async function pathExists(path) {
	try {
		await access(path);

		return true;
	} catch {
		return false;
	}
}
