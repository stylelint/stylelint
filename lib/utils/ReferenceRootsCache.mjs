import { readFile, stat } from 'node:fs/promises';
import postcss from 'postcss';

import { ConfigurationError } from './errors.mjs';
import arrayEqual from './arrayEqual.mjs';
import { isDocument } from './typeGuards.mjs';
import { isString } from './validateTypes.mjs';

/** @import {Document, Message, Root} from 'postcss' */
/** @import {Config as StylelintConfig} from 'stylelint' */

/** @typedef {NonNullable<StylelintConfig['_resolvedReferenceFiles']>} ResolvedReferenceFiles */
/**
 * @typedef {object} ParsedReferenceFile
 * @property {Root[]} roots
 * @property {string[]} files - the file and those its loader inlined
 * @property {string[]} metadata - their sizes and modification times when parsed
 */

/**
 * Parsed reference files, reused while they and the files their loader inlined are unchanged on disk
 */
export default class ReferenceRootsCache {
	/** @type {Map<string, { parsed: Promise<ParsedReferenceFile>, revalidation?: Promise<Root[]> }>} */
	#parsedByFile = new Map();

	/** @type {Map<string, Root[]>} */
	#rootsByFiles = new Map();

	/**
	 * Every reference file's roots, as the same array while none changes, so that rules can key
	 * caches on it
	 *
	 * @param {ResolvedReferenceFiles} [entries]
	 * @returns {Promise<Root[]>}
	 */
	async getRoots(entries = []) {
		const rootsOfFiles = await Promise.all(
			entries.flatMap((entry) => entry.files.map((file) => this.#getRootsOfFile(entry, file))),
		);
		const roots = rootsOfFiles.flat();
		const key = JSON.stringify(entries.map((entry) => entry.files));
		const cached = this.#rootsByFiles.get(key);

		if (cached && arrayEqual(cached, roots)) return cached;

		this.#rootsByFiles.set(key, roots);

		return roots;
	}

	/**
	 * @param {ResolvedReferenceFiles[number]} entry
	 * @param {string} file
	 * @returns {Promise<Root[]>}
	 */
	async #getRootsOfFile(entry, file) {
		const cached = this.#parsedByFile.get(file);

		if (!cached) return this.#parse(entry, file);

		// Concurrently linted files share one check, and one re-parse should it fail
		cached.revalidation ??= getUnchangedRoots(cached.parsed)
			.then((roots) => roots ?? this.#parse(entry, file))
			.finally(() => {
				cached.revalidation = undefined;
			});

		return cached.revalidation;
	}

	/**
	 * @param {ResolvedReferenceFiles[number]} entry
	 * @param {string} file
	 * @returns {Promise<Root[]>}
	 */
	async #parse(entry, file) {
		const parsed = parseReferenceFile(entry, file);

		this.#parsedByFile.set(file, { parsed });

		return (await parsed).roots;
	}
}

/**
 * @param {ResolvedReferenceFiles[number]} entry
 * @param {string} file
 * @returns {Promise<ParsedReferenceFile>}
 */
async function parseReferenceFile({ customSyntax, loader }, file) {
	// Read after `stat`, so that an edit in between fails the next check rather than passing it
	const fileMetadata = await getMetadata(file);

	/** @type {Root | Document} */
	let root;
	/** @type {Message[]} */
	let messages;

	try {
		// Without a loader PostCSS parses lazily, when `root` is read, so that read belongs in the try
		({ root, messages } = await postcss(loader ? [loader] : []).process(
			await readFile(file, 'utf8'),
			{ from: file, parser: customSyntax },
		));
	} catch (error) {
		throw new ConfigurationError(
			`Failed to parse reference file "${file}": ${error instanceof Error ? error.message : error}`,
		);
	}

	const dependencies = messages.filter(isDependencyMessage).map((message) => message.file);

	return {
		roots: isDocument(root) ? root.nodes : [root],
		files: [file, ...dependencies],
		metadata: [fileMetadata, ...(await Promise.all(dependencies.map(getMetadata)))],
	};
}

/**
 * @param {Promise<ParsedReferenceFile>} parsed
 * @returns {Promise<Root[] | undefined>} none for a failed parse, a missing file or a change, so that each is re-parsed
 */
async function getUnchangedRoots(parsed) {
	const parsedFile = await parsed.catch(() => undefined);

	if (!parsedFile) return undefined;

	const metadata = await Promise.all(parsedFile.files.map(getMetadata)).catch(() => undefined);

	return arrayEqual(parsedFile.metadata, metadata) ? parsedFile.roots : undefined;
}

/**
 * @param {string} file
 * @returns {Promise<string>} the size and modification time
 */
async function getMetadata(file) {
	const { mtimeMs, size } = await stat(file);

	return `${mtimeMs}:${size}`;
}

/**
 * @param {Message} message
 * @returns {message is Message & { file: string }}
 */
function isDependencyMessage(message) {
	return message.type === 'dependency' && isString(message.file);
}
