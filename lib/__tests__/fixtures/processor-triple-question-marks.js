'use strict';

const execall = require('execall');

module.exports = function() {
	let found = false;

	return {
		code(input) {
			const blocks = execall(/\?\?\?start([\s\S]+?)\?\?\?end/g, input);
			const toLint = blocks.map((match) => match.subMatches[0]).join('\n\n');

			if (toLint.length > 0) {
				found = true;
			}

			return toLint;
		},
		result(stylelintResult) {
			return Object.assign({}, stylelintResult, {
				tripleQuestionMarkBlocksFound: found,
			});
		},
	};
};
