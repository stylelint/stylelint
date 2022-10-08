'use strict';

const standalone = require('../../../standalone');

it('glob has parent directory', async () => {
	const { results } = await standalone({
		files: '../parent-folder-style.css',
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
