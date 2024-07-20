import { DEFAULT_FORMATTER } from '../constants.mjs';
import dynamicImport from './dynamicImport.mjs';
import { existsSync } from 'node:fs';
import formatters from '../formatters/index.mjs';
import { isString } from './validateTypes.mjs';
import process from 'node:process';
import { resolve } from 'node:path';
import resolveConfig from '../resolveConfig.mjs';

/**
 * @param {import('stylelint').LinterOptions} options
 * @returns {Promise<import('stylelint').LinterOptions['formatter']>}
 */
export default async function getFormatter(options) {
	const cwd = process.cwd();
	const customFormatter = options.customFormatter;
	const configFile = options.config?.toString();
	const configBasedir = options.configBasedir;
	const resolvedConfig = (await resolveConfig(cwd, { configBasedir, configFile })) || {};
	const configFormatter = resolvedConfig.formatter;

	const configFormatterName = configFormatter?.toString();

	const cliFormatterFlagExists = Object.prototype.hasOwnProperty.call(options, 'formatter');
	const configFormatterExists =
		configFormatterName && typeof configFormatter === 'string' && formatters[configFormatter];
	let formatter;

	if (isString(customFormatter)) {
		formatter = await importCustomFormatter(customFormatter);
	} else if (cliFormatterFlagExists && isString(options.formatter)) {
		formatter = options.formatter;
	} else if (configFormatterName && !configFormatterExists) {
		formatter = await importCustomFormatter(configFormatterName);
	} else if (configFormatter) {
		formatter = configFormatter;
	} else {
		formatter = formatters[DEFAULT_FORMATTER];
	}

	return formatter;
}

/**
 * @param {string} fileOrModulePath
 * @returns {Promise<import('stylelint').Formatter>}
 */
function importCustomFormatter(fileOrModulePath) {
	let modulePath = fileOrModulePath;

	if (existsSync(modulePath)) {
		modulePath = resolve(modulePath); // to absolute path
	}

	return dynamicImport(modulePath).then((m) => m.default);
}
