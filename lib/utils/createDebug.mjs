import { EOL } from 'node:os';
import process from 'node:process';

/**
 * Create a function that writes a message to stderr, prefixed with the namespace,
 * when the `DEBUG` environment variable enables that namespace.
 *
 * `DEBUG` holds a comma- or space-separated list of namespaces.
 * A trailing `*` matches any suffix, e.g. `DEBUG=stylelint:*`.
 *
 * @param {string} namespace
 * @returns {(message: string) => void}
 */
export default function createDebug(namespace) {
	if (!isEnabled(namespace)) return () => {};

	return (message) => {
		process.stderr.write(`${namespace} ${message}${EOL}`);
	};
}

/**
 * @param {string} namespace
 * @returns {boolean}
 */
function isEnabled(namespace) {
	const patterns = (process.env.DEBUG ?? '').split(/[\s,]+/);

	return patterns.some((pattern) => isMatch(namespace, pattern));
}

/**
 * @param {string} namespace
 * @param {string} pattern
 * @returns {boolean}
 */
function isMatch(namespace, pattern) {
	if (pattern.endsWith('*')) return namespace.startsWith(pattern.slice(0, -1));

	return namespace === pattern;
}
