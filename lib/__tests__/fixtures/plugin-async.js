'use strict';

const stylelint = require('../..');

const ruleName = 'plugin/async';

const rule = (enabled) => (root, result) => {
	const validOptions = stylelint.utils.validateOptions(result, ruleName, {
		actual: enabled,
		possible: [true, false],
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
	}, 1);
};

module.exports = stylelint.createPlugin(ruleName, rule);
