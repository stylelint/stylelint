import process from 'node:process';

import { alignLeft, alignRight } from './utils/alignText.mjs';
import getColumnWidth from './utils/getColumnWidth.mjs';

// Inspired by ESLint's timing.js
// https://github.com/eslint/eslint/blob/09bc2a88c00aa9a93c7de505795fc4e85b2e6357/lib/linter/timing.js

/**
 * Start time measurement.
 * @returns {bigint} Variable for tracking time in nanoseconds.
 */
function startTime() {
	return process.hrtime.bigint();
}

/**
 * End time measurement.
 * @param {bigint} start Variable for tracking time in nanoseconds.
 * @returns {number} The measured time in milliseconds.
 */
function endTime(start) {
	const diff = process.hrtime.bigint() - start;

	return Number(diff) / 1e6;
}

/**
 * @typedef {{ rank: string, rule: string, time: string, relative: string }} TimingRow
 */

/** @type {TimingRow} */
const HEADER = { rank: '#', rule: 'Rule', time: 'Time (ms)', relative: 'Relative' };

/** @type {Array<{ key: keyof TimingRow, align: typeof alignLeft }>} */
const COLUMNS = [
	{ key: 'rank', align: alignRight },
	{ key: 'rule', align: alignLeft },
	{ key: 'time', align: alignRight },
	{ key: 'relative', align: alignRight },
];

/**
 * Decide how many rules to show in the output list.
 * @returns {number} The number of rules to show.
 */
function getListSize() {
	const TIMING = process.env.TIMING;

	if (typeof TIMING === 'undefined') {
		return 0;
	}

	if (TIMING.toLowerCase() === 'all') {
		return Number.POSITIVE_INFINITY;
	}

	const parsed = Number.parseInt(TIMING, 10);

	if (!Number.isNaN(parsed) && parsed >= 1) {
		return parsed;
	}

	return 0;
}

const listSize = getListSize();
const enabled = listSize !== 0;

/**
 * Display the timing data as a Markdown table.
 * @param {{ [key: string]: number }} data Data object to be displayed.
 * @returns {void}
 * @private
 */
function display(data) {
	let total = 0;

	/** @type {Array<[string, number]>} */
	const timings = Object.keys(data).map((key) => {
		const t = data[key] ?? 0;

		total += t;

		return [key, t];
	});

	timings.sort((a, b) => b[1] - a[1]);

	/** @type {TimingRow[]} */
	const rows = [
		HEADER,
		...timings.slice(0, listSize).map(([rule, elapsed], index) => ({
			rank: String(index + 1),
			rule,
			time: elapsed.toFixed(3),
			relative: total > 0 ? `${((elapsed * 100) / total).toFixed(1)}%` : '0.0%',
		})),
	];

	const columns = COLUMNS.map((column) => ({ ...column, width: getColumnWidth(rows, column.key) }));
	const lines = rows.map(
		(row) => `| ${columns.map(({ key, align, width }) => align(row[key], width)).join(' | ')} |`,
	);
	// A delimiter cell spans its column and the space on each side of it
	const separator = `|${columns.map(({ align, width }) => align(':', width + 2, '-')).join('|')}|`;

	lines.splice(1, 0, separator);

	// eslint-disable-next-line no-console
	console.log(lines.join('\n'));
}

/** @type {{ [key: string]: number }} */
const data = Object.create(null);

/**
 * Time the execution of a function.
 * @param {string} key Key from the data object.
 * @param {Function} fn Function to be called.
 * @returns {Function} Function to be executed.
 * @private
 */
function time(key, fn) {
	return function timedFunction(/** @type {any} */ ...args) {
		const t = startTime();
		const result = fn(...args);
		const timeDiff = endTime(t);

		data[key] = (data[key] ?? 0) + timeDiff;

		return result;
	};
}

if (enabled) {
	process.on('exit', () => {
		display(data);
	});
}

export default {
	display,
	enabled,
	getListSize,
	time,
};
