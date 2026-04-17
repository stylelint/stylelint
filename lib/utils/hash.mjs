import { createHash } from 'node:crypto';

/**
 * hash the given string
 * @param {string} str the string to hash
 * @returns {string} the hash
 */
export default function hash(str) {
	// Why md5?
	// - Fastest performance
	// - Sufficient collision resistance for file paths and configurations
	// - Not need cryptographic security
	return createHash('md5').update(str).digest('base64url').slice(0, 10);
}
