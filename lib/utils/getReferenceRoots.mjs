import postcss from 'postcss';
import { readFile } from 'node:fs/promises';

import { ConfigurationError } from './errors.mjs';
import { isDocument } from './typeGuards.mjs';

/** @import {Root} from 'postcss' */
/** @import {Config as StylelintConfig} from 'stylelint' */

const cacheObjectIds = new WeakMap();
let nextCacheObjectId = 0;

/**
 * Read and parse reference files from resolved config entries.
 *
 * @param {StylelintConfig} config
 * @param {Map<string, Promise<Root[]>>} [cache]
 * @returns {Promise<Root[]>}
 */
export default async function getReferenceRoots(config, cache) {
	const entries = config._resolvedReferenceFiles;

	if (!entries || entries.length === 0) {
		return [];
	}

	if (!cache) {
		return parseReferenceRoots(entries);
	}

	const cacheKey = getReferenceRootsCacheKey(entries);
	let roots = cache.get(cacheKey);

	if (!roots) {
		roots = parseReferenceRoots(entries).catch((error) => {
			cache.delete(cacheKey);

			throw error;
		});
		cache.set(cacheKey, roots);
	}

	return roots;
}

/**
 * @param {NonNullable<StylelintConfig['_resolvedReferenceFiles']>} entries
 * @returns {Promise<Root[]>}
 */
async function parseReferenceRoots(entries) {
	const promisedRoots = entries.flatMap((entry) => {
		const processor = postcss(entry.loader ? [entry.loader] : []);

		return entry.files.map(async (file) => {
			try {
				const rootOrDocument = await processor
					.process(await readFile(file, 'utf8'), {
						from: file,
						parser: entry.customSyntax,
					})
					.then((result) => {
						return result.root;
					});

				if (isDocument(rootOrDocument)) {
					return rootOrDocument.nodes;
				}

				return [rootOrDocument];
			} catch (error) {
				throw new ConfigurationError(
					`Failed to parse reference file "${file}": ${error instanceof Error ? error.message : error}`,
				);
			}
		});
	});

	return (await Promise.all(promisedRoots)).flat();
}

/**
 * @param {NonNullable<StylelintConfig['_resolvedReferenceFiles']>} entries
 * @returns {string}
 */
function getReferenceRootsCacheKey(entries) {
	return entries
		.map((entry) =>
			[
				entry.files.join('\u0000'),
				getCacheIdentity(entry.customSyntax),
				getCacheIdentity(entry.loader),
			].join('\u0000'),
		)
		.join('\u0001');
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function getCacheIdentity(value) {
	if (!value) return '';

	const valueType = typeof value;

	if (valueType !== 'object' && valueType !== 'function') {
		return `${valueType}:${String(value)}`;
	}

	const object = /** @type {object} */ (value);
	let objectId = cacheObjectIds.get(object);

	if (objectId === undefined) {
		objectId = nextCacheObjectId;
		nextCacheObjectId += 1;
		cacheObjectIds.set(object, objectId);
	}

	return `${valueType}:${objectId}`;
}
