import { readFile } from 'node:fs/promises';

import postcss from 'postcss';

import normalizeFilePath from './utils/normalizeFilePath.mjs';
import normalizeFixMode from './utils/normalizeFixMode.mjs';

/** @import {Result, Syntax} from 'postcss' */
/** @import {GetPostcssOptions, InternalApi as StylelintInternalApi} from 'stylelint' */

const postcssProcessor = postcss();

/**
 * @param {StylelintInternalApi} stylelint
 * @param {GetPostcssOptions} options
 *
 * @returns {Promise<Result>}
 */
export default async function getPostcssResult(stylelint, { customSyntax, filePath, code } = {}) {
	const normalizedPath = filePath ? normalizeFilePath(filePath) : undefined;
	const cached = normalizedPath ? stylelint._postcssResultCache.get(normalizedPath) : undefined;

	if (cached) {
		return cached;
	}

	const fix = normalizeFixMode(stylelint._options.fix);
	const syntax = customSyntax ?? (await cssSyntax(fix === 'lax'));

	const postcssOptions = {
		from: filePath,
		syntax,
	};

	/** @type {string | undefined} */
	let getCode;

	if (code !== undefined) {
		getCode = code;
	} else if (filePath) {
		getCode = await readFile(filePath, 'utf8');
	}

	if (getCode === undefined) {
		throw new Error('code or filePath required');
	}

	const postcssResult = await postcssProcessor.process(getCode, postcssOptions).async();

	if (normalizedPath) {
		stylelint._postcssResultCache.set(normalizedPath, postcssResult);
	}

	return postcssResult;
}

/**
 * @param {boolean} fix
 * @returns {Promise<Syntax>}
 */
async function cssSyntax(fix) {
	const parse = await (fix ? import('postcss-safe-parser').then((m) => m.default) : postcss.parse);

	return { parse, stringify: postcss.stringify };
}
