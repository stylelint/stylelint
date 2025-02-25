import postcss from 'postcss';

import addSemicolonForEditInfo from '../addSemicolonForEditInfo.mjs';

describe('addSemicolonForEditInfo', () => {
	describe('declaration', () => {
		test('in the middle of a block having no trailing semicolon', () => {
			const node = postcss.parse('a { color: red; top: 0px }').first.first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('color: red');

			expect(addSemicolonForEditInfo(node, fixData)).toMatchObject({
				range: [0, 0],
				text: 'color: red;',
			});
		});

		test('in the middle of a block having a trailing semicolon', () => {
			const node = postcss.parse('a { color: red; top: 0px; }').first.first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('color: red');

			expect(addSemicolonForEditInfo(node, fixData)).toMatchObject({
				range: [0, 0],
				text: 'color: red;',
			});
		});

		test('with semicolon at the end of a block', () => {
			const node = postcss.parse('a { color: red; }').first.first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('color: red');

			expect(addSemicolonForEditInfo(node, fixData)).toMatchObject({
				range: [0, 0],
				text: 'color: red;',
			});
		});

		test('without semicolon at the end of a block', () => {
			const node = postcss.parse('a { color: red }').first.first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('color: red');

			expect(addSemicolonForEditInfo(node, fixData)).toMatchObject({
				range: [0, 0],
				text: 'color: red',
			});
		});
	});

	describe('atrule', () => {
		test('in the middle of a block having no trailing semicolon', () => {
			const node = postcss.parse('@media screen { @layer foo; color: red }').first.first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('@layer foo');

			expect(addSemicolonForEditInfo(node, fixData)).toMatchObject({
				range: [0, 0],
				text: '@layer foo;',
			});
		});

		test('in the middle of a block having a trailing semicolon', () => {
			const node = postcss.parse('@media screen { @layer foo; color: red; }').first.first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('@layer foo');

			expect(addSemicolonForEditInfo(node, fixData)).toMatchObject({
				range: [0, 0],
				text: '@layer foo;',
			});
		});

		test('with semicolon at the end of a block', () => {
			const node = postcss.parse('@media screen { @layer foo; }').first.first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('@layer foo');

			expect(addSemicolonForEditInfo(node, fixData)).toMatchObject({
				range: [0, 0],
				text: '@layer foo;',
			});
		});

		test('without semicolon at the end of a block', () => {
			const node = postcss.parse('@media screen { @layer foo }').first.first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('@layer foo ');

			expect(addSemicolonForEditInfo(node, fixData)).toMatchObject({
				range: [0, 0],
				text: '@layer foo ',
			});
		});

		test('in the middle of a root having no trailing semicolon', () => {
			const node = postcss.parse('@layer foo; @layer bar').first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('@layer foo');

			expect(addSemicolonForEditInfo(node, fixData)).toMatchObject({
				range: [0, 0],
				text: '@layer foo;',
			});
		});

		test('in the middle of a root having a trailing semicolon', () => {
			const node = postcss.parse('@layer foo; @layer bar;').first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('@layer foo');

			expect(addSemicolonForEditInfo(node, fixData)).toMatchObject({
				range: [0, 0],
				text: '@layer foo;',
			});
		});

		test('with semicolon at the end of a root', () => {
			const node = postcss.parse('@layer foo;').first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('@layer foo');

			expect(addSemicolonForEditInfo(node, fixData)).toMatchObject({
				range: [0, 0],
				text: '@layer foo;',
			});
		});

		test('without semicolon at the end of a root', () => {
			const node = postcss.parse('@layer foo').first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('@layer foo');

			expect(addSemicolonForEditInfo(node, fixData)).toMatchObject({
				range: [0, 0],
				text: '@layer foo',
			});
		});

		test('Pass in root (undefined parent)', () => {
			const node = postcss.parse('@layer foo').first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('@layer foo');

			expect(addSemicolonForEditInfo(node.parent, fixData)).toMatchObject({
				range: [0, 0],
				text: '@layer foo',
			});
		});
	});
});
