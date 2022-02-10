'use strict';

/* eslint-disable no-console */
import Benchmark from 'benchmark';
import fetch from 'node-fetch';
import normalizeRuleSettings from '../lib/normalizeRuleSettings.js';
import picocolors from 'picocolors';
import postcss from 'postcss';
import rules from '../lib/rules/index.js';
const { bold, yellow } = picocolors;

const ruleName = process.argv[2];
const ruleOptions = process.argv[3];
const ruleContext = process.argv[4];

const ruleFunc = rules[ruleName];

if (!ruleFunc) {
	throw new Error('You must specify a valid rule name');
}

if (!ruleOptions) {
	throw new Error('You must specify rule options');
}

const CSS_URL = 'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.css';

let parsedOptions = ruleOptions;

/* eslint-disable eqeqeq */
if (
	ruleOptions[0] === '[' ||
	parsedOptions === 'true' ||
	parsedOptions === 'false' ||
	Number(parsedOptions) == parsedOptions
) {
	parsedOptions = JSON.parse(ruleOptions);
}

/* eslint-enable eqeqeq */
const ruleSettings = normalizeRuleSettings(parsedOptions);

const primary = ruleSettings[0];
const secondary = ruleSettings[1] || null;
const context = ruleContext ? JSON.parse(ruleContext) : {};

const rule = ruleFunc(primary, secondary, context);

const processor = postcss().use(rule);

fetch(CSS_URL)
	.then((response) => response.text())
	.then((response) => {
		const bench = new Benchmark('rule test', {
			defer: true,
			fn: (deferred) => benchFn(response, () => deferred.resolve()),
		});

		bench.on('complete', () => {
			console.log(`${bold('Mean')}: ${bench.stats.mean * 1000} ms`);
			console.log(`${bold('Deviation')}: ${bench.stats.deviation * 1000} ms`);
		});

		bench.run();
	})
	.catch((error) => console.log('error:', error));

let firstTime = true;

function benchFn(css, done) {
	processor
		.process(css, { from: undefined })
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

			done();
		})
		.catch((err) => {
			console.log(err.stack);
			done();
		});
}
/* eslint-enable no-console */
