import stylelint from '../../lib/index.mjs';

const ruleName = 'foo/foo';

function ruleFunc() {
	return (root, result) => {
		root.walkRules((ruleNode) => {
			const { selector } = ruleNode;

			if (selector !== 'foo') return;

			stylelint.utils.report({
				result,
				ruleName,
				message: 'Unexpected "foo" selector',
				node: ruleNode,
				word: selector,
			});
		});
	};
}

ruleFunc.ruleName = ruleName;

export default stylelint.createPlugin(ruleName, ruleFunc);
