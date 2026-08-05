import { Worker } from 'node:worker_threads';
import { availableParallelism } from 'node:os';

/** @import {LinterOptions, LintResult} from 'stylelint' */

/**
 * The lint options forwarded to every worker thread. This is an explicit
 * subset of the linter options: anything resolved in the main thread (globs,
 * formatter, `maxWarnings`, cache, suppressions) is excluded.
 *
 * @typedef {Pick<LinterOptions,
 *   'config' | 'configFile' | 'configBasedir' | 'customSyntax' | 'cwd' |
 *   'disableDefaultIgnores' | 'fix' | 'computeEditInfo' | 'ignoreDisables' |
 *   'ignorePath' | 'ignorePattern' | 'quiet' | 'quietDeprecationWarnings' |
 *   'reportDescriptionlessDisables' | 'reportInvalidScopeDisables' |
 *   'reportNeedlessDisables' | 'reportUnscopedDisables' | 'validate'
 * >} WorkerOptions
 *
 * @typedef {{ files: string[] }} LintTask
 *
 * @typedef {{ name: string, message: string, stack: string | undefined, properties: Record<string, unknown> }} TransferableError
 *
 * @typedef {Omit<LintResult, '_postcssResult'> & {
 *   _postcssResult?: {
 *     stylelint: Pick<NonNullable<LintResult['_postcssResult']>['stylelint'],
 *       'ruleMetadata' | 'fixersData' | 'stylelintError' | 'stylelintWarning'>
 *   }
 * }} TransferableLintResult
 *
 * @typedef {{ results: TransferableLintResult[], error?: never } | { error: TransferableError, results?: never }} LintTaskResponse
 */

/**
 * Cap on the number of files a worker lints per task. Every file in a task is
 * opened concurrently, so this bounds open file descriptors; it is also the
 * pull-scheduling granularity that keeps workers evenly loaded when file
 * sizes are skewed.
 */
const MAX_FILES_PER_TASK = 64;

/**
 * With `concurrency: 'auto'`, spawn at most one worker per this many files so
 * that small runs do not pay worker startup cost for little gain. The shape of
 * the heuristic matches ESLint's `concurrency: "auto"`; the constant is higher
 * because linting a file tends to be cheaper in Stylelint.
 */
const AUTO_FILES_PER_WORKER = 128;

const workerURL = new URL('./lintWorker.mjs', import.meta.url);

/**
 * @param {LinterOptions['concurrency']} concurrency
 * @returns {void}
 */
export function validateConcurrency(concurrency) {
	if (concurrency === undefined || concurrency === 'auto') {
		return;
	}

	if (typeof concurrency === 'number' && Number.isInteger(concurrency) && concurrency >= 1) {
		return;
	}

	throw new Error(
		`Invalid option value "${concurrency}" for "concurrency": expected "auto" or a positive integer`,
	);
}

/**
 * Resolve the `concurrency` option to a worker count for the given number of
 * files. A result of `1` means "lint in the main thread, as without the
 * option".
 *
 * @param {LinterOptions['concurrency']} concurrency
 * @param {number} fileCount
 * @returns {number}
 */
export function resolveWorkerCount(concurrency, fileCount) {
	if (concurrency === undefined) {
		return 1;
	}

	if (concurrency === 'auto') {
		// Cap at half the cores, leaving room for the main thread and the rest
		// of the system; a result of 1 means the startup cost of a lone worker
		// cannot pay off, so lint in the main thread instead.
		const maxWorkers = Math.max(1, Math.floor(availableParallelism() / 2));
		const workerCount = Math.min(maxWorkers, Math.ceil(fileCount / AUTO_FILES_PER_WORKER));

		return workerCount > 1 ? workerCount : 1;
	}

	return Math.min(concurrency, Math.max(fileCount, 1));
}

/**
 * Lint files across a pool of worker threads that pull tasks from a shared
 * queue. Results come back in the order of `absoluteFilePaths`, matching what
 * linting in the main thread produces.
 *
 * @param {string[]} absoluteFilePaths
 * @param {WorkerOptions} options
 * @param {number} workerCount
 * @param {AbortSignal} [abortSignal]
 * @returns {Promise<LintResult[]>}
 */
export default function lintFilesInWorkers(absoluteFilePaths, options, workerCount, abortSignal) {
	try {
		structuredClone(options);
	} catch {
		throw new Error(
			'The "concurrency" option requires options that can be passed to worker threads. ' +
				'For example, use "configFile" instead of a "config" object containing functions',
		);
	}

	// Aim for several tasks per worker so that a worker drawing large files
	// does not become the long pole, while capping a task's file count to
	// bound concurrently open file descriptors.
	const filesPerTask = Math.max(
		1,
		Math.min(MAX_FILES_PER_TASK, Math.ceil(absoluteFilePaths.length / (workerCount * 4))),
	);

	/** @type {Array<{ offset: number, files: string[] }>} */
	const tasks = [];

	for (let offset = 0; offset < absoluteFilePaths.length; offset += filesPerTask) {
		tasks.push({ offset, files: absoluteFilePaths.slice(offset, offset + filesPerTask) });
	}

	return new Promise((resolve, reject) => {
		/** @type {LintResult[]} */
		const results = new Array(absoluteFilePaths.length);
		/** @type {Set<Worker>} */
		const workers = new Set();
		let nextTask = 0;
		let completedTasks = 0;
		let settled = false;

		const terminateAll = () => Promise.all([...workers].map((worker) => worker.terminate()));

		/** @param {unknown} error */
		const fail = (error) => {
			if (settled) return;

			settled = true;
			void terminateAll().then(() => reject(error));
		};

		const finish = () => {
			if (settled) return;

			settled = true;
			void terminateAll().then(() => resolve(results));
		};

		if (abortSignal?.aborted) {
			reject(abortSignal.reason);

			return;
		}

		abortSignal?.addEventListener('abort', () => fail(abortSignal.reason), { once: true });

		const spawn = () => {
			const worker = new Worker(workerURL, { workerData: { options } });

			workers.add(worker);

			/** @type {{ offset: number, files: string[] } | undefined} */
			let currentTask;

			const assign = () => {
				const task = tasks[nextTask];

				if (settled || !task) return;

				currentTask = task;
				nextTask += 1;
				worker.postMessage(/** @type {LintTask} */ ({ files: task.files }));
			};

			worker.on('message', (/** @type {LintTaskResponse} */ response) => {
				if (response.error) {
					const { name, message, stack, properties } = response.error;
					const error = Object.assign(new Error(message), properties, { name, stack });

					fail(error);

					return;
				}

				const task = currentTask;

				if (!task) return;

				response.results.forEach((result, index) => {
					results[task.offset + index] = /** @type {LintResult} */ (
						/** @type {unknown} */ (result)
					);
				});

				completedTasks += 1;

				if (completedTasks === tasks.length) {
					finish();
				} else {
					assign();
				}
			});

			worker.on('error', fail);

			assign();
		};

		const poolSize = Math.min(workerCount, tasks.length);

		for (let index = 0; index < poolSize; index += 1) {
			spawn();
		}
	});
}
