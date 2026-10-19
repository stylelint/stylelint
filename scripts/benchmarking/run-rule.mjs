/* eslint-disable no-console */
import { argv, exit } from 'node:process';
import { parseArgs, styleText } from 'node:util';
import { performance } from 'node:perf_hooks';
import { readFile } from 'node:fs/promises';

import stylelint from '../../lib/index.mjs';

const DEFAULT_SOURCES = [
	'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.css',
	'https://cdn.jsdelivr.net/npm/@awesome.me/webawesome@3.2.1/dist-cdn/styles/native.css',
	'https://cdn.jsdelivr.net/npm/kelpui@1.17.2/css/kelp.css',
];

const MEASURED_ITERATIONS = 50;
const WARMUP_ITERATIONS = 5;

function printHelp() {
	const script = 'node benchmark-rule.mjs';

	console.log(`Usage: ${script} <ruleName> <ruleOptions> [options]

Arguments:
  <ruleName>           Rule name.
  <ruleOptions>        Rule options (JSON format, or a bare string).

Options:
  --source=<file|url>  Source CSS, replacing the defaults. Repeatable.
  --config=<json>      Extra lint options (JSON format), e.g. '{"fix": true}'.
  --help, -h           Show the help message.

Examples:
  # With a primary option
  ${script} value-keyword-case lower

  # With secondary options (JSON format)
  ${script} value-keyword-case '["lower", {"camelCaseSvgKeywords": true}]'

  # With a config
  ${script} value-keyword-case lower --config='{"fix": true}'

  # Against local files instead of the default sources
  ${script} value-keyword-case lower --source=a.css --source=b.css`);
}

let parsedArgs;

try {
	parsedArgs = parseArgs({
		args: argv.slice(2),
		options: {
			source: { type: 'string', multiple: true, default: DEFAULT_SOURCES },
			config: { type: 'string' },
			help: { type: 'boolean', short: 'h', default: false },
		},
		allowPositionals: true,
	});
} catch (error) {
	console.error(error.message);
	printHelp();
	exit(1);
}

const {
	values: { source: sources, config, help },
	positionals: [ruleName, ruleOptions, ...unexpectedPositionals],
} = parsedArgs;

if (help) {
	printHelp();
	exit(0);
}

if (!ruleName || !ruleOptions) {
	printHelp();
	exit(1);
}

if (unexpectedPositionals.length > 0) {
	console.error(`Unexpected argument: ${unexpectedPositionals[0]}`);
	exit(1);
}

const duplicateSource = sources.find((source, index) => sources.indexOf(source) !== index);

if (duplicateSource) {
	console.error(`Duplicate source: ${duplicateSource}`);
	exit(1);
}

if (!stylelint.rules[ruleName]) {
	console.error(`Unknown rule: ${ruleName}`);
	exit(1);
}

/**
 * @param {string} source A file path or an HTTP(S) URL.
 * @returns {Promise<string>}
 */
async function readSource(source) {
	if (!/^https?:\/\//i.test(source)) {
		return readFile(source, 'utf8');
	}

	const response = await fetch(source);

	if (!response.ok) {
		throw new Error(`Failed to fetch ${source}: ${response.status} ${response.statusText}`);
	}

	return response.text();
}

// PostCSS and modern hardware is too fast to benchmark with a small source.
// Duplicating the source CSS N times gives a larger mean while reducing the deviation.
//
// 5 was chosen because it gives a mean in the 50-200ms range
// with a deviation that is ±10% of the mean for the default sources.
const DUPLICATE_SOURCE_N_TIMES = 5;

let parsedOptions = ruleOptions;

/* eslint-disable eqeqeq */
if (
	ruleOptions[0] === '[' ||
	ruleOptions[0] === '{' ||
	parsedOptions === 'true' ||
	parsedOptions === 'false' ||
	Number(parsedOptions) == parsedOptions
) {
	parsedOptions = JSON.parse(ruleOptions);
}

/* eslint-enable eqeqeq */

const lintConfig = {
	rules: { [ruleName]: parsedOptions },
	cache: false,
	formatter: () => '',
	...(config ? JSON.parse(config) : {}),
};
const lint = (code) => stylelint.lint({ code, config: lintConfig });

/** @type {Array<string>} */
let contents;

try {
	contents = await Promise.all(sources.map(readSource));
} catch (error) {
	console.error(styleText(['bold', 'red'], `Failed to read source: ${error.message}`));
	exit(1);
}

const source = contents.join('\n\n');
const css = `${source}\n\n`.repeat(DUPLICATE_SOURCE_N_TIMES);

console.log(
	`${styleText('bold', 'Sources')}: ${sources.join(', ')} (×${DUPLICATE_SOURCE_N_TIMES})`,
);

async function printLintResults() {
	const { results } = await lint(css);

	for (const { parseErrors, invalidOptionWarnings, warnings } of results) {
		for (const { text } of parseErrors) {
			console.error(styleText(['bold', 'red'], `>> ${text}`));
		}

		for (const { text } of invalidOptionWarnings) {
			console.warn(styleText(['bold', 'yellow'], `>> ${text}`));
		}

		console.log(`${styleText('bold', 'Warnings')}: ${warnings.length}`);
	}
}

await printLintResults();

for (let i = 0; i < WARMUP_ITERATIONS; i++) {
	await lint(css);
}

const durations = [];

for (let i = 0; i < MEASURED_ITERATIONS; i++) {
	const startTime = performance.now();

	await lint(css);
	durations.push(performance.now() - startTime);
}

const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const mean = average(durations);
const stdDev = Math.sqrt(average(durations.map((duration) => (duration - mean) ** 2)));

console.log(`${styleText('bold', 'Mean')}: ${mean} ms`);
console.log(`${styleText('bold', 'Deviation')}: ${stdDev} ms`);
/* eslint-enable no-console */
