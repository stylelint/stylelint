'use strict';

const blockNoEmpty = require('../rules/block-no-empty');
const configBlockNoEmpty = require('./fixtures/config-block-no-empty');
const standalone = require('../standalone');

jest.mock('../rules/block-no-empty');

blockNoEmpty.mockImplementation(() => {
	return (root, result) => {
		result.warn('Some parseError', {
			stylelintType: 'parseError',
		});
	};
});

describe('standalone with deprecations', () => {
	it('works', () => {
		return standalone({
			code: 'a {}',
			config: configBlockNoEmpty,
		}).then((data) => {
			expect(data.output.indexOf('Some parseError')).not.toBe(-1);
			expect(data.results).toHaveLength(1);
			expect(data.results[0].parseErrors).toHaveLength(1);
			expect(data.results[0].parseErrors[0].text).toBe('Some parseError');
		});
	});
});
