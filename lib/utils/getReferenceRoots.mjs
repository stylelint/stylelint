import postcss from 'postcss';
import { readFile } from 'node:fs/promises';

import { ConfigurationError } from './errors.mjs';
import { isRoot } from './typeGuards.mjs';

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
		const parse = entry.customSyntax?.parse ?? postcss.parse;

		return entry.files.map(async (file) => {
			try {
				const root = parse(await readFile(file, 'utf8'), { from: file });

				if (!isRoot(root)) {
					throw new ConfigurationError(
						`Failed to parse reference file "${file}": expected a Root node but got "${root.type}"`,
					);
				}

				return root;
			} catch (error) {
				throw new ConfigurationError(
					`Failed to parse reference file "${file}": ${error instanceof Error ? error.message : error}`,
				);
			}
		});
	});

	return await Promise.all(promisedRoots);
}
