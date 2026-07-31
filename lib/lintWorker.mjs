import { parentPort, workerData } from 'node:worker_threads';

import createStylelint from './createStylelint.mjs';
import lintFiles from './lintFiles.mjs';

/** @import {LintResult} from 'stylelint' */
/** @import {LintTask, LintTaskResponse, TransferableError, TransferableLintResult, WorkerOptions} from './lintFilesInWorkers.mjs' */

if (!parentPort) {
	throw new Error('This module must be run in a worker thread');
}

const port = parentPort;

const { options } = /** @type {{ options: WorkerOptions }} */ (workerData);
const stylelint = createStylelint(options);

port.on('message', (/** @type {LintTask} */ { files }) => {
	lintFiles(stylelint, files, { useCache: false, fix: options.fix })
		.then((results) => {
			port.postMessage(
				/** @type {LintTaskResponse} */ ({ results: results.map(toTransferableResult) }),
			);
		})
		.catch((error) => {
			port.postMessage(/** @type {LintTaskResponse} */ ({ error: serializeError(error) }));
		});
});

/**
 * Make a lint result transferable via `postMessage()`.
 *
 * A full lint result cannot cross a thread boundary: `_postcssResult` holds the
 * PostCSS AST and resolved config (which may contain plugin functions), and
 * parse errors are PostCSS warnings that reference AST nodes. Everything the
 * main thread consumes afterwards is retained: plain warning objects, and the
 * `_postcssResult.stylelint` fields read by `prepareReturnValue()`
 * (`ruleMetadata`) and the verbose formatter (`fixersData`).
 *
 * @param {LintResult} result
 * @returns {TransferableLintResult}
 */
function toTransferableResult(result) {
	// A shallow copy with values replaced in place, rather than a rest spread
	// with properties re-added, so that the key order (and thereby JSON
	// formatter output) stays identical to a main-thread result.
	const transferable = /** @type {TransferableLintResult} */ ({ ...result });

	transferable.parseErrors = result.parseErrors.map(
		({ line, column, endLine, endColumn, text, stylelintType }) =>
			/** @type {LintResult['parseErrors'][0]} */ (
				/** @type {unknown} */ ({ line, column, endLine, endColumn, text, stylelintType })
			),
	);

	if (result._postcssResult) {
		transferable._postcssResult = {
			stylelint: {
				ruleMetadata: result._postcssResult.stylelint.ruleMetadata,
				fixersData: result._postcssResult.stylelint.fixersData,
				stylelintError: result._postcssResult.stylelint.stylelintError,
				stylelintWarning: result._postcssResult.stylelint.stylelintWarning,
			},
		};
	}

	return transferable;
}

/**
 * `postMessage()` clones only an error's standard properties, so carry the
 * custom ones (e.g. `code` on `ConfigurationError`) explicitly.
 *
 * @param {unknown} error
 * @returns {TransferableError}
 */
function serializeError(error) {
	if (!(error instanceof Error)) {
		return { name: 'Error', message: String(error), stack: undefined, properties: {} };
	}

	return {
		name: error.name,
		message: error.message,
		stack: error.stack,
		properties: { ...error },
	};
}
