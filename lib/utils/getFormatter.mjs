import dynamicImport from './dynamicImport.mjs';
import { existsSync } from 'node:fs';
import formatters from '../formatters/index.mjs';
import getConfigForFile from '../getConfigForFile.mjs';
import getFormatterOptionsText from './getFormatterOptionsText.mjs';
import { resolve } from 'node:path';

/** @import {Formatter, InternalApi} from 'stylelint' */

/**
 * @param {InternalApi} stylelint
 * @returns {Promise<Formatter>}
 */
export default async function getFormatter(stylelint) {
	let formatter = stylelint._options.formatter;

	if (!formatter) {
		const config = await getConfigForFile({ stylelint, failIfNoConfig: false });

		formatter = config?.config.formatter;
	}

	if (typeof formatter === 'string') {
		let formatterFunction = formatters[formatter];

		if (formatterFunction === undefined) {
			if (existsSync(formatter)) {
				formatterFunction = await dynamicImport(resolve(formatter)).then((m) => m.default);
			} else {
				const formattersText = getFormatterOptionsText(', ', '"');

				throw new Error(`You must use a valid formatter option: ${formattersText} or a function`);
			}
		}

		return formatterFunction;
	}

	// Assume a function or a promise of a function.
	if (typeof formatter === 'function' || formatter) {
		return Promise.resolve(formatter);
	}

	formatter ??= stylelint._options._defaultFormatter ?? 'json';

	return formatters[formatter];
}
