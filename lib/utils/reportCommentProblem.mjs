/**
 * @param {{
 *   rule: string;
 *   message: string;
 *   severity: import('stylelint').Severity;
 *   commentNode: import('postcss').Comment;
 *   postcssResult: import('stylelint').PostcssResult;
 * }} args
 * @returns {void}
 */
export default function reportCommentProblem({
	rule,
	message,
	severity,
	commentNode,
	postcssResult,
}) {
	const { source } = commentNode;

	// If the comment doesn't have a location, we can't report a useful error.
	// In practice we expect all comments to have locations, though.
	if (!source?.start) return;

	postcssResult.warn(message, {
		rule,
		severity,
		node: commentNode,
		start: source.start,
		end: source.end,
	});

	switch (severity) {
		case 'error':
			postcssResult.stylelint.stylelintError = true;
			break;
		case 'warning':
			postcssResult.stylelint.stylelintWarning = true;
			break;
		default:
			// no-op
			break;
	}
}
