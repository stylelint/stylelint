import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

import { globby } from 'globby';
import postcss from 'postcss';

import { ConfigurationError } from './errors.mjs';
import getCustomSyntax from './getCustomSyntax.mjs';

/** @import {Root} from 'postcss' */
/** @import {ConfigReferenceFilesEntry} from 'stylelint' */

/** @type {Map<string, Root[]>} */
const cache = new Map();

/**
 * @param {(string | ConfigReferenceFilesEntry)[] | undefined} referenceFiles
 * @param {string | undefined} configBasedir
 * @returns {Promise<Root[]>}
 */
export default async function getReferenceRoots(referenceFiles, configBasedir) {
	if (!referenceFiles) {
		return [];
	}

	if (!Array.isArray(referenceFiles)) {
		throw new ConfigurationError(
			'The "referenceFiles" configuration property must be an array, e.g. { "referenceFiles": ["tokens.css"] }.',
		);
	}

	/** @type {string[]} */
	const allContents = [];

	/** @type {string[]} */
	const allSyntaxIds = [];

	/** @type {Array<{ filePath: string; content: string; customSyntax?: import('stylelint').CustomSyntax }>} */
	const entries = [];

	for (const rawEntry of referenceFiles) {
		const entry = typeof rawEntry === 'string' ? { files: [rawEntry] } : rawEntry;

		if (!entry || typeof entry !== 'object' || !entry.files) {
			throw new ConfigurationError(
				'Every entry in the "referenceFiles" configuration property must be a string or an object with a "files" property, e.g. { "referenceFiles": ["tokens.css"] }.',
			);
		}

		const patterns = [entry.files].flat();
		const resolvedFiles = await globby(patterns, { cwd: configBasedir, absolute: true });

		if (resolvedFiles.length === 0) {
			throw new ConfigurationError(
				`No files matching the pattern "${patterns.join(', ')}" were found.`,
			);
		}

		for (const filePath of resolvedFiles) {
			const content = readFileSync(filePath, 'utf8');

			allContents.push(content);
			allSyntaxIds.push(entry.customSyntax ? String(entry.customSyntax) : '');
			entries.push({ filePath, content, customSyntax: entry.customSyntax });
		}
	}

	const hash = createHash('md5')
		.update(allContents.join('\0'))
		.update(allSyntaxIds.join('\0'))
		.digest('hex');

	const cached = cache.get(hash);

	if (cached) {
		return cached;
	}

	/** @type {Root[]} */
	const roots = [];

	for (const { filePath, content, customSyntax } of entries) {
		try {
			if (customSyntax) {
				const { parse } = await getCustomSyntax(customSyntax, configBasedir);

				if (!parse) {
					throw new TypeError(
						`The custom syntax for "${filePath}" does not have a "parse" function.`,
					);
				}

				roots.push(/** @type {Root} */ (parse(content, { from: filePath })));
			} else {
				roots.push(postcss.parse(content, { from: filePath }));
			}
		} catch (error) {
			throw new ConfigurationError(
				`Failed to parse semantic file "${filePath}": ${error instanceof Error ? error.message : error}`,
			);
		}
	}

	cache.set(hash, roots);

	return roots;
}
