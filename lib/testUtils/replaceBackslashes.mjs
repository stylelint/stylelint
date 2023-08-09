import { fileURLToPath } from 'node:url';

/**
 * @param {string | URL} path
 * @returns {string}
 */
export default function replaceBackslashes(path) {
	return (typeof path === 'string' ? path : fileURLToPath(path)).replaceAll('\\', '/');
}
