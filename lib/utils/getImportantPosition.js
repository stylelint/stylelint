'use strict';

/**
 * @typedef {{ index: number, endIndex: number }} Position
 * @param {string} source
 * @returns {Position | undefined}
 */
module.exports = function getImportantPosition(source) {
	const pattern = /!\s*important\b/gi;
	const match = pattern.exec(source);

	if (!match) return;

	return { index: match.index, endIndex: pattern.lastIndex };
};
