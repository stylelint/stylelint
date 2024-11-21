import process from 'node:process';
import { table } from 'table';

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

const enabled = Boolean(process.env.TIMING);
const HEADERS = ['Rule', 'Time (ms)', 'Relative'];

/**
 * Decide how many rules to show in the output list.
 * @returns {number} The number of rules to show.
 */
function getListSize() {
	const TIMING = process.env.TIMING;
	const MINIMUM_SIZE = 10;

	if (typeof TIMING !== 'string') {
		return MINIMUM_SIZE;
	}

	if (TIMING.toLowerCase() === 'all') {
		return Number.POSITIVE_INFINITY;
	}

	const TIMING_ENV_VAR_AS_INTEGER = Number.parseInt(TIMING, 10);

	return TIMING_ENV_VAR_AS_INTEGER > 10 ? TIMING_ENV_VAR_AS_INTEGER : MINIMUM_SIZE;
}

/**
 * Display the timing data.
 * @param {{ [key: string]: number }} data Data object to be displayed.
 * @returns {void}
 * @private
 */
function display(data) {
	let total = 0;

	/** @type {Array<[string, number]>} */
	const rows = Object.keys(data).map((key) => {
		const t = data[key] ?? 0;

		total += t;

		return [key, t];
	});

	rows.sort((a, b) => b[1] - a[1]);

	// Limit the number of rows to display
	const limitedRows = rows.slice(0, getListSize());

	// Format rows with percentages
	const formattedRows = limitedRows.map((row) => {
		const percentage = total > 0 ? `${((row[1] * 100) / total).toFixed(1)}%` : '0.0%';
		const timeStr = row[1].toFixed(3);

		return [row[0], timeStr, percentage];
	});

	formattedRows.unshift(HEADERS);

	// eslint-disable-next-line no-console
	console.log(
		table(formattedRows, {
			columns: [{ alignment: 'left' }, { alignment: 'right' }, { alignment: 'right' }],
		}),
	);
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

		if (enabled) {
			data[key] = (data[key] ?? 0) + timeDiff;
		}

		return result;
	};
}

if (enabled) {
	process.on('exit', () => {
		display(data);
	});
}

export default {
	time,
	enabled,
	getListSize,
};
