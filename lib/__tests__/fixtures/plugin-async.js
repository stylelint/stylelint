'use strict';

const stylelint = require('../../index.cjs');

const ruleName = 'plugin/async';

const rule = (enabled) => (root, result) => {
	const validOptions = stylelint.utils.validateOptions(result, ruleName, {
		actual: enabled,
		possible: [true],
	});

	if (!validOptions) {
		return null;
	}

	return new Promise((resolve) => {
		setTimeout(() => {
			stylelint.utils.report({
				result,
				ruleName,
				message: 'Async rule',
				node: root,
			});
			resolve();
		});
	});
};

module.exports = stylelint.createPlugin(ruleName, rule);
