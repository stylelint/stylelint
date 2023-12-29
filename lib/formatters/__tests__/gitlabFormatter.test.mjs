import gitlabFormatter from '../gitlabFormatter.mjs';

describe('gitlabFormatter', () => {
	test('outputs no warnings', () => {
		const results = [
			{
				source: 'path/to/file.css',
				warnings: [],
			},
		];
		const returnValue = { ruleMetadata: {} };

		const output = gitlabFormatter(results, returnValue);

		expect(output).toBe('[]');
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
		const expectedOutput = JSON.stringify([
			{
				description: 'Unexpected "foo" (foo) - https://stylelint.io/rules/foo',
				check_name: 'foo',
				fingerprint: '10ssns5',
				severity: 'major',
				location: {
					path: 'path/to/file.css',
					positions: {
						begin: {
							line: 1,
							column: 2,
						},
						end: {
							line: 1,
							column: 5,
						},
					},
				},
			},
			{
				description:
					'Unexpected "bar" (bar) [maybe fixable, deprecated] - https://stylelint.io/rules/bar',
				check_name: 'bar',
				fingerprint: '75eic6',
				severity: 'minor',
				location: {
					path: 'a.css',
					positions: {
						begin: {
							line: 10,
							column: 20,
						},
					},
				},
			},
			{
				description: 'Cannot parse foo (foo-error)',
				check_name: 'foo-error',
				fingerprint: '1uucgy4',
				severity: 'major',
				location: {
					path: 'a.css',
					positions: {
						begin: {
							line: 20,
							column: 1,
						},
					},
				},
			},
			{
				description: 'Anonymous error',
				fingerprint: 'lbq06l',
				severity: 'major',
				location: {
					path: 'a.css',
					positions: {
						begin: {
							line: 20,
							column: 3,
						},
					},
				},
			},
		]);

		expect(gitlabFormatter(results, returnValue)).toBe(expectedOutput);
	});
});
