'use strict';

const path = require('path');

const standalone = require('../standalone');

it('standalone loading YAML with custom message', async () => {
	const { results } = await standalone({
		code: 'a { color: pink; }',
		configFile: path.join(__dirname, 'fixtures', 'config-color-named-custom-message.yaml'),
	});

	expect(results[0].warnings).toHaveLength(1);
	expect(results[0].warnings[0].text).toBe('Unacceptable');
});
