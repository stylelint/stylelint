import { fileURLToPath } from 'node:url';

/**
 * Converts a URL to a file path string, or returns the string as-is.
 *
 * @param {string | URL | undefined} cwd
 * @returns {string | undefined}
 */
export default function toPath(cwd) {
	return cwd instanceof URL ? fileURLToPath(cwd) : cwd;
}
