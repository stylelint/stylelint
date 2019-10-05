'use strict';

const _ = require('lodash');
const assignDisabledRanges = require('./assignDisabledRanges');
const getOsEol = require('./utils/getOsEol');
const path = require('path');
const reportUnknownRuleNames = require('./reportUnknownRuleNames');
const requireRule = require('./requireRule');
const rulesOrder = require('./rules');

/** @typedef {import('stylelint').PostcssResult} PostcssResult */
/** @typedef {import('stylelint').StylelintPostcssResult} StylelintPostcssResult */

/**
 * @typedef {object} Options
 * @property {string} [code]
 * @property {string} [codeFilename] Must be an absolute file path
 * @property {string} [filePath] Must be an absolute file path
 * @property {Object} [existingPostcssResult]
 */

/**
 * Run stylelint on a PostCSS Result, either one that is provided
 * or one that we create
 * @param {import('stylelint').StylelintInternalApi} stylelint
 * @param {Options} options
 * @return {Promise<PostcssResult>}
 */
module.exports = function lintSource(stylelint, options) {
	options = options || {};

	if (!options.filePath && options.code === undefined && !options.existingPostcssResult) {
		return Promise.reject(new Error('You must provide filePath, code, or existingPostcssResult'));
	}

	const isCodeNotFile = options.code !== undefined;

	const inputFilePath = isCodeNotFile ? options.codeFilename : options.filePath;

	if (inputFilePath !== undefined && !path.isAbsolute(inputFilePath)) {
		if (isCodeNotFile) {
			return Promise.reject(new Error('codeFilename must be an absolute path'));
		} else {
			return Promise.reject(new Error('filePath must be an absolute path'));
		}
	}

	const getIsIgnored = stylelint.isPathIgnored(inputFilePath).catch((err) => {
		if (isCodeNotFile && err.code === 'ENOENT') return false;

		throw err;
	});

	return getIsIgnored.then((isIgnored) => {
		if (isIgnored) {
			const postcssResult =
				options.existingPostcssResult || createEmptyPostcssResult(inputFilePath);

			postcssResult.stylelint = postcssResult.stylelint || {};
			postcssResult.stylelint.ignored = true;
			postcssResult.standaloneIgnored = true; // TODO: remove need for this

			return postcssResult;
		}

		const configSearchPath = stylelint._options.configFile || inputFilePath;

		const getConfig = stylelint.getConfigForFile(configSearchPath).catch((err) => {
			if (isCodeNotFile && err.code === 'ENOENT') return stylelint.getConfigForFile(process.cwd());

			throw err;
		});

		return getConfig.then((result) => {
			const config =
				/** @type {{ config: import('stylelint').StylelintConfig, filepath: string }} */ (result).config;
			const existingPostcssResult = options.existingPostcssResult;

			if (existingPostcssResult) {
				return lintPostcssResult(stylelint, existingPostcssResult, config).then(
					() => existingPostcssResult,
				);
			}

			return stylelint
				._getPostcssResult({
					code: options.code,
					codeFilename: options.codeFilename,
					filePath: inputFilePath,
					codeProcessors: config.codeProcessors,
				})
				.then((postcssResult) => {
					return lintPostcssResult(stylelint, postcssResult, config).then(() => postcssResult);
				});
		});
	});
};

/**
 * @param {import('stylelint').StylelintInternalApi} stylelint
 * @param {import('postcss').Result} postcssResult
 * @param {import('stylelint').StylelintConfig} config
 * @return {Promise<any>}
 */
function lintPostcssResult(stylelint, postcssResult, config) {
	const postcssResultWithStylelint = /** @type {PostcssResult} */ (postcssResult);

	postcssResultWithStylelint.stylelint =
		postcssResultWithStylelint.stylelint || /** @type {StylelintPostcssResult} */ ({});
	postcssResultWithStylelint.stylelint.ruleSeverities = {};
	postcssResultWithStylelint.stylelint.customMessages = {};
	postcssResultWithStylelint.stylelint.stylelintError = false;
	postcssResultWithStylelint.stylelint.quiet = config.quiet;

	const postcssDoc = postcssResultWithStylelint.root;
	/** @type {string} */
	let newline;

	if (postcssDoc) {
		// TODO TYPES
		const newlineMatch = postcssDoc.source && postcssDoc.source.input.css.match(/\r?\n/);

		newline = newlineMatch ? newlineMatch[0] : getOsEol();

		assignDisabledRanges(postcssDoc, postcssResultWithStylelint);
	}

	if (stylelint._options.reportNeedlessDisables || stylelint._options.ignoreDisables) {
		postcssResultWithStylelint.stylelint.ignoreDisables = true;
	}

	const postcssRoots =
		/** @type {import('postcss').ChildNode[]} */ (postcssDoc &&
		postcssDoc.constructor.name === 'Document'
			? postcssDoc.nodes
			: [postcssDoc]);

	// Promises for the rules. Although the rule code runs synchronously now,
	// the use of Promises makes it compatible with the possibility of async
	// rules down the line.
	/** @type {Array<Promise<any>>} */
	const performRules = [];

	const rules = config.rules
		? Object.keys(config.rules).sort((a, b) => rulesOrder.indexOf(a) - rulesOrder.indexOf(b))
		: [];

	rules.forEach((ruleName) => {
		const ruleFunction = requireRule(ruleName) || _.get(config, ['pluginFunctions', ruleName]);

		if (ruleFunction === undefined) {
			performRules.push(
				Promise.all(
					postcssRoots.map((postcssRoot) =>
						reportUnknownRuleNames(ruleName, postcssRoot, postcssResultWithStylelint),
					),
				),
			);

			return;
		}

		const ruleSettings = _.get(config, ['rules', ruleName]);

		if (ruleSettings === null || ruleSettings[0] === null) {
			return;
		}

		const primaryOption = ruleSettings[0];
		const secondaryOptions = ruleSettings[1];

		// Log the rule's severity in the PostCSS result
		const defaultSeverity = config.defaultSeverity || 'error';

		postcssResultWithStylelint.stylelint.ruleSeverities[ruleName] = _.get(
			secondaryOptions,
			'severity',
			defaultSeverity,
		);
		postcssResultWithStylelint.stylelint.customMessages[ruleName] = _.get(
			secondaryOptions,
			'message',
		);

		performRules.push(
			Promise.all(
				postcssRoots.map((postcssRoot) =>
					ruleFunction(primaryOption, secondaryOptions, {
						fix: stylelint._options.fix,
						newline,
					})(postcssRoot, postcssResult),
				),
			),
		);
	});

	return Promise.all(performRules);
}

/**
 *
 * @param {string} filePath
 * @returns {Object}
 */
function createEmptyPostcssResult(filePath) {
	return {
		root: {
			source: {
				input: { file: filePath },
			},
		},
		messages: [],
		stylelint: { stylelintError: false },
	};
}
