import { readFileSync } from 'node:fs';

import postcss from 'postcss';

import { ConfigurationError } from './errors.mjs';

/** @import {Root} from 'postcss' */
/** @import {Config as StylelintConfig} from 'stylelint' */

/** @type {WeakMap<NonNullable<StylelintConfig['_resolvedReferenceFiles']>, Root[]>} */
const cache = new WeakMap();

/**
 * Read, parse, and cache reference files from resolved config entries.
 *
 * @param {StylelintConfig} config
 * @returns {Root[]}
 */
export default function getReferenceRoots(config) {
	const entries = config._resolvedReferenceFiles;

	if (!entries || entries.length === 0) {
		return [];
	}

	const cachedResult = cache.get(entries);

	if (cachedResult) return cachedResult;

	/** @type {Root[]} */
	const roots = [];

	for (const entry of entries) {
		const parse = entry.customSyntax?.parse ?? postcss.parse;

		for (const filePath of entry.files) {
			try {
				roots.push(/** @type {Root} */ (parse(readFileSync(filePath, 'utf8'), { from: filePath })));
			} catch (error) {
				throw new ConfigurationError(
					`Failed to parse reference file "${filePath}": ${error instanceof Error ? error.message : error}`,
				);
			}
		}
	}

	cache.set(entries, roots);

	return roots;
}
