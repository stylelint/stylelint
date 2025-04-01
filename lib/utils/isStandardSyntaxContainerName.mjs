/**
 * Check whether a @container name is standard
 *
 * @param {string} containerName
 * @returns {boolean}
 */
export default function isStandardSyntaxFunction(containerName) {
	if (!containerName) return false;

	if (containerName === 'none') return false;

	if (containerName === 'or') return false;

	if (containerName === 'and') return false;

	if (containerName === 'not') return false;

	return true;
}
