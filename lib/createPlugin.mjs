/**
 * @type {import('stylelint')['createPlugin']}
 */
export default function createPlugin(ruleName, rule) {
	return {
		ruleName,
		rule,
	};
}
