import stylelint from '../../lib/index.mjs';

const code = `
.foo {
  grid-template-areas: "a b" "a";
}

.foo {
  colr: red;
  block-size: 10px;
  --Foo: 0;
}

.foo.bar {
  color: rgb(0, 0, 0);
}
`;

const codeFilename = 'styles.css';

const config = {
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

const result = await stylelint.lint({
	code,
	codeFilename,
	config,
	formatter: 'string',
});

// eslint-disable-next-line no-console
console.log(result.report);
