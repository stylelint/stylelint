/** @typedef {import('./config.mjs').WorkspaceInfo} WorkspaceInfo */
/** @typedef {import('./config.mjs').WorkspaceSize} WorkspaceSize */
/** @typedef {import('./config.mjs').BenchmarkMode} BenchmarkMode */
/** @typedef {import('./config.mjs').BenchmarkOptions} BenchmarkOptions */
/** @typedef {import('./config.mjs').BenchmarkResult} BenchmarkResult */
/** @typedef {import('./config.mjs').RawResult} RawResult */

import { join } from 'node:path';
import { performance } from 'node:perf_hooks';
import { spawn } from 'node:child_process';

import process from 'node:process';

import pidusage from 'pidusage';

import stylelint from '../../lib/index.mjs';

import { BENCHMARK_ITERATIONS, BENCHMARK_WARMUP } from './config.mjs';

const CLI_PATH = join(import.meta.dirname, '../..', 'bin', 'stylelint.mjs');

/**
 * Run a single benchmark iteration using the API.
 *
 * @param {WorkspaceInfo} workspace Workspace info.
 * @returns {Promise<RawResult>} Benchmark results.
 */
async function runApiBenchmark(workspace) {
	const startTime = performance.now();
	const startMemory = process.memoryUsage();

	const result = await stylelint.lint({
		files: `${workspace.path}/src/**/*.{css,scss,less}`,
		configFile: workspace.configPath,
		cache: false, // Disable cache for accurate benchmarking.
	});

	const endTime = performance.now();
	const endMemory = process.memoryUsage();

	return {
		duration: endTime - startTime,
		filesLinted: result.results.length,
		errorsFound: result.results.reduce((sum, r) => sum + r.warnings.length, 0),
		memoryUsed: endMemory.heapUsed - startMemory.heapUsed,
		peakMemory: endMemory.heapUsed,
	};
}

/**
 * Run a single benchmark iteration using the CLI.
 *
 * @param {WorkspaceInfo} workspace Workspace info.
 * @returns {Promise<RawResult>} Benchmark results.
 */
async function runCliBenchmark(workspace) {
	const startTime = performance.now();

	return new Promise((resolve, reject) => {
		const args = [
			CLI_PATH,
			`${workspace.path}/src/**/*.{css,scss,less}`,
			'--config',
			workspace.configPath,
			'--no-cache',
			'--formatter',
			'json',
		];

		const child = spawn(process.execPath, args, {
			stdio: ['ignore', 'pipe', 'pipe'],
			env: { ...process.env, NODE_ENV: 'production' },
		});

		let stdout = '';
		let stderr = '';
		let peakMemory = 0;

		// Poll memory usage every 50ms.
		const memoryInterval = setInterval(async () => {
			try {
				const stats = await pidusage(child.pid);

				if (stats && stats.memory > peakMemory) {
					peakMemory = stats.memory;
				}
			} catch {
				// Process may have exited, ignore errors.
			}
		}, 50);

		child.stdout.on('data', (data) => {
			stdout += data.toString();
		});

		child.stderr.on('data', (data) => {
			stderr += data.toString();
		});

		child.on('error', (err) => {
			clearInterval(memoryInterval);
			reject(err);
		});

		child.on('close', (code) => {
			clearInterval(memoryInterval);

			const endTime = performance.now();

			// Parse JSON output to get file and error counts.
			let filesLinted = 0;
			let errorsFound = 0;

			const output = stderr || stdout;

			try {
				const results = JSON.parse(output);

				filesLinted = results.length;
				errorsFound = results.reduce((sum, r) => sum + r.warnings.length, 0);
			} catch {
				// If JSON parsing fails, check exit code. Exit code 2 means
				// lint errors were found.
				if (code !== 0 && code !== 2) {
					reject(new Error(`CLI exited with code ${code}: ${stderr}`));

					return;
				}
			}

			resolve({
				duration: endTime - startTime,
				filesLinted,
				errorsFound,
				memoryUsed: peakMemory,
				peakMemory,
			});
		});
	});
}

/**
 * Run benchmark with multiple iterations.
 *
 * @param {WorkspaceInfo} workspace Workspace info.
 * @param {BenchmarkOptions} [options] Benchmark options.
 * @returns {Promise<BenchmarkResult>} Aggregated benchmark results.
 */
export async function runBenchmark(workspace, options = {}) {
	const {
		iterations = BENCHMARK_ITERATIONS,
		warmup = BENCHMARK_WARMUP,
		mode = 'api',
		logger = () => {},
	} = options;

	const runSingleBenchmark = mode === 'cli' ? runCliBenchmark : runApiBenchmark;
	const results = [];

	// Warmup iterations, which are discarded.
	if (warmup > 0) {
		logger(`  Warmup: ${warmup} iterations...`);

		for (let i = 0; i < warmup; i++) {
			if (global.gc) {
				global.gc();
			}

			await runSingleBenchmark(workspace);
		}
	}

	logger(`  Running ${iterations} iterations (${mode.toUpperCase()} mode)...`);

	for (let i = 0; i < iterations; i++) {
		// Force garbage collection if run with --expose-gc.
		if (global.gc) {
			global.gc();
		}

		const result = await runSingleBenchmark(workspace);

		results.push(result);
		logger(`    Iteration ${i + 1}: ${result.duration.toFixed(2)}ms`);
	}

	// Calculate statistics.
	const durations = results.map((r) => r.duration);
	const sortedDurations = [...durations].sort((a, b) => a - b);
	const mean = durations.reduce((a, b) => a + b, 0) / durations.length;

	// Standard deviation.
	const squaredDiffs = durations.map((d) => (d - mean) ** 2);
	const variance = squaredDiffs.reduce((a, b) => a + b, 0) / durations.length;
	const stdDev = Math.sqrt(variance);

	// Trim mean by removing top and bottom 10%.
	const trimCount = Math.max(1, Math.floor(durations.length * 0.1));
	const trimmedDurations = sortedDurations.slice(trimCount, -trimCount);
	const trimmedMean =
		trimmedDurations.length > 0
			? trimmedDurations.reduce((a, b) => a + b, 0) / trimmedDurations.length
			: mean;

	const stats = {
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
			avgUsed: results.reduce((sum, r) => sum + r.memoryUsed, 0) / results.length,
			peakHeap: Math.max(...results.map((r) => r.peakMemory)),
		},
		perFile: {
			mean: durations.reduce((a, b) => a + b, 0) / durations.length / results[0].filesLinted,
		},
		raw: results,
	};

	return stats;
}

/**
 * Run benchmarks for all workspaces.
 *
 * @param {Record<WorkspaceSize, WorkspaceInfo>} workspaces Map of size to workspace info.
 * @param {BenchmarkOptions} [options] Benchmark options.
 * @returns {Promise<Record<WorkspaceSize, BenchmarkResult>>} Map of size to benchmark results.
 */
export async function runAllBenchmarks(workspaces, options = {}) {
	const {
		iterations = BENCHMARK_ITERATIONS,
		warmup = 2,
		mode = 'api',
		logger = () => {},
	} = options;

	const results = {};

	for (const [size, workspace] of Object.entries(workspaces)) {
		logger(`\nBenchmarking ${workspace.sizeConfig.name} workspace...`);
		results[size] = await runBenchmark(workspace, { iterations, warmup, mode, logger });
	}

	return results;
}
