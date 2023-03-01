'use strict';

const path = require('path');
const { existsSync } = require('fs');
const standalone = require('../standalone');
const safeChdir = require('../testUtils/safeChdir');
const fixturePath = require('../testUtils/fixturePath');
const configColorNamed = require('./fixtures/config-color-named.json');

const fixture = fixturePath.bind(null, __dirname);
const cwd = fixture('extensions');

describe('extensions', () => {
	test('array', async () => {
		const inputFiles = [fixture('no-empty-source.html'), cwd];
		const { results } = await standalone({
			files: inputFiles,
			customSyntax: 'postcss-scss',
			extensions: ['css', 'scss'],
			config: {
				rules: { 'color-named': 'never' },
			},
		});

		expect(results).toHaveLength(3);
		expect(existsSync(fixture('extensions', 'foo.json'))).toBe(true);
		expect(results[0].source).toBe(fixture('no-empty-source.html'));
		expect(results[1].source).toBe(fixture('extensions', 'bar.scss'));
		expect(results[2].source).toBe(fixture('extensions', 'folder', 'qux.css'));
	});

	test('default', async () => {
		const { results } = await standalone({
			files: [cwd],
			config: { rules: { 'color-named': 'never' } },
		});

		expect(results).toHaveLength(1);
		expect(results[0].source).toBe(fixture('extensions', 'folder', 'qux.css'));
	});

	test('dot prefix', async () => {
		const { results } = await standalone({
			files: [cwd],
			config: { rules: { 'color-named': 'never' } },
			extensions: ['.scss'],
			customSyntax: 'postcss-scss',
		});

		expect(results).toHaveLength(1);
		expect(results[0].source).toContain('bar.scss');
	});

	test('no match', () => {
		return expect(
			standalone({
				files: [cwd],
				config: configColorNamed,
				extensions: ['js'],
				cwd,
			}),
		).rejects.toThrow('All input files were ignored');
	});
});

describe('inputs', () => {
	safeChdir(cwd);

	test('.', async () => {
		const { results } = await standalone({
			files: ['.'],
			config: configColorNamed,
			extensions: ['css', 'scss'],
			customSyntax: 'postcss-scss',
			cwd,
		});

		expect(results).toHaveLength(2);
		expect(existsSync('foo.json')).toBe(true);
		expect(existsSync('folder/baz.json')).toBe(true);
		expect(results[0].source).toContain('bar.scss');
		expect(results[1].source).toContain(path.normalize('folder/qux.css'));
	});

	test('false positive', async () => {
		const inputFiles = [cwd, fixture('config-color-named.json')];
		const { results } = await standalone({
			files: inputFiles,
			config: configColorNamed,
			extensions: ['css', 'scss'],
			customSyntax: 'postcss-scss',
			cwd,
		});

		expect(results).toHaveLength(3);
		expect(results[0].source).toContain('bar.scss');
		expect(results[1].source).toContain(path.normalize('folder/qux.css'));
		expect(results[2].source).toContain(path.normalize('fixtures/config-color-named.json'));
	});

	test('common prefix', async () => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const inputFiles = [path.join(cwd, 'folder'), path.join(cwd, 'folder-slash', 'file.json')];
		const { results } = await standalone({
			files: inputFiles,
			config: configColorNamed,
			extensions: ['css'],
			cwd,
		});

		expect(results).toHaveLength(2);
		expect(results[0].source).toContain(path.normalize('folder/qux.css'));
		expect(results[1].source).toContain(path.normalize('folder-slash/file.json'));
		warn.mockRestore();
	});

	test('**', async () => {
		const { results } = await standalone({
			files: ['**'],
			config: configColorNamed,
			extensions: ['css', 'scss'],
			customSyntax: 'postcss-scss',
			cwd,
		});

		expect(results).toHaveLength(5);
		expect(results[0].source).toContain('bar.scss');
		expect(results[1].source).toContain('foo.json');
		expect(results[2].source).toContain(path.normalize('folder/baz.json'));
		expect(results[3].source).toContain(path.normalize('folder/qux.css'));
		expect(results[4].source).toContain(path.normalize('folder-slash/file.json'));
	});
});
