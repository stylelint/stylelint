'use strict';

const path = require('path');
const standalone = require('../standalone');
const fixturesPath = path.join(__dirname, 'fixtures');

it('extensions array', async () => {
	const inputFiles = [
		path.join(fixturesPath, 'no-empty-source.html'),
		path.join(fixturesPath, 'extensions'),
	];
	const { results } = await standalone({
		files: inputFiles,
		customSyntax: 'postcss-scss',
		extensions: ['css', 'scss'],
		config: {
			rules: { 'color-named': 'never' },
		},
	});

	expect(results).toHaveLength(3);
	expect(results[0].source.endsWith('no-empty-source.html')).toBe(true);
	expect(results[1].source.endsWith(path.join('extensions', 'bar.scss'))).toBe(true);
	expect(results[2].source.endsWith(path.join('extensions', 'folder', 'qux.css'))).toBe(true);
});

it('extensions default', async () => {
	const { results } = await standalone({
		files: [path.join(fixturesPath, 'extensions')],
		config: { rules: { 'color-named': 'never' } },
	});

	expect(results).toHaveLength(1);
	expect(results[0].source.endsWith(path.join('extensions', 'folder', 'qux.css'))).toBe(true);
});
