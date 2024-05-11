export default function updateRuleText() {
	return {
		name: 'update-rule-text',

		postprocess(result, root) {
			const updatedWarnings = result.warnings.map((warning) => {
				let updatedWarning = { ...warning };

				// Find the rule that the warning is on and update the warning text to include it
				root?.walk((node) => {
					const { start, end } = node.source;

					if (
						start.line <= warning.line &&
						end.line >= warning.endLine &&
						start.column <= warning.column &&
						end.column + 1 >= warning.endColumn
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
}
