'use strict';

module.exports = function processorFencedBlocks(options = {}) {
	const specialMessage = options.specialMessage || 'was processed';

	return {
		code(input) {
			const blocks = [...input.matchAll(/```start([\s\S]+?)```end/g)];
			const toLint = blocks.map((match) => match[1]).join('\n\n');

			return toLint;
		},
		result(stylelintResult) {
			return { ...stylelintResult, specialMessage };
		},
	};
};
