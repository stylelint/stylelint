import postcss from 'postcss';
import { readFile } from 'node:fs/promises';

import { ConfigurationError } from './errors.mjs';
import { isDocument } from './typeGuards.mjs';

/** @import {Root} from 'postcss' */
/** @import {Config as StylelintConfig} from 'stylelint' */

/**
 * Read and parse reference files from resolved config entries.
 *
 * @param {StylelintConfig} config
 * @returns {Promise<Root[]>}
 */
export default async function getReferenceRoots(config) {
	const entries = config._resolvedReferenceFiles;

	if (!entries || entries.length === 0) {
		return [];
	}

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
