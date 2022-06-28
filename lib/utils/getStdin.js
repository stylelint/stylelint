'use strict';

/**
 * @param {NodeJS.ReadStream} [stdin]
 * @returns {Promise<string>}
 */
module.exports = async function getStdin(stdin = process.stdin) {
	const chunks = [];

	for await (const chunk of stdin) {
		chunks.push(chunk);
	}

	return Buffer.concat(chunks).toString();
};
