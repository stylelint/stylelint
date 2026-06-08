/* eslint-disable no-console */
import { argv, exit } from 'node:process';

import { Bench } from 'tinybench';
import picocolors from 'picocolors';

import stylelint from '../../lib/index.mjs';

const { bold, red, yellow } = picocolors;

const [, , ruleName, ruleOptions, config] = argv;

function printHelp() {
	const script = 'node benchmark-rule.mjs';

	console.log(`Usage: ${script} <ruleName> <ruleOptions> [config]`);
	console.log('');
	console.log('Examples:');
	console.log('  # With a primary option');
	console.log(`  ${script} value-keyword-case lower`);
	console.log('');
	console.log('  # With secondary options (JSON format)');
	console.log(`  ${script} value-keyword-case '["lower", {"camelCaseSvgKeywords": true}]'`);
	console.log('');
	console.log('  # With a config');
	console.log(
		`  ${script} value-keyword-case '["lower", {"camelCaseSvgKeywords": true}]' '{"fix": true}'`,
	);
}

if (!ruleName || !ruleOptions) {
	printHelp();
	exit(1);
}

if (!stylelint.rules[ruleName]) {
	console.error(`Unknown rule: ${ruleName}`);
	exit(1);
}

const CSS_URLs = [
	'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.css',
	'https://cdn.jsdelivr.net/npm/@awesome.me/webawesome@3.2.1/dist-cdn/styles/native.css',
	'https://cdn.jsdelivr.net/npm/kelpui@1.17.2/css/kelp.css',
];

// PostCSS and modern hardware is too fast to benchmark with a small source.
// Duplicating the source CSS N times gives a larger mean while reducing the deviation.
//
// 5 was chosen because it gives a mean in the 50-200ms range
// with a deviation that is ±10% of the mean.
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

// eslint-disable-next-line n/no-unsupported-features/node-builtins -- This script is only for development. We can tolerate it.
const responses = await Promise.all(CSS_URLs.map((url) => fetch(url).then((res) => res.text())));
const source = responses.join('\n\n');
const css = `${source}\n\n`.repeat(DUPLICATE_SOURCE_N_TIMES);

const { results } = await lint(css);

results.forEach(({ parseErrors, invalidOptionWarnings, warnings }) => {
	parseErrors.forEach(({ text }) => {
		console.error(bold(red(`>> ${text}`)));
	});
	invalidOptionWarnings.forEach(({ text }) => {
		console.warn(bold(yellow(`>> ${text}`)));
	});
	console.log(`${bold('Warnings')}: ${warnings.length}`);
});

const TASK_NAME = 'rule test';
const bench = new Bench({ name: ruleName, throws: true });

bench.add(TASK_NAME, () => lint(css));

await bench.run();

const { mean, sd } = bench.getTask(TASK_NAME).result.latency;

console.log(`${bold('Mean')}: ${mean} ms`);
console.log(`${bold('Deviation')}: ${sd} ms`);
/* eslint-enable no-console */
