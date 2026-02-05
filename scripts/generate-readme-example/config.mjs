export default {
	rules: {
		'color-function-notation': 'modern',
		'custom-property-pattern': [
			'^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
			{
				message: (name) => `Expected custom property name "${name}" to be kebab-case`,
			},
		],
		'named-grid-areas-no-invalid': true,
		'no-duplicate-selectors': true,
		'property-no-unknown': true,
		'selector-max-class': [1, { severity: 'warning' }],
		'unit-disallowed-list': [['px'], { severity: 'warning' }],
	},
};
