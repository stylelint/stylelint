'use strict';

/** @typedef {import('stylelint').PostcssResult} PostcssResult */
/** @typedef {import('stylelint').LintResult} StylelintResult */

/**
 * @param {PostcssResult} [postcssResult]
 * @param {import('stylelint').CssSyntaxError} [cssSyntaxError]
 * @return {StylelintResult}
 */
module.exports = function createPartialStylelintResult(postcssResult, cssSyntaxError) {
	/** @type {StylelintResult} */
	let stylelintResult;
	/** @type {string | undefined} */
	let source;

	if (postcssResult && postcssResult.root) {
		if (postcssResult.root.source) {
			source = postcssResult.root.source.input.file;

			if (!source && 'id' in postcssResult.root.source.input) {
				source = postcssResult.root.source.input.id;
			}
		}

		const deprecationMessages = postcssResult.messages.filter(
			(message) => message.stylelintType === 'deprecation',
		);
		const deprecations = deprecationMessages.map((deprecationMessage) => {
			return {
				text: deprecationMessage.text,
				reference: deprecationMessage.stylelintReference,
			};
		});

		const invalidOptionMessages = postcssResult.messages.filter(
			(message) => message.stylelintType === 'invalidOption',
		);
		const invalidOptionWarnings = invalidOptionMessages.map((invalidOptionMessage) => {
			return {
				text: invalidOptionMessage.text,
			};
		});

		const parseErrors = postcssResult.messages.filter(
			(message) => message.stylelintType === 'parseError',
		);

		// Remove deprecation warnings, invalid options, and parse errors from the messages
		postcssResult.messages = postcssResult.messages.filter(
			(message) =>
				message.stylelintType !== 'deprecation' &&
				message.stylelintType !== 'invalidOption' &&
				message.stylelintType !== 'parseError',
		);

		// This defines the stylelint result object that formatters receive
		stylelintResult = {
			source,
			deprecations,
			invalidOptionWarnings,
			// @ts-expect-error -- TS2322: Type 'Message[]' is not assignable to type '(Warning & { stylelintType: string; })[]'.
			parseErrors,
			errored: postcssResult.stylelint.stylelintError,
			warnings: postcssResult.messages.map((message) => {
				return {
					line: message.line,
					column: message.column,
					endLine: message.endLine,
					endColumn: message.endColumn,
					rule: message.rule,
					severity: message.severity,
					text: message.text,
				};
			}),
			ignored: postcssResult.stylelint.ignored,
			_postcssResult: postcssResult,
		};
	} else if (cssSyntaxError) {
		if (cssSyntaxError.name !== 'CssSyntaxError') {
			throw cssSyntaxError;
		}

		stylelintResult = {
			source: cssSyntaxError.file || '<input css 1>',
			deprecations: [],
			invalidOptionWarnings: [],
			parseErrors: [],
			errored: true,
			warnings: [
				{
					line: cssSyntaxError.line,
					column: cssSyntaxError.column,
					endLine: cssSyntaxError.endLine,
					endColumn: cssSyntaxError.endColumn,
					rule: cssSyntaxError.name,
					severity: 'error',
					text: `${cssSyntaxError.reason} (${cssSyntaxError.name})`,
				},
			],
		};
	} else {
		throw new Error(
			'createPartialStylelintResult must be called with either postcssResult or CssSyntaxError',
		);
	}

	return stylelintResult;
};
