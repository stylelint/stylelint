import report from '../../utils/report.mjs';

// Stands in for `block-no-empty` as a deprecated rule.
const ruleDeprecated = () => {
	return (root, result) => {
		report({
			ruleName: 'block-no-empty',
			message: 'Foo bar',
			node: root,
			result,
		});
	};
};

ruleDeprecated.meta = { deprecated: true };

export default ruleDeprecated;
