import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * @param {string} formatterPath
 * @returns {string}
 */
export default function resolveCustomFormatter(formatterPath) {
	const resolvedPath = resolve(formatterPath);

	if (existsSync(resolvedPath)) {
		return resolvedPath;
	}

	return require.resolve(formatterPath);
}
