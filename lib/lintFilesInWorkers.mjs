import { SHARE_ENV, Worker } from 'node:worker_threads';
import { availableParallelism } from 'node:os';

import createDebug from './utils/createDebug.mjs';

const debug = createDebug('stylelint:workers');

/** @import {LinterOptions, LintResult} from 'stylelint' */

/**
 * @typedef {{ index: number, result: LintResult }} IndexedLintResult
 *
 * @typedef {object} WorkerData
 * @property {LinterOptions} options The options to create Stylelint with in each worker
 * @property {Uint32Array<SharedArrayBuffer>} filePathIndexArray The shared index of the next file to lint
 * @property {string[]} filePaths The files to lint
 */

/**
 * The maximum number of files assumed to be best handled by one worker thread.
 * The same heuristic as ESLint's.
 */
const AUTO_FILES_PER_WORKER = 50;

const workerURL = new URL('./lintWorker.mjs', import.meta.url);

/**
 * @param {unknown} concurrency
 * @returns {asserts concurrency is LinterOptions['concurrency']}
 */
export function validateConcurrency(concurrency) {
	if (
		concurrency === undefined ||
		concurrency === 'auto' ||
		(Number.isInteger(concurrency) && Number(concurrency) > 0)
	) {
		return;
	}

	throw new Error(
		`Invalid option value "${concurrency}" for "concurrency". Expected "auto" or a positive integer.`,
	);
}

/**
 * Calculate the number of worker threads to run. Zero means linting in the main thread.
 *
 * With `auto`, there's one worker per `AUTO_FILES_PER_WORKER` files, capped at half the
 * available cores, and a lone worker is replaced by the main thread.
 *
 * @param {LinterOptions['concurrency']} concurrency
 * @param {number} fileCount The number of files that need linting
 * @returns {number}
 */
export function calculateWorkerCount(concurrency, fileCount) {
	if (concurrency === undefined) return 0;

	const workerCount =
		concurrency === 'auto'
			? Math.min(Math.ceil(fileCount / AUTO_FILES_PER_WORKER), availableParallelism() >> 1)
			: Math.min(concurrency, fileCount);

	return workerCount > 1 ? workerCount : 0;
}

/**
 * Throw if the options can't be passed to worker threads.
 *
 * @param {LinterOptions} options
 * @returns {void}
 */
export function validateOptionCloneability(options) {
	try {
		structuredClone(options);

		return;
	} catch {
		// continue
	}

	const uncloneableOptionKeys = Object.keys(options)
		.filter((key) => {
			try {
				structuredClone(options[/** @type {keyof LinterOptions} */ (key)]);
			} catch {
				return true;
			}

			return false;
		})
		.sort();

	const keys = new Intl.ListFormat('en-US').format(uncloneableOptionKeys.map((key) => `"${key}"`));

	throw new TypeError(
		`The ${uncloneableOptionKeys.length === 1 ? 'option' : 'options'} ${keys} cannot be cloned. When concurrency is enabled, all options must be cloneable values (JSON values). For example, use "configFile" instead of a "config" object containing functions.`,
	);
}

/**
 * Lint files in worker threads that each take the next file until none are left.
 *
 * @param {string[]} filePaths
 * @param {number} workerCount
 * @param {LinterOptions} options
 * @param {AbortSignal} [abortSignal]
 * @returns {Promise<LintResult[]>} in the order of `filePaths`
 */
export default async function lintFilesInWorkers(filePaths, workerCount, options, abortSignal) {
	debug(`Linting ${filePaths.length} file(s) in ${workerCount} worker thread(s)`);

	/** @type {LintResult[]} */
	const results = Array(filePaths.length);
	const filePathIndexArray = new Uint32Array(new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT));
	const abortController = new AbortController();
	/** @type {WorkerData} */
	const workerData = { options, filePathIndexArray, filePaths };

	const abort = () => abortController.abort(abortSignal?.reason);

	abortSignal?.throwIfAborted();
	abortSignal?.addEventListener('abort', abort, { once: true });

	/**
	 * @param {(value: void) => void} resolve
	 * @param {(error: unknown) => void} reject
	 */
	function workerExecutor(resolve, reject) {
		const worker = new Worker(workerURL, { env: SHARE_ENV, workerData });
		let finished = false;

		worker.once('message', (/** @type {IndexedLintResult[]} */ indexedResults) => {
			for (const { index, result } of indexedResults) {
				results[index] = result;
			}

			finished = true;

			// A plugin, custom syntax or config may hold a handle, such as a timer, that keeps the thread alive
			void worker.terminate();
		});
		worker.once('error', (error) => {
			abortController.abort(error);
			reject(error);
		});
		worker.once('exit', (exitCode) => {
			if (finished) {
				resolve();

				return;
			}

			const error = new Error(`A worker thread exited unexpectedly with code ${exitCode}`);

			abortController.abort(error);
			reject(error);
		});
		abortController.signal.addEventListener(
			'abort',
			() => {
				void worker.terminate();
				reject(abortController.signal.reason);
			},
			{ once: true },
		);
	}

	try {
		await Promise.all(Array.from({ length: workerCount }, () => new Promise(workerExecutor)));
	} finally {
		abortSignal?.removeEventListener('abort', abort);
	}

	return results;
}
