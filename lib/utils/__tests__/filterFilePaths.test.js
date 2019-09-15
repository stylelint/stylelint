'use strict';

const filterFilePaths = require('../filterFilePaths');
const ignore = require('ignore');

describe('filterFilePaths', () => {
	it('empty ignorefile', () => {
		const ignorer = ignore().add('');
		const files = ['a.css', 'b/c/d.css', 'e/f.css', '../w.css'];

		expect(filterFilePaths(ignorer, files)).toEqual(files);
	});

	it('ignore some files', () => {
		const ignorer = ignore().add('*.css\n!e/f.css');
		const files = ['a.css', 'b/c/d.css', 'e/f.css', '../w.css'];

		expect(filterFilePaths(ignorer, files)).toEqual(['e/f.css', '../w.css']);
	});
});
