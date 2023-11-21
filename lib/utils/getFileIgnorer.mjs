import { isAbsolute, resolve } from 'node:path';
import { readFileSync } from 'node:fs';

import ignore from 'ignore';

import { DEFAULT_IGNORE_FILENAME } from '../constants.mjs';
import isPathNotFoundError from './isPathNotFoundError.mjs';

/**
 * @typedef {import('stylelint').LinterOptions} LinterOptions
 *
 * @param {Pick<LinterOptions, 'ignorePath' | 'ignorePattern'> & { cwd: string }} options
 * @return {import('ignore').Ignore}
 */
export default function getFileIgnorer({ ignorePath, ignorePattern, cwd }) {
	const ignorer = ignore.default();
	const ignorePaths = [ignorePath || []].flat();

	if (ignorePaths.length === 0) {
		ignorePaths.push(DEFAULT_IGNORE_FILENAME);
	}

	for (const ignoreFilePath of ignorePaths) {
		const absoluteIgnoreFilePath = isAbsolute(ignoreFilePath)
			? ignoreFilePath
			: resolve(cwd, ignoreFilePath);

		try {
			const ignoreText = readFileSync(absoluteIgnoreFilePath, 'utf8');

			ignorer.add(ignoreText);
		} catch (readError) {
			if (!isPathNotFoundError(readError)) {
				throw readError;
			}
		}
	}

	if (ignorePattern) ignorer.add(ignorePattern);

	return ignorer;
}
