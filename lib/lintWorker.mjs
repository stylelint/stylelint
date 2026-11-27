import { parentPort, threadId, workerData } from 'node:worker_threads';
import process from 'node:process';

import createDebug from './utils/createDebug.mjs';
import createStylelint from './createStylelint.mjs';
import { disableDeprecationWarnings } from './utils/emitWarning.mjs';
import lintFile from './lintFile.mjs';

/** @import {LintResult} from 'stylelint' */
/** @import {IndexedLintResult, WorkerData, WorkerMessage} from './lintFilesInWorkers.mjs' */

const debug = createDebug(`stylelint:worker:thread-${threadId}`);

if (!parentPort) {
	throw new Error('This module must be run in a worker thread');
}

const { options, filePathIndexArray, filePaths } = /** @type {WorkerData} */ (workerData);
const stylelint = createStylelint(options);
const abortController = new AbortController();

parentPort.once('message', () => abortController.abort());
// Don't keep the thread alive to wait for an abort
parentPort.unref();

// The main thread emits each warning once, from the results of all workers
disableDeprecationWarnings();

const timing = process.env.TIMING ? (await import('./timing.mjs')).default : undefined;

// The main thread displays the merged timing data of all workers
timing?.disableDisplay();

/** @type {IndexedLintResult[]} */
const indexedResults = [];

for (;;) {
	const index = Atomics.add(filePathIndexArray, 0, 1);
	const filePath = filePaths[index];

	if (filePath === undefined) break;

	const result = await lintFile(stylelint, filePath, {
		useCache: false,
		abortSignal: abortController.signal,
	});

	indexedResults.push({ index, result: toCloneableResult(result) });
}

debug(`Linted ${indexedResults.length} file(s)`);

/** @type {WorkerMessage} */
const message = { indexedResults, timingData: timing?.getData() };

parentPort.postMessage(message);

/**
 * A lint result holds the PostCSS AST and the resolved config, which may contain
 * functions, so keep only what the main thread reads after linting.
 *
 * @param {LintResult} result
 * @returns {LintResult}
 */
function toCloneableResult(result) {
	// Assigned in place to keep the key order, and thereby the JSON formatter output
	const cloneable = { ...result };

	// Parse errors are PostCSS warnings referencing an AST node, which serializes the same as its JSON
	cloneable.parseErrors = result.parseErrors.map(
		(parseError) =>
			/** @type {LintResult['parseErrors'][number]} */ (
				parseError.node ? { ...parseError, node: parseError.node.toJSON() } : { ...parseError }
			),
	);

	if (result._postcssResult) {
		const { ruleMetadata, fixersData, stylelintError, stylelintWarning } =
			result._postcssResult.stylelint;

		cloneable._postcssResult = /** @type {LintResult['_postcssResult']} */ (
			/** @type {unknown} */ ({
				stylelint: { ruleMetadata, fixersData, stylelintError, stylelintWarning },
			})
		);
	}

	return cloneable;
}
