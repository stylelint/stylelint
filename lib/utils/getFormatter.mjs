import { DEFAULT_FORMATTER } from '../constants.mjs';
import formatters from '../formatters/index.mjs';
import getConfigForFile from '../getConfigForFile.mjs';
import getFormatterOptionsText from './getFormatterOptionsText.mjs';

/** @import {Formatter, InternalApi} from 'stylelint' */

/**
 * @param {InternalApi} stylelint
 * @returns {Promise<Formatter>}
 */
export default async function getFormatter(stylelint) {
	const cwd = stylelint._options.cwd;
	const configFile = stylelint._options.configFile;
	const resolvedConfig = await getConfigForFile(stylelint, cwd, configFile);
	const configFormatter = resolvedConfig?.config.formatter;
	/** @type {Formatter} */
	let formatter = stylelint._options.formatter || configFormatter;

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
