'use strict';

/**
 * @returns {Promise<string>}
 */
module.exports = async function getStdin() {
	const chunks = [];

	for await (const chunk of process.stdin) {
		chunks.push(chunk);
	}

	return Buffer.concat(chunks).toString();
};
