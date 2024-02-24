/**
 * @typedef {import('stylelint').Severity} Severity
 *
 * @param {Severity} severity
 * @param {boolean} maybeFixable
 * @param {Record<Severity, number>} counts
 * @returns {void}
 */
export default function calcMaybeFixableCounts(severity, maybeFixable, counts) {
	if (maybeFixable !== true) return;

	if (severity !== 'error' && severity !== 'warning') return;

	counts[severity] += 1;
}
