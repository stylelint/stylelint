import path from 'node:path';
import process from 'node:process';

import createStyleText from '../utils/createStyleText.mjs';
import getRelativePath from '../utils/getRelativePath.mjs';

/** @import { TestEvent } from 'node:test/reporters' */

const FRAMES_SHOWN = 3;

// Colours only when the terminal can show them, as the built-in reporters do.
const paint = createStyleText();

/**
 * Prints one line per file as it finishes and the runner's own counts, then recaps every failure
 * under its file as suite breadcrumbs and the error message with only the stack frames from this
 * repository.
 *
 * @param {AsyncIterable<TestEvent>} source
 * @returns {AsyncGenerator<string>}
 */
export default async function* reporter(source) {
	/** @type {string[]} */
	const names = [];
	/** @type {string[]} */
	const failures = [];
	/** @type {string[]} */
	const recap = [];

	for await (const event of source) {
		switch (event.type) {
			case 'test:start':
				// Events arrive in order within a file, so the names by nesting level are the ancestors.
				names.length = event.data.nesting;
				names[event.data.nesting] = event.data.name;
				break;
			case 'test:fail': {
				const { error } = event.data.details;

				// A suite or file fails whenever a test inside it does; that test reports itself.
				if ('failureType' in error && error.failureType === 'subtestsFailed') break;

				// A file that throws while loading gets no summary of its own; its error went to stderr.
				if (event.data.nesting === 0 && path.resolve(event.data.name) === event.data.file) {
					const line = paint('red', `✖ ${relative(event.data.file)} (did not run)`);

					recap.push(line);
					yield `${line}\n`;
					break;
				}

				const breadcrumbs = [...names.slice(0, event.data.nesting), event.data.name];

				failures.push(`  ${breadcrumbs.join(' › ')}\n${indent(describeError(error), 4)}`);
				break;
			}
			case 'test:summary': {
				// Once per file when files run in their own processes, then once for the run.
				if (event.data.file) {
					const line = describeFile(event.data);

					if (failures.length > 0) {
						recap.push(`${line}\n${failures.join('\n\n')}`);
						failures.length = 0;
					}

					yield `${line} ${paint('gray', `${Math.round(event.data.duration_ms)}ms`)}\n`;
					break;
				}

				// The run's summary comes last, after the counts.
				if (failures.length > 0) recap.push(failures.join('\n\n'));

				if (recap.length > 0) {
					yield `\n${paint('red', '✖ failing tests:')}\n\n${recap.join('\n\n')}\n`;
				}

				break;
			}
			case 'test:diagnostic':
				yield `${paint('blue', `ℹ ${event.data.message}`)}\n`;
				break;
			case 'test:coverage': {
				const { totals } = event.data.summary;

				yield `${paint(
					'blue',
					`ℹ coverage: lines ${totals.coveredLinePercent.toFixed(2)}%, branches ${totals.coveredBranchPercent.toFixed(2)}%, functions ${totals.coveredFunctionPercent.toFixed(2)}%`,
				)}\n`;
				break;
			}
			case 'test:stderr':
			case 'test:stdout':
				yield event.data.message;
				break;
		}
	}
}

/**
 * @param {{ file?: string, success: boolean, counts: { tests: number, passed: number, skipped: number } }} summary
 * @returns {string}
 */
function describeFile({ file = '', success, counts }) {
	return paint(
		success ? 'green' : 'red',
		`${success ? '✔' : '✖'} ${relative(file)} (${describeCounts(counts)})`,
	);
}

/**
 * @param {{ tests: number, passed: number, skipped: number }} counts
 * @returns {string}
 */
function describeCounts({ tests, passed, skipped }) {
	if (tests === 0) return 'no tests';

	const failed = tests - passed - skipped;

	if (failed > 0) return `${failed} of ${tests} failed`;

	return skipped > 0 ? `${passed} passed, ${skipped} skipped` : `${passed} passed`;
}

/**
 * @param {Error} error The runner's wrapper; the thrown error is its `cause`.
 * @returns {string}
 */
function describeError(error) {
	const cause = error.cause instanceof Error ? error.cause : error;
	const heading =
		cause.name === 'AssertionError' ? cause.message : `${cause.name}: ${cause.message}`;
	const frames = (cause.stack ?? '')
		.split('\n')
		.filter(isRepositoryFrame)
		.slice(0, FRAMES_SHOWN)
		.map((frame) => frame.trim().replaceAll(`file://${process.cwd()}/`, ''));

	return [heading, ...frames].join('\n');
}

/**
 * @param {string} line
 * @returns {boolean}
 */
function isRepositoryFrame(line) {
	return (
		line.trimStart().startsWith('at ') &&
		line.includes(process.cwd()) &&
		!line.includes('/node_modules/')
	);
}

/**
 * @param {string} absolutePath
 * @returns {string}
 */
function relative(absolutePath) {
	return getRelativePath(process.cwd(), absolutePath);
}

/**
 * @param {string} text
 * @param {number} width
 * @returns {string}
 */
function indent(text, width) {
	return text.replace(/^/gm, ' '.repeat(width));
}
