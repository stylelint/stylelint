/* eslint-disable prefer-template */

import pc from 'picocolors';

/**
 * Format bytes to human readable string.
 *
 * @param {number} bytes
 * @returns {string}
 */
function formatBytes(bytes) {
	if (bytes < 1024) return `${bytes} B`;

	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;

	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Format milliseconds to human readable string.
 *
 * @param {number} ms
 * @returns {string}
 */
function formatTime(ms) {
	if (ms < 1000) return `${ms.toFixed(2)}ms`;

	if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;

	return `${(ms / 60000).toFixed(2)}m`;
}

/** Standard widths for consistent formatting. */
export const WIDTH = {
	/** Narrow width for progress output. */
	narrow: 60,
	/** Medium width for detail sections. */
	medium: 76,
	/** Default width for most output. */
	default: 80,
	/** Wide width for summary tables. */
	wide: 90,
};

/**
 * Create a horizontal line.
 *
 * @param {number} [length]
 * @returns {string}
 */
function line(length = WIDTH.default) {
	return pc.dim('─'.repeat(length));
}

/**
 * Create a double horizontal line.
 *
 * @param {number} [length]
 * @returns {string}
 */
function doubleLine(length = WIDTH.default) {
	return pc.dim('═'.repeat(length));
}

/**
 * Create a major header with double lines above and below.
 *
 * @param {string} title
 * @param {number} [width]
 * @returns {string}
 */
export function header(title, width = WIDTH.default) {
	return [doubleLine(width), pc.bold(`  ${title.toUpperCase()}`), doubleLine(width)].join('\n');
}

/**
 * Create a section header with a line below.
 *
 * @param {string} title
 * @param {number} [width]
 * @param {{ indent?: boolean }} [options]
 * @returns {string}
 */
export function sectionHeader(title, width = WIDTH.narrow, options = {}) {
	const indent = options.indent ? '  ' : '';

	return [pc.bold(`${indent}${title.toUpperCase()}`), indent + line(width)].join('\n');
}

/**
 * Pad string to fixed width.
 *
 * @param {string} str
 * @param {number} width
 * @param {string} [align]
 * @returns {string}
 */
function pad(str, width, align = 'left') {
	const s = String(str);

	if (s.length >= width) return s;

	const padding = ' '.repeat(width - s.length);

	return align === 'right' ? padding + s : s + padding;
}

/**
 * Generate a report from benchmark results.
 *
 * @param {Object} allResults Results keyed by mode.
 * @returns {string}
 */
export function generateReport(allResults) {
	const modes = Object.keys(allResults);
	const lines = [];

	lines.push('');
	lines.push(header('Stylelint performance benchmark results'));
	lines.push('');

	// Get sizes from first mode's results.
	const firstModeResults = allResults[modes[0]];
	const sizes = Object.keys(firstModeResults);

	// Summary table with all modes side by side.
	lines.push(sectionHeader('Summary', WIDTH.wide, { indent: true }));

	if (modes.length === 1) {
		lines.push(
			'  ' +
				pc.dim(
					pad('Size', 10) +
						pad('Files', 8) +
						pad('Rules', 8) +
						pad('Overrides', 12) +
						pad('Time', 12) +
						pad('±CV', 8) +
						pad('Per file', 10) +
						pad('Memory', 12),
				),
		);
		lines.push('  ' + line(WIDTH.wide));

		for (const result of Object.values(firstModeResults)) {
			const config = result.workspaceConfig;
			const time = result.timing.trimmedMean;
			const cv = result.timing.cv;

			lines.push(
				'  ' +
					pad(config.name, 10) +
					pad(String(result.filesLinted), 8) +
					pad(String(config.rules), 8) +
					pad(String(config.overrides), 12) +
					pad(formatTime(time), 12) +
					pad(cv.toFixed(1) + '%', 8) +
					pad(formatTime(result.perFile.mean), 10) +
					pad(formatBytes(result.memory.peakHeap), 12),
			);
		}
	} else {
		lines.push(
			'  ' +
				pc.dim(
					pad('Size', 10) +
						pad('Files', 8) +
						pad('API time', 12) +
						pad('±CV', 7) +
						pad('/file', 10) +
						pad('CLI time', 12) +
						pad('±CV', 7) +
						pad('/file', 10),
				),
		);
		lines.push('  ' + line(WIDTH.wide));

		for (const size of sizes) {
			const apiResult = allResults.api?.[size];
			const cliResult = allResults.cli?.[size];
			const config = (apiResult || cliResult).workspaceConfig;
			const files = (apiResult || cliResult).filesLinted;

			const apiTime = apiResult ? apiResult.timing.trimmedMean : 0;
			const cliTime = cliResult ? cliResult.timing.trimmedMean : 0;
			const apiCv = apiResult?.timing.cv ?? 0;
			const cliCv = cliResult?.timing.cv ?? 0;
			const apiPerFile = apiTime / files;
			const cliPerFile = cliTime / files;

			lines.push(
				'  ' +
					pad(config.name, 10) +
					pad(String(files), 8) +
					pad(apiResult ? formatTime(apiTime) : 'N/A', 12) +
					pad(apiResult ? apiCv.toFixed(1) + '%' : '', 7) +
					pad(apiResult ? formatTime(apiPerFile) : '', 10) +
					pad(cliResult ? formatTime(cliTime) : 'N/A', 12) +
					pad(cliResult ? cliCv.toFixed(1) + '%' : '', 7) +
					pad(cliResult ? formatTime(cliPerFile) : '', 10),
			);
		}
	}

	lines.push('  ' + line(WIDTH.wide));
	lines.push('');

	// Display results per mode.
	for (const mode of modes) {
		const results = allResults[mode];

		lines.push(sectionHeader(`${mode} mode details`, WIDTH.medium, { indent: true }));
		lines.push('');

		for (const result of Object.values(results)) {
			const config = result.workspaceConfig;
			const timing = result.timing;
			const trimmed = timing.trimmedMean;
			const cv = timing.cv;

			lines.push(`  ${pc.bold(config.name)} ${pc.dim(`(${config.description})`)}:`);
			lines.push(`    Timing (${result.iterations} iterations, 2 warmup):`);
			lines.push(
				`      Trimmed mean: ${pc.cyan(formatTime(trimmed))}  ${pc.dim(`(±${cv.toFixed(1)}% CV)`)}`,
			);
			lines.push(
				`      Range: ${formatTime(timing.min)} - ${formatTime(timing.max)}  Median: ${formatTime(timing.median)}`,
			);
			lines.push(
				`    Memory: Peak ${formatBytes(result.memory.peakHeap)}, Avg Delta ${formatBytes(result.memory.avgUsed)}`,
			);

			lines.push('');
		}
	}

	lines.push(doubleLine());
	lines.push('');

	return lines.join('\n');
}

/**
 * Generate JSON report for programmatic use.
 *
 * @param {Object} allResults Results keyed by mode.
 * @returns {Object}
 */
export function generateJsonReport(allResults) {
	const report = {
		timestamp: new Date().toISOString(),
		modes: Object.keys(allResults),
		summary: {},
		detailed: {},
	};

	for (const [mode, results] of Object.entries(allResults)) {
		report.summary[mode] = {};
		report.detailed[mode] = results;

		for (const [size, result] of Object.entries(results)) {
			report.summary[mode][size] = {
				files: result.filesLinted,
				trimmedMean: result.timing.trimmedMean,
				mean: result.timing.mean,
				cv: result.timing.cv,
				perFileTime: result.perFile.mean,
				peakMemory: result.memory.peakHeap,
			};
		}
	}

	return report;
}

/**
 * Generate comparison report between two benchmark runs.
 *
 * @param {Object} baseline Baseline results from generateJsonReport.
 * @param {Object} current Current results keyed by mode.
 * @returns {string}
 */
export function generateComparisonReport(baseline, current) {
	const lines = [];

	lines.push('');
	lines.push(header('Performance comparison'));
	lines.push('');

	const modes = Object.keys(current);

	for (const mode of modes) {
		const baselineResults = baseline.detailed[mode];
		const currentResults = current[mode];

		if (!baselineResults || !currentResults) continue;

		if (modes.length > 1) {
			lines.push(sectionHeader(`${mode} Mode`, WIDTH.medium, { indent: true }));
		}

		lines.push(
			'  ' +
				pc.dim(
					pad('Size', 10) +
						pad('Baseline', 12) +
						pad('Current', 12) +
						pad('Diff', 12) +
						pad('Change', 10) +
						pad('Status', 10),
				),
		);
		lines.push('  ' + line(WIDTH.medium));

		for (const size of Object.keys(currentResults)) {
			if (!baselineResults[size]) continue;

			const baseTime = baselineResults[size].timing.trimmedMean;
			const currTime = currentResults[size].timing.trimmedMean;
			const baseCv = baselineResults[size].timing.cv;
			const currCv = currentResults[size].timing.cv;

			// Use combined CV to determine significance threshold.
			const combinedCv = Math.max(baseCv, currCv, 5); // At least 5%.
			const threshold = combinedCv / 100;

			const diff = currTime - baseTime;
			const changePercent = ((diff / baseTime) * 100).toFixed(1);

			let status;
			let statusColor;

			if (diff < -baseTime * threshold) {
				status = '✓ Faster';
				statusColor = pc.green;
			} else if (diff > baseTime * threshold) {
				status = '✗ Slower';
				statusColor = pc.red;
			} else {
				status = '≈ Same';
				statusColor = pc.dim;
			}

			const diffPrefix = diff >= 0 ? '+' : '';
			const changeColor = diff < 0 ? pc.green : diff > 0 ? pc.red : pc.dim;

			lines.push(
				'  ' +
					pad(currentResults[size].workspaceConfig.name, 10) +
					pad(formatTime(baseTime), 12) +
					pad(formatTime(currTime), 12) +
					changeColor(pad(diffPrefix + formatTime(Math.abs(diff)), 12)) +
					changeColor(pad(diffPrefix + changePercent + '%', 10)) +
					statusColor(pad(status, 10)),
			);
		}

		lines.push('  ' + line(WIDTH.medium));
		lines.push('');
	}

	lines.push(doubleLine());
	lines.push('');

	return lines.join('\n');
}
