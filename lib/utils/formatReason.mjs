/**
 * Lowercase the first character and drop any trailing period
 * so that a parser message reads as the reason clause of a problem message
 *
 * @param {string} message
 * @returns {string}
 */
export default function formatReason(message) {
	const clause = message.replace(/\.$/, '');

	return clause.charAt(0).toLowerCase() + clause.slice(1);
}
