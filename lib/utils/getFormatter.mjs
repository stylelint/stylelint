import { EXIT_CODE_INVALID_CONFIG } from '../constants.mjs';
import dynamicImport from './dynamicImport.mjs';
import { existsSync } from 'node:fs';
import formatters from '../formatters/index.mjs';
import getConfigForFile from '../getConfigForFile.mjs';
import getFormatterOptionsText from './getFormatterOptionsText.mjs';
import { resolve } from 'node:path';

/** @import {Formatter, FormatterType, InternalApi} from 'stylelint' */

/**
 * @param {InternalApi} stylelint
 * @param {Object} [params]
 * @param {FormatterType | Formatter | undefined} [params.formatterType]
 * @returns {Promise<Formatter>}
 */
export default async function getFormatter(stylelint, params = {}) {
	const { formatterType } = params;
	const cwd = stylelint._options.cwd;
	const configPath = stylelint._options.configFile || cwd;
	let formatter = formatterType;

	if (!formatter) {
		let configForFile;

		try {
			configForFile = await getConfigForFile(stylelint, configPath);
		} catch (err) {
			if (err instanceof Error && 'code' in err && err.code === EXIT_CODE_INVALID_CONFIG) {
				configForFile = undefined;
			} else {
				throw err;
			}
		}

		const resolvedConfig = stylelint._options.config ? stylelint._options : configForFile;
		const configFormatter = resolvedConfig?.config.formatter;

		formatter =
			stylelint._options.formatter || configFormatter || stylelint._options._defaultFormatter;
	}

	if (typeof formatter === 'string') {
		const formatterFunction = formatters[formatter];

		if (formatterFunction === undefined) {
			if (existsSync(formatter)) {
				formatter = await dynamicImport(resolve(formatter)).then((m) => m.default);
			} else {
				const formattersText = getFormatterOptionsText(', ', '"');

				throw new Error(`You must use a valid formatter option: ${formattersText} or a function`);
			}
		}

		return formatterFunction;
	}

	if (typeof formatter === 'function') {
		return Promise.resolve(formatter);
	}

	return formatters.json;
}
