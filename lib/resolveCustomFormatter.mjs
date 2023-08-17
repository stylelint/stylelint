import { createRequire } from 'node:module';
// @ts-expect-error -- TS1343: The 'import.meta' meta-property is only allowed when the '--module' option is 'es2020', 'es2022', 'esnext', 'system', 'node16', or 'nodenext'.
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
