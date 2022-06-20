'use strict';

const stylelint = require('../../../..');

describe('integration tests for linebrakes', () => {
	it('should not be an error (issues/3635).', async () => {
		const { output } = await stylelint.lint({
			code: 'a{color:red;}',
			config: {
				rules: {
					linebreaks: 'unix',
					'block-closing-brace-newline-before': 'always',
				},
			},
			fix: true,
		});

		expect(output).toBe('a{color:red;\n}');
	});
});
