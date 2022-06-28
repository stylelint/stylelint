'use strict';

const githubFormatter = require('../githubFormatter');

test('githubFormatter', () => {
	const results = [
		{
			source: 'path/to/file.css',
			warnings: [
				{
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 5,
					rule: 'foo',
					severity: 'error',
					text: 'Unexpected "foo" (foo)',
				},
			],
		},
		{
			source: 'a.css',
			warnings: [
				{
					line: 10,
					column: 20,
					rule: 'bar',
					severity: 'warning',
					text: 'Unexpected "bar" (bar)',
				},
			],
		},
	];
	const returnValue = {
		ruleMetadata: {
			foo: { url: 'https://stylelint.io/rules/foo' },
			bar: { fixable: true },
		},
	};

	expect(githubFormatter(results, returnValue))
		.toBe(`::error file=path/to/file.css,line=1,col=2,endLine=1,endColumn=5,title=Stylelint problem::Unexpected "foo" (foo) - https://stylelint.io/rules/foo
::warning file=a.css,line=10,col=20,title=Stylelint problem::Unexpected "bar" (bar) [fixable]`);
});
