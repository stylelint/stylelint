import { fileURLToPath } from 'node:url';

/**
 * Converts a URL to a file path string, or returns the string as-is.
 *
 * @overload
 * @param {string | URL} cwd
 * @returns {string}
 *
 * @overload
 * @param {undefined} cwd
 * @returns {undefined}
 *
 * @overload
 * @param {string | URL | undefined} cwd
 * @returns {string | undefined}
 *
 * @param {string | URL | undefined} cwd
 * @returns {string | undefined}
 */
export default function toPath(cwd) {
	return cwd instanceof URL ? fileURLToPath(cwd) : cwd;
}
