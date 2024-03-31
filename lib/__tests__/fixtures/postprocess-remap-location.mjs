export default function remapLocationProcessor() {
	return {
		name: 'remap-location',

		/** @type {(result: LintResult) => void} */
		postprocess(result) {
			result.warnings.forEach((warning) => {
				warning.endLine = warning.endLine === undefined ? warning.line : warning.line + 5;
			});
		},
	};
}
