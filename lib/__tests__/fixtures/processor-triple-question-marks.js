'use strict';

module.exports = function () {
	let found = false;

	return {
		code(input) {
			const blocks = [...input.matchAll(/\?{3}start([\s\S]+?)\?{3}end/g)];
			const toLint = blocks.map((match) => match[1]).join('\n\n');

			if (toLint.length > 0) {
				found = true;
			}

			return toLint;
		},
		result(stylelintResult) {
			return { ...stylelintResult, tripleQuestionMarkBlocksFound: found };
		},
	};
};
