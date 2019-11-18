'use strict';

/**
 * Omit any properties starting with `_`, which are fake-private
 * @param {import('stylelint').StylelintResult[]} results
 * @returns {string}
 */
module.exports = function(results) {
	const cleanedResults = results.map((result) =>
		Object.keys(result)
			.filter((key) => !key.startsWith('_'))
			.reduce((obj, key) => {
				obj[key] = result[key];

				return obj;
			}, {}),
	);

	return JSON.stringify(cleanedResults);
};
