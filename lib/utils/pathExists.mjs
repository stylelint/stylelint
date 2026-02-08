import { access, constants } from 'node:fs/promises';

/**
 * Check if a file or directory exists at the given path.
 * @param {string} path
 * @returns {Promise<boolean>}
 */
export default async function pathExists(path) {
	try {
		await access(path, constants.F_OK);

		return true;
	} catch {
		return false;
	}
}
