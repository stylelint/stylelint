'use strict';

/* eslint-disable no-console */
const Benchmark = require('benchmark');
const chalk = require('chalk');
const normalizeRuleSettings = require('../lib/normalizeRuleSettings');
const postcss = require('postcss');
const request = require('request');
const requireRule = require('../lib/requireRule');

const ruleName = process.argv[2];
const ruleOptions = process.argv[3];
const ruleContext = process.argv[4];

const ruleFunc = requireRule(ruleName);

if (!ruleFunc) {
	throw new Error('You must specify a valid rule name');
}

if (!ruleOptions) {
	throw new Error('You must specify rule options');
}

const CSS_URL = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.css';

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

const rule = ruleFunc.apply(null, [primary, secondary, context]);

const processor = postcss().use(rule);

request(CSS_URL, (error, response, body) => {
	if (error) throw error;

	const bench = new Benchmark('rule test', {
		defer: true,
		fn: (deferred) => benchFn(body, () => deferred.resolve()),
	});

	bench.on('complete', () => {
		console.log(`${chalk.bold('Mean')}: ${bench.stats.mean * 1000} ms`);
		console.log(`${chalk.bold('Deviation')}: ${bench.stats.deviation * 1000} ms`);
	});

	bench.run();
});

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
						console.log(chalk.bold.yellow(`>> ${m.text}`));
					});
				console.log(`${chalk.bold('Warnings')}: ${result.warnings().length}`);
			}

			done();
		})
		.catch((err) => {
			console.log(err.stack);
			done();
		});
}
/* eslint-enable no-console */
