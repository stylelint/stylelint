'use strict';

/* eslint-disable no-console */
import Benchmark from 'benchmark';
import picocolors from 'picocolors';
import postcss from 'postcss';

import normalizeRuleSettings from '../lib/normalizeRuleSettings.js';
import rules from '../lib/rules/index.js';

const { bold, yellow } = picocolors;

const [, , ruleName, ruleOptions, ruleContext] = process.argv;

const ruleFunc = rules[ruleName];

if (!ruleFunc) {
	throw new Error('You must specify a valid rule name');
}

if (!ruleOptions) {
	throw new Error('You must specify rule options');
}

const CSS_URL = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.css';

// PostCSS and modern hardware is too fast to benchmark with a small source.
// Duplicating the source CSS N times gives a larger mean while reducing the deviation.
//
// 20 was chosen because it gives a mean in the 50-200ms range
// with a deviation that is ±10% of the mean.
const DUPLICATE_SOURCE_N_TIMES = 20;

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
const ruleSettings = normalizeRuleSettings(parsedOptions);

const [primary, secondary] = ruleSettings;
const context = ruleContext ? JSON.parse(ruleContext) : {};

const rule = ruleFunc(primary, secondary, context);

const processor = postcss().use(rule);

fetch(CSS_URL)
	.then((response) => response.text())
	.then((response) => {
		let css = '';

		for (let i = 0; i < DUPLICATE_SOURCE_N_TIMES; i++) {
			css += `${response}\n\n`;
		}

		let firstTime = true;
		let lazyResult;

		const bench = new Benchmark('rule test', {
			defer: true,
			setup: () => {
				lazyResult = processor.process(css, { from: undefined });
			},
			onCycle: () => {
				lazyResult = processor.process(css, { from: undefined });
			},
			fn: (deferred) => {
				lazyResult
					.then((result) => {
						if (firstTime) {
							firstTime = false;
							result.messages
								.filter((m) => m.stylelintType === 'invalidOption')
								.forEach((m) => {
									console.log(bold(yellow(`>> ${m.text}`)));
								});
							console.log(`${bold('Warnings')}: ${result.warnings().length}`);
						}

						deferred.resolve();
					})
					.catch((err) => {
						console.error(err.stack);
						deferred.resolve();
					});
			},
		});

		bench.on('complete', () => {
			console.log(`${bold('Mean')}: ${bench.stats.mean * 1000} ms`);
			console.log(`${bold('Deviation')}: ${bench.stats.deviation * 1000} ms`);
		});

		bench.run();
	})
	.catch((error) => console.error('error:', error));
/* eslint-enable no-console */
