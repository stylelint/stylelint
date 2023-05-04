'use strict';

const githubFormatter = require('../githubFormatter');

describe('githubFormatter', () => {
	test('outputs no warnings', () => {
		const results = [
			{
				source: 'path/to/file.css',
				warnings: [],
			},
		];
		const returnValue = { ruleMetadata: {} };

		const output = githubFormatter(results, returnValue);

		expect(output).toBe('');
	});

	test('outputs warnings', () => {
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
					{
						line: 20,
						column: 3,
						text: 'Anonymous error',
					},
				],
				parseErrors: [
					{
						line: 20,
						column: 1,
						stylelintType: 'foo-error',
						text: 'Cannot parse foo',
					},
				],
			},
		];
		const returnValue = {
			ruleMetadata: {
				foo: { url: 'https://stylelint.io/rules/foo' },
				bar: { url: 'https://stylelint.io/rules/bar', fixable: true, deprecated: true },
			},
		};

		expect(githubFormatter(results, returnValue))
			.toBe(`::error file=path/to/file.css,line=1,col=2,endLine=1,endColumn=5,title=Stylelint problem::Unexpected "foo" (foo) - https://stylelint.io/rules/foo
::warning file=a.css,line=10,col=20,title=Stylelint problem::Unexpected "bar" (bar) [maybe fixable, deprecated] - https://stylelint.io/rules/bar
::error file=a.css,line=20,col=1,title=Stylelint problem::Cannot parse foo (foo-error)
::error file=a.css,line=20,col=3,title=Stylelint problem::Anonymous error
`);
	});
});
