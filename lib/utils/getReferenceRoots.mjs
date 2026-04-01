import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

import postcss from 'postcss';

import { ConfigurationError } from './errors.mjs';

/** @import {Root} from 'postcss' */
/** @import {Config as StylelintConfig} from 'stylelint' */

/** @type {Map<string, Root[]>} */
const cache = new Map();

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

	/** @type {Array<{ filePath: string; content: string; parse: NonNullable<import('postcss').Syntax['parse']> }>} */
	const fileEntries = [];

	for (const entry of entries) {
		const parse = entry.customSyntax?.parse ?? postcss.parse;

		for (const filePath of entry.files) {
			fileEntries.push({ filePath, content: readFileSync(filePath, 'utf8'), parse });
		}
	}

	const hash = createHash('md5')
		.update(fileEntries.map((e) => e.content).join('\0'))
		.update(fileEntries.map((e) => (e.parse === postcss.parse ? '' : String(e.parse))).join('\0'))
		.digest('hex');

	const cached = cache.get(hash);

	if (cached) {
		return cached;
	}

	/** @type {Root[]} */
	const roots = [];

	for (const { filePath, content, parse } of fileEntries) {
		try {
			roots.push(/** @type {Root} */ (parse(content, { from: filePath })));
		} catch (error) {
			throw new ConfigurationError(
				`Failed to parse reference file "${filePath}": ${error instanceof Error ? error.message : error}`,
			);
		}
	}

	cache.set(hash, roots);

	return roots;
}
