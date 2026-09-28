const REPEATED_SLASHES = /(?<!^)\/+/g;

/**
 * Convert backslashes to forward slashes and collapse repeated slashes,
 * except the leading double slash of a UNC path
 *
 * @param {string} path
 * @returns {string}
 */
export default function toUnixPath(path) {
	return path.replaceAll('\\', '/').replace(REPEATED_SLASHES, '/');
}
