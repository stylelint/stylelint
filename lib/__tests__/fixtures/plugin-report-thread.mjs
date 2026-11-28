import { isMainThread } from 'node:worker_threads';

import stylelint from '../../index.mjs';

const ruleName = 'plugin/report-thread';

const messages = stylelint.utils.ruleMessages(ruleName, {
	linted: (thread) => `linted in the ${thread} thread`,
});

// Only marked files, so that unmarked files can be cached
const reportThread = () => (root, result) => {
	if (!root.toString().includes('report-thread')) return;

	stylelint.utils.report({
		result,
		ruleName,
		message: messages.linted(isMainThread ? 'main' : 'worker'),
		node: root,
		severity: 'warning',
	});
};

reportThread.ruleName = ruleName;
reportThread.messages = messages;

export default stylelint.createPlugin(ruleName, reportThread);
