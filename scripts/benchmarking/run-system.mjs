/* eslint-disable no-console, n/no-process-exit */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import process from 'node:process';

import pc from 'picocolors';

import {
	BENCHMARK_ITERATIONS,
	BENCHMARK_WARMUP,
	DEFAULT_MODES,
	WORKSPACE_SIZES,
} from './config.mjs';
import {
	WIDTH,
	generateComparisonReport,
	generateJsonReport,
	generateReport,
	header,
	sectionHeader,
} from './reporter.mjs';
import { generateWorkspace } from './generateWorkspace.mjs';
import { runAllBenchmarks } from './benchmark.mjs';

const WORKSPACES_DIR = join(import.meta.dirname, '.workspaces');

/**
 * Parse command line arguments.
 *
 * @returns {Object}
 */
function parseCLIArgs() {
	const { values } = parseArgs({
		options: {
			sizes: { type: 'string' },
			iterations: { type: 'string' },
			warmup: { type: 'string' },
			modes: { type: 'string' },
			'generate-only': { type: 'boolean', default: false },
			'benchmark-only': { type: 'boolean', default: false },
			output: { type: 'string', default: 'text' },
			compare: { type: 'string' },
			'compare-to': { type: 'string' },
			save: { type: 'string' },
			show: { type: 'string' },
			help: { type: 'boolean', short: 'h', default: false },
		},
		strict: false,
	});

	const args = {
		sizes: values.sizes ? values.sizes.split(',') : Object.keys(WORKSPACE_SIZES),
		iterations: values.iterations ? parseInt(values.iterations, 10) : BENCHMARK_ITERATIONS,
		warmup: values.warmup ? parseInt(values.warmup, 10) : BENCHMARK_WARMUP,
		modes: values.modes
			? values.modes.split(',').filter((m) => m === 'api' || m === 'cli')
			: [...DEFAULT_MODES],
		generateOnly: values['generate-only'],
		benchmarkOnly: values['benchmark-only'],
		output: values.output,
		compare: values.compare ?? null,
		compareTo: values['compare-to'] ?? null,
		save: values.save ?? null,
		show: values.show ?? null,
		help: values.help,
	};

	return args;
}

/**
 * Print help message.
 */
function printHelp() {
	console.log(`
Stylelint Performance Benchmark Runner

Usage:
  npm run benchmark -- [options]

Options:
  --sizes=small,medium,large    Comma-separated list of sizes to benchmark
                                Available: ${Object.keys(WORKSPACE_SIZES).join(', ')}
  --modes=api,cli               Comma-separated list of modes (default: ${DEFAULT_MODES.join(',')})
  --iterations=N                Number of measured iterations (default: ${BENCHMARK_ITERATIONS})
  --warmup=N                    Number of warmup iterations to discard (default: ${BENCHMARK_WARMUP})
  --generate-only               Only generate workspaces, don't run benchmarks
  --benchmark-only              Only run benchmarks, don't generate workspaces
  --output=FORMAT               Output format: text or json (default: text)
  --compare=FILE                Compare current run against baseline JSON file
  --compare-to=FILE             Compare --compare file against this file without running benchmarks
  --save=FILE                   Save results to JSON file
  --show=FILE                   Display results from a saved JSON file
  --help                        Show this help message

Examples:
  npm run benchmark                              # Run full benchmark suite.
  npm run benchmark -- --modes=api               # Run API mode only.
  npm run benchmark -- --sizes=small,medium      # Only test small and medium.
  npm run benchmark -- --iterations=20           # More iterations for accuracy.
  npm run benchmark -- --save=baseline.json      # Save for later comparison.
  npm run benchmark -- --compare=baseline.json   # Compare against baseline.
  npm run benchmark -- --compare=old.json --compare-to=new.json  # Compare two files directly.
  npm run benchmark -- --show=results.json       # Display saved benchmark results.

Workspace Sizes:
`);

	for (const [size, config] of Object.entries(WORKSPACE_SIZES)) {
		console.log(`  ${size.padEnd(10)} ${config.description}`);
	}

	console.log('');
}

/**
 * Main entry point.
 */
async function main() {
	const args = parseCLIArgs();

	if (args.help) {
		printHelp();
		process.exit(0);
	}

	const log = args.output === 'json' ? console.error : console.log;

	// Display saved benchmark results.
	if (args.show) {
		log('');
		log(header('Stylelint Benchmark Results', WIDTH.narrow));
		log('');

		try {
			const savedData = await readFile(args.show, 'utf-8');
			const saved = JSON.parse(savedData);

			log(`  File: ${pc.cyan(args.show)}`);

			if (saved.timestamp) {
				log(`  Recorded: ${pc.dim(saved.timestamp)}`);
			}

			log(generateReport(saved.detailed));
		} catch (error) {
			console.error(`Error loading file: ${error.message}`);
			process.exit(1);
		}

		log(pc.green('Done!'));
		log('');
		process.exit(0);
	}

	// Direct file comparison mode (no benchmark run needed).
	if (args.compare && args.compareTo) {
		log('');
		log(header('Stylelint Performance Comparison', WIDTH.narrow));
		log('');

		try {
			const baselineData = await readFile(args.compare, 'utf-8');
			const baseline = JSON.parse(baselineData);

			const currentData = await readFile(args.compareTo, 'utf-8');
			const current = JSON.parse(currentData);

			log(`  Baseline: ${pc.cyan(args.compare)}`);
			log(`  Current:  ${pc.cyan(args.compareTo)}`);

			log(generateComparisonReport(baseline, current.detailed));
		} catch (error) {
			console.error(`Error loading files for comparison: ${error.message}`);
			process.exit(1);
		}

		log(pc.green('Done!'));
		log('');
		process.exit(0);
	}

	log('');
	log(header('Stylelint Performance Benchmark', WIDTH.narrow));
	log('');

	// Validate sizes.
	for (const size of args.sizes) {
		if (!WORKSPACE_SIZES[size]) {
			console.error(`Unknown workspace size: ${size}`);
			console.error(`Available sizes: ${Object.keys(WORKSPACE_SIZES).join(', ')}`);
			process.exit(1);
		}
	}

	// Create workspaces directory.
	await mkdir(WORKSPACES_DIR, { recursive: true });

	const workspaces = {};

	// Generate workspaces.
	if (!args.benchmarkOnly) {
		log(sectionHeader('Generating Workspaces'));

		for (const size of args.sizes) {
			const workspacePath = join(WORKSPACES_DIR, size);

			workspaces[size] = await generateWorkspace(workspacePath, size, { logger: log });
		}

		log('');
	} else {
		// Load existing workspace info.
		log(sectionHeader('Using Existing Workspaces'));

		for (const size of args.sizes) {
			const workspacePath = join(WORKSPACES_DIR, size);
			const configPath = join(workspacePath, 'stylelint.config.mjs');

			workspaces[size] = {
				path: workspacePath,
				size,
				sizeConfig: WORKSPACE_SIZES[size],
				configPath,
			};
			log(`  ${pc.green('✓')} ${WORKSPACE_SIZES[size].name} workspace ready`);
		}

		log('');
	}

	// Run benchmarks.
	if (!args.generateOnly) {
		log(sectionHeader('Running Benchmarks'));
		log(`  Modes: ${pc.cyan(args.modes.map((m) => m.toUpperCase()).join(', '))}`);
		log(`  Warmup: ${args.warmup}, Iterations: ${args.iterations}`);

		const allResults = {};

		for (const mode of args.modes) {
			log('');
			log(`  ${pc.cyan(mode.toUpperCase())} mode...`);

			const results = await runAllBenchmarks(workspaces, {
				iterations: args.iterations,
				warmup: args.warmup,
				mode,
				logger: (msg) => log(`    ${msg}`),
			});

			allResults[mode] = results;
		}

		// Output results.
		if (args.output === 'json') {
			const jsonReport = generateJsonReport(allResults);

			console.log(JSON.stringify(jsonReport, null, 2));
		} else {
			console.log(generateReport(allResults));
		}

		// Save results if requested.
		if (args.save) {
			const jsonReport = generateJsonReport(allResults);

			await writeFile(args.save, `${JSON.stringify(jsonReport, null, 2)}\n`);
			log(`${pc.green('✓')} Results saved to: ${pc.cyan(args.save)}`);
		}

		// Compare against baseline if requested.
		if (args.compare) {
			try {
				const baselineData = await readFile(args.compare, 'utf-8');
				const baseline = JSON.parse(baselineData);

				log(generateComparisonReport(baseline, allResults));
			} catch (error) {
				console.error(`Error loading baseline file: ${error.message}`);
			}
		}
	}

	log(pc.green('Done!'));
	log('');

	// Native modules from workers may keep handles open, force exit to ensure
	// the process doesn't hang after completion.
	process.exit(0);
}

main().catch((error) => {
	console.error('Benchmark failed:', error);
	process.exit(1);
});
