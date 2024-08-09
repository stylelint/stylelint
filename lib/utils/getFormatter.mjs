import { DEFAULT_FORMATTER } from '../constants.mjs';
import formatters from '../formatters/index.mjs';
import getConfigForFile from '../getConfigForFile.mjs';
import getFormatterOptionsText from './getFormatterOptionsText.mjs';

/** @import {Formatter, FormatterType, InternalApi} from 'stylelint' */

/**
 * @param {InternalApi} stylelint
 * @param {Object} [params]
 * @param {FormatterType | Formatter | undefined} [params.formatterType]
 * @param {string} [params.filePath]
 * @returns {Promise<Formatter>}
 */
export default async function getFormatter(stylelint, params = {}) {
	const { formatterType, filePath } = params;
	const cwd = stylelint._options.cwd;
	const configPath = stylelint._options.configFile || filePath || cwd;
	let formatter = formatterType;

	if (!formatter) {
		const resolvedConfig = stylelint._options.config
			? stylelint._options
			: await getConfigForFile(stylelint, configPath, configPath);
		const configFormatter = resolvedConfig?.config.formatter;

		formatter = stylelint._options.formatter || configFormatter;
	}

	/** @type {Formatter} */

	if (typeof formatter === 'string') {
		const formatterFunction = formatters[formatter];

		if (formatterFunction === undefined) {
			const formattersText = getFormatterOptionsText(', ', '"');

			throw new Error(`You must use a valid formatter option: ${formattersText} or a function`);
		}

		return formatterFunction;
	}

	if (typeof formatter === 'function') {
		return Promise.resolve(formatter);
	}

	return formatters[DEFAULT_FORMATTER];
}
