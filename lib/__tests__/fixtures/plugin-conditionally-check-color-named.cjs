'use strict';

const stylelint = require('../../index.cjs');

const ruleName = 'plugin/conditionally-check-color-named';

module.exports = stylelint.createPlugin(ruleName, (expectation, options, context) => {
	const colorNamedRule = stylelint.rules['color-named'].then((rule) =>
		rule(expectation, options, context),
	);

	return (root, result) => {
		if (!root.toString().includes('@@check-color-named')) return;

		return colorNamedRule.then((rule) => rule(root, result));
	};
});
