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

			const text = addSemicolonForEditInfo(node, fixData).text;

			expect(text).toBe('color: red;');
		});

		test('in the middle of a block having a trailing semicolon', () => {
			const node = postcss.parse('a { color: red; top: 0px; }').first.first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('color: red');

			const text = addSemicolonForEditInfo(node, fixData).text;

			expect(text).toBe('color: red;');
		});

		test('with semicolon at the end of a block', () => {
			const node = postcss.parse('a { color: red; }').first.first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('color: red');

			const text = addSemicolonForEditInfo(node, fixData).text;

			expect(text).toBe('color: red;');
		});

		test('without semicolon at the end of a block', () => {
			const node = postcss.parse('a { color: red }').first.first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('color: red');

			const text = addSemicolonForEditInfo(node, fixData).text;

			expect(text).toBe('color: red');
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

			const text = addSemicolonForEditInfo(node, fixData).text;

			expect(text).toBe('@layer foo;');
		});

		test('in the middle of a block having a trailing semicolon', () => {
			const node = postcss.parse('@media screen { @layer foo; color: red; }').first.first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('@layer foo');

			const text = addSemicolonForEditInfo(node, fixData).text;

			expect(text).toBe('@layer foo;');
		});

		test('with semicolon at the end of a block', () => {
			const node = postcss.parse('@media screen { @layer foo; }').first.first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('@layer foo');

			const text = addSemicolonForEditInfo(node, fixData).text;

			expect(text).toBe('@layer foo;');
		});

		test('without semicolon at the end of a block', () => {
			const node = postcss.parse('@media screen { @layer foo }').first.first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('@layer foo ');

			const text = addSemicolonForEditInfo(node, fixData).text;

			expect(text).toBe('@layer foo ');
		});

		test('in the middle of a root having no trailing semicolon', () => {
			const node = postcss.parse('@layer foo; @layer bar').first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('@layer foo');

			const text = addSemicolonForEditInfo(node, fixData).text;

			expect(text).toBe('@layer foo;');
		});

		test('in the middle of a root having a trailing semicolon', () => {
			const node = postcss.parse('@layer foo; @layer bar;').first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('@layer foo');

			const text = addSemicolonForEditInfo(node, fixData).text;

			expect(text).toBe('@layer foo;');
		});

		test('with semicolon at the end of a root', () => {
			const node = postcss.parse('@layer foo;').first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('@layer foo');

			const text = addSemicolonForEditInfo(node, fixData).text;

			expect(text).toBe('@layer foo;');
		});

		test('without semicolon at the end of a root', () => {
			const node = postcss.parse('@layer foo').first;

			const fixData = {
				range: [0, 0],
				text: node.toString(),
			};

			expect(fixData.text).toBe('@layer foo');

			const text = addSemicolonForEditInfo(node, fixData).text;

			expect(text).toBe('@layer foo');
		});
	});
});
