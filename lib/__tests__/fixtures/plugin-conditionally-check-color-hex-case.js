'use strict';

const stylelint = require('../..');

const ruleName = 'plugin/conditionally-check-color-hex-case';

module.exports = stylelint.createPlugin(ruleName, (expectation, options, context) => {
	const colorHexCaseRule = stylelint.rules['color-hex-case'](expectation, options, context);

	return (root, result) => {
		if (!root.toString().includes('@@check-color-hex-case')) return;

		colorHexCaseRule(root, result);
	};
});
