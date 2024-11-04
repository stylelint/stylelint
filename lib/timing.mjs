import process from 'node:process';

// Inspired by ESLint's timing.js
// https://github.com/eslint/eslint/blob/main/lib/linter/timing.js

/**
 * Start time measurement.
 * @returns {[number, number]} Variable for tracking time.
 */
function startTime() {
	return process.hrtime();
}

/**
 * End time measurement.
 * @param {[number, number]} t Variable for tracking time.
 * @returns {number} The measured time in milliseconds.
 */
function endTime(t) {
	const hrtime = process.hrtime(t);

	return hrtime[0] * 1e3 + hrtime[1] / 1e6;
}

/**
 * Align the string to the left.
 * @param {string} str String to align.
 * @param {number} len Length to align to.
 * @param {string} [ch=' '] Padding character.
 * @returns {string} Modified string.
 * @private
 */
function alignLeft(str, len, ch = ' ') {
	return str + ch.repeat(len - str.length);
}

/**
 * Align the string to the right.
 * @param {string} str String to align.
 * @param {number} len Length to align to.
 * @param {string} [ch=' '] Padding character.
 * @returns {string} Modified string.
 * @private
 */
function alignRight(str, len, ch = ' ') {
	return ch.repeat(len - str.length) + str;
}

const enabled = Boolean(process.env.TIMING);

const HEADERS = ['Rule', 'Time (ms)', 'Relative'];
const ALIGN = [alignLeft, alignRight, alignRight];

/**
 * Decide how many rules to show in the output list.
 * @returns {number} The number of rules to show.
 */
function getListSize() {
	const MINIMUM_SIZE = 10;

	if (typeof process.env.TIMING !== 'string') {
		return MINIMUM_SIZE;
	}

	if (process.env.TIMING.toLowerCase() === 'all') {
		return Number.POSITIVE_INFINITY;
	}

	const TIMING_ENV_VAR_AS_INTEGER = Number.parseInt(process.env.TIMING, 10);

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
		const percentage = total > 0 ? `${((row[1] * 100) / total).toFixed(1)  }%` : '0.0%';
		const timeStr = row[1].toFixed(3);

		return [row[0], timeStr, percentage];
	});

	formattedRows.unshift(HEADERS);

	/**  @type {Array<number>} */
	const widths = [];

	formattedRows.forEach((row) => {
		row.forEach((cell, index) => {
			const len = typeof cell === 'string' ? cell.length : String(cell).length;

			widths[index] = Math.max(widths[index] || 0, len);
		});
	});

	const table = formattedRows.map((row) =>
		row
			.map((cell, index) => (ALIGN[index] ? ALIGN[index](String(cell), widths[index] ?? 0) : cell))
			.join(' | '),
	);

	table.splice(
		1,
		0,
		widths
			.map((width, index) => {
				const extraAlignment = index !== 0 && index !== widths.length - 1 ? 2 : 1;

				return ALIGN[index] ? ALIGN[index](':', width + extraAlignment, '-') : ':';
			})
			.join('|'),
	);

	console.log(table.join('\n')); // eslint-disable-line no-console -- Debugging function
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
