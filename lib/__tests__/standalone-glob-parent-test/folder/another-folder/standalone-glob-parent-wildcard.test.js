'use strict';

const standalone = require('../../../../standalone');

it('glob contains a parent directory and ** wildcard', async () => {
	const { results } = await standalone({
		files: '../**/sibling-style.css',
		config: { rules: { 'block-no-empty': true } },
		cwd: __dirname,
	});

	expect(results).toHaveLength(1);
	expect(results[0].errored).toBe(true);
	expect(results[0].warnings[0]).toEqual(
		expect.objectContaining({
			rule: 'block-no-empty',
			severity: 'error',
		}),
	);
});
