import { readFile } from 'node:fs/promises';

import postcss from 'postcss';

import { ConfigurationError } from './errors.mjs';

/** @import {Root} from 'postcss' */
/** @import {Config as StylelintConfig} from 'stylelint' */

/** @type {WeakMap<NonNullable<StylelintConfig['_resolvedReferenceFiles']>, Promise<Root[]>>} */
const cache = new WeakMap();

/**
 * Read, parse, and cache reference files from resolved config entries.
 *
 * @param {StylelintConfig} config
 * @returns {Promise<Root[]>}
 */
export default async function getReferenceRoots(config) {
	const entries = config._resolvedReferenceFiles;

	if (!entries || entries.length === 0) {
		return [];
	}

	const cachedResult = cache.get(entries);

	if (cachedResult) return cachedResult;

	const promisedRoots = entries.flatMap((entry) => {
		const parse = entry.customSyntax?.parse ?? postcss.parse;

		return entry.files.map(async (file) => {
			try {
				return /** @type {Root} */ (parse(await readFile(file, 'utf8'), { from: file }));
			} catch (error) {
				throw new ConfigurationError(
					`Failed to parse reference file "${file}": ${error instanceof Error ? error.message : error}`,
				);
			}
		});
	});

	const result = Promise.all(promisedRoots);

	cache.set(entries, result);

	return result;
}
