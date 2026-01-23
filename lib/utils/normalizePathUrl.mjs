import { fileURLToPath } from 'node:url';

/**
 * @param {string | URL} path
 * @returns {string}
 */
export const normalizePathUrl = (path) => {
	return typeof path === 'string' || path === undefined ? path : fileURLToPath(path);
};
