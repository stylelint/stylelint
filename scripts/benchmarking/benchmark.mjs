/** @typedef {import('./config.mjs').WorkspaceInfo} WorkspaceInfo */
/** @typedef {import('./config.mjs').WorkspaceSize} WorkspaceSize */
/** @typedef {import('./config.mjs').BenchmarkMode} BenchmarkMode */
/** @typedef {import('./config.mjs').BenchmarkOptions} BenchmarkOptions */
/** @typedef {import('./config.mjs').BenchmarkResult} BenchmarkResult */
/** @typedef {import('./config.mjs').RawResult} RawResult */

import { fork, spawn } from 'node:child_process';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';
import process from 'node:process';

import { PEAK_MEMORY_FD } from './config.mjs';

/**
 * The result for a single benchmark iteration, before aggregation. Either
 * returned directly from the child process or parsed from its output. Duration
 * is only included if reported directly by the child process, otherwise it will
 * be measured based on the time between process start and exit.
 *
 * See {@link runChildProcess} for details.
 *
 * @typedef {Object} ParsedResult
 * @property {number} filesLinted
 * @property {number} errorsFound
 * @property {number} [duration]
 */

const PRELOAD_EXEC_ARGV = ['--import', import.meta.resolve('./peakMemoryPreload.mjs')];
// Index PEAK_MEMORY_FD is the pipe the preload writes the child's peak memory to.
const CHILD_STDIO = ['ignore', 'pipe', 'pipe', 'pipe'];
const API_RUNNER_PATH = join(import.meta.dirname, 'apiRunner.mjs');
const CLI_PATH = join(import.meta.dirname, '../..', 'bin', 'stylelint.mjs');
const PRODUCTION_ENV = { ...process.env, NODE_ENV: 'production' };

/**
 * Run a child process and track its duration and memory usage.
 *
 * @param {import('child_process').ChildProcess} child
 * @param {() => ParsedResult | null} parseResults
 * @param {string} name
 * @returns {Promise<RawResult>}
 */
function runChildProcess(child, parseResults, name) {
	return new Promise((resolve, reject) => {
		let stderr = '';
		let peakMemoryOutput = '';
		let startTime = 0;

		child.on('spawn', () => {
			startTime = performance.now();
		});

		child.stderr?.on('data', (data) => {
			stderr += data.toString();
		});

		child.stdio[PEAK_MEMORY_FD]?.on('data', (data) => {
			peakMemoryOutput += data.toString();
		});

		child.on('error', reject);

		child.on('close', (code) => {
			const elapsed = performance.now() - startTime;
			const results = parseResults();

			if (!results) {
				reject(new Error(`${name} exited with code ${code}: ${stderr}`));

				return;
			}

			const peakMemory = Number(peakMemoryOutput);

			resolve({
				duration: results.duration ?? elapsed,
				filesLinted: results.filesLinted,
				errorsFound: results.errorsFound,
				memoryUsed: peakMemory,
				peakMemory,
			});
		});
	});
}

/**
 * Run the benchmark against the Stylelint API in a child process.
 *
 * @param {WorkspaceInfo} workspace Workspace info.
 * @returns {Promise<RawResult>} Aggregated benchmark results.
 */
function runApiBenchmark(workspace) {
	const workspacePath = workspace.path.replace(/\\/g, '/');
	let lintResult = null;

	const child = fork(API_RUNNER_PATH, [workspacePath, workspace.configPath], {
		execArgv: PRELOAD_EXEC_ARGV,
		stdio: [...CHILD_STDIO, 'ipc'],
		env: PRODUCTION_ENV,
	});

	child.on('message', (msg) => {
		if (msg.type === 'end') {
			lintResult = {
				filesLinted: msg.filesLinted,
				errorsFound: msg.errorsFound,
				duration: msg.duration,
			};
		}
	});

	return runChildProcess(child, () => lintResult, 'API runner');
}

/**
 * Run the benchmark against the Stylelint CLI in a child process.
 *
 * @param {WorkspaceInfo} workspace Workspace info.
 * @returns {Promise<RawResult>} Aggregated benchmark results.
 */
function runCliBenchmark(workspace) {
	const workspacePath = workspace.path.replace(/\\/g, '/');
	let stdout = '';
	let stderr = '';

	const child = spawn(
		process.execPath,
		[
			...PRELOAD_EXEC_ARGV,
			CLI_PATH,
			`${workspacePath}/src/**/*.{css,scss,less,html,vue}`,
			'--config',
			workspace.configPath,
			'--no-cache',
			'--formatter',
			'json',
		],
		{ stdio: CHILD_STDIO, env: PRODUCTION_ENV },
	);

	child.stdout.on('data', (data) => {
		stdout += data.toString();
	});

	child.stderr.on('data', (data) => {
		stderr += data.toString();
	});

	return runChildProcess(
		child,
		() => {
			try {
				const results = JSON.parse(stderr || stdout);

				return {
					filesLinted: results.length,
					errorsFound: results.reduce((acc, r) => acc + r.warnings.length, 0),
				};
			} catch {
				return null;
			}
		},
		'CLI',
	);
}

/**
 * Get the average of an array of numbers.
 *
 * @param {number[]} values
 */
const avg = (values) => values.reduce((a, b) => a + b, 0) / values.length;

/**
 * Calculate benchmark statistics from raw results.
 *
 * @param {RawResult[]} results Raw results from multiple iterations.
 * @param {WorkspaceInfo} workspace Workspace info for context.
 * @param {number} iterations Number of iterations run.
 * @returns {BenchmarkResult}
 */
function calculateStats(results, workspace, iterations) {
	const durations = results.map((r) => r.duration);
	const sortedDurations = [...durations].sort((a, b) => a - b);
	const mean = avg(durations);

	// Standard deviation.
	const squaredDiffs = durations.map((d) => (d - mean) ** 2);
	const variance = avg(squaredDiffs);
	const stdDev = Math.sqrt(variance);

	// Trim mean by removing top and bottom 10%.
	const trimCount = Math.max(1, Math.floor(durations.length * 0.1));
	const trimmedDurations = sortedDurations.slice(trimCount, -trimCount);
	const trimmedMean = trimmedDurations.length > 0 ? avg(trimmedDurations) : mean;

	return {
		workspace: workspace.size,
		workspaceConfig: workspace.sizeConfig,
		iterations,
		filesLinted: results[0].filesLinted,
		errorsFound: results[0].errorsFound,
		timing: {
			min: Math.min(...durations),
			max: Math.max(...durations),
			mean,
			median: sortedDurations[Math.floor(sortedDurations.length / 2)],
			trimmedMean,
			stdDev,
			cv: (stdDev / mean) * 100, // Coefficient of variation as percentage.
			p95:
				sortedDurations.length >= 20
					? sortedDurations[Math.floor(sortedDurations.length * 0.95)]
					: sortedDurations[sortedDurations.length - 1],
		},
		memory: {
			avgUsed: avg(results.map((r) => r.memoryUsed)),
			peakHeap: Math.max(...results.map((r) => r.peakMemory)),
		},
		perFile: { mean: mean / results[0].filesLinted },
		raw: results,
	};
}

/**
 * Run benchmark with multiple iterations.
 *
 * @param {WorkspaceInfo} workspace Info about the workspace to benchmark.
 * @param {BenchmarkOptions} options Benchmark options.
 * @returns {Promise<BenchmarkResult>}
 */
export async function runBenchmark(workspace, { iterations, warmup, mode, logger }) {
	const run = mode === 'api' ? runApiBenchmark : runCliBenchmark;

	// Warmup iterations, which are discarded.
	if (warmup > 0) {
		logger(`  Warmup: ${warmup} iterations...`);

		for (let i = 0; i < warmup; i++) {
			await run(workspace);
		}
	}

	// Measured iterations.
	logger(`  Running ${iterations} iterations (${mode.toUpperCase()} mode)...`);
	const results = [];

	for (let i = 0; i < iterations; i++) {
		const result = await run(workspace);

		results.push(result);
		logger(`    Iteration ${i + 1}: ${result.duration.toFixed(2)}ms`);
	}

	return calculateStats(results, workspace, iterations);
}

/**
 * Run benchmarks for all workspaces.
 *
 * @param {Record<WorkspaceSize, WorkspaceInfo>} workspaces Map of size to workspace info.
 * @param {BenchmarkOptions} options Benchmark options.
 * @returns {Promise<Record<WorkspaceSize, BenchmarkResult>>} Map of size to benchmark results.
 */
export async function runAllBenchmarks(workspaces, options) {
	const results = {};

	for (const [size, workspace] of Object.entries(workspaces)) {
		options.logger?.(`\nBenchmarking ${workspace.sizeConfig.name} workspace...`);
		results[size] = await runBenchmark(workspace, options);
	}

	return results;
}
