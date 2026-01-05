import process from 'node:process';

/**
 * Temporarily override process.platform for a single async operation.
 *
 * @param {NodeJS.Platform} platform
 * @param {() => Promise<unknown>} fn
 * @returns {Promise<unknown>}
 */
export default async function withMockedPlatform(platform, fn) {
	const descriptor = Object.getOwnPropertyDescriptor(process, 'platform');

	Object.defineProperty(process, 'platform', { value: platform });

	try {
		return await fn();
	} finally {
		if (descriptor) {
			Object.defineProperty(process, 'platform', descriptor);
		}
	}
}
