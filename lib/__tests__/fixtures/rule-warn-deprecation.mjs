// Stands in for `block-no-empty` to report a deprecation.
export default function ruleWarnDeprecation() {
	return (root, result) => {
		result.warn('Some deprecation', { stylelintType: 'deprecation' });
	};
}
