import descriptionlessDisables from './descriptionlessDisables.mjs';
import invalidScopeDisables from './invalidScopeDisables.mjs';
import needlessDisables from './needlessDisables.mjs';
import reportDisables from './reportDisables.mjs';

/** @typedef {import('stylelint').Formatter} Formatter */
/** @typedef {import('stylelint').LintResult} StylelintResult */
/** @typedef {import('stylelint').LinterOptions["maxWarnings"]} maxWarnings */
/** @typedef {import('stylelint').LinterResult} LinterResult */

/**
 * @param {StylelintResult[]} stylelintResults
 * @param {maxWarnings} maxWarnings
 * @param {Formatter} formatter
 * @param {string} cwd
 *
 * @returns {LinterResult}
 */
export default function prepareReturnValue(stylelintResults, maxWarnings, formatter, cwd) {
	reportDisables(stylelintResults);
	needlessDisables(stylelintResults);
	invalidScopeDisables(stylelintResults);
	descriptionlessDisables(stylelintResults);

	let errored = false;

	for (const result of stylelintResults) {
		if (
			result.errored ||
			result.parseErrors.length > 0 ||
			result.warnings.some((warning) => warning.severity === 'error')
		) {
			errored = true;
			result.errored = true;
		}
	}

	/** @type {LinterResult} */
	const returnValue = {
		cwd,
		errored,
		results: [],
		report: '',

		// TODO: Deprecated. Remove in the next major version.
		get output() {
			if (!this._outputWarned) {
				console.warn('`output` is deprecated. Use `report` or `code` instead.');
				this._outputWarned = true;
			}

			return this._output ?? '';
		},

		reportedDisables: [],
		ruleMetadata: getRuleMetadata(stylelintResults),
	};

	// TODO: Deprecated. Remove in the next major version.
	Object.defineProperty(returnValue, '_output', { value: '', writable: true });
	Object.defineProperty(returnValue, '_outputWarned', { value: false, writable: true });

	if (maxWarnings !== undefined) {
		const foundWarnings = stylelintResults.reduce((count, file) => count + file.warnings.length, 0);

		if (foundWarnings > maxWarnings) {
			returnValue.maxWarningsExceeded = { maxWarnings, foundWarnings };
		}
	}

	returnValue.report = formatter(stylelintResults, returnValue);
	returnValue._output = returnValue.report; // TODO: Deprecated. Remove in the next major version.
	returnValue.results = stylelintResults;

	return returnValue;
}

/**
 * @param {StylelintResult[]} lintResults
 */
function getRuleMetadata(lintResults) {
	const [lintResult] = lintResults;

	if (lintResult === undefined) return {};

	if (lintResult._postcssResult === undefined) return {};

	return lintResult._postcssResult.stylelint.ruleMetadata;
}
