'use strict';

const path = require('path');
const standalone = require('../standalone');

it('standalone loading YAML with custom message', () => {
	return standalone({
		code: 'a { color: pink; }',
		configFile: path.join(__dirname, 'fixtures/config-color-named-custom-message.yaml'),
	}).then((linted) => {
		expect(linted.results[0].warnings).toHaveLength(1);
		expect(linted.results[0].warnings[0].text).toBe('Unacceptable');
	});
});
