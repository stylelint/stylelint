'use strict';

const stylelint = require('../..');

const ruleName = 'plugin/conditionally-check-color-named';

module.exports = stylelint.createPlugin(ruleName, (expectation, options, context) => {
	const colorNamedRule = stylelint.rules['color-named'](expectation, options, context);

	return (root, result) => {
		if (!root.toString().includes('@@check-color-named')) return;

		colorNamedRule(root, result);
	};
});
