export default {
	name: 'update-rule-text',

	/** @type {(result: LintResult) => void} */
	postprocess(result) {
		const updatedWarnings = result.warnings.map((warning) => {
			let updatedWarning = { ...warning };

			// Find the rule that the warning is on and update the warning text to include it
			result._postcssResult.root.walk((node) => {
				const { start, end } = node.source;

				if (
					start.line <= warning.line &&
					end.line >= warning.line &&
					start.column <= warning.column &&
					end.column >= warning.column
				) {
					updatedWarning = {
						...updatedWarning,
						text: `${updatedWarning.text} on rule \`${node.toString().trim()}\``,
					};

					return false;
				}
			});

			return updatedWarning;
		});

		result.warnings = updatedWarnings;
	},
};
