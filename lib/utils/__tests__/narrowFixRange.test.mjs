import postcss from 'postcss';

import narrowFixRange from '../narrowFixRange.mjs';

function applyFixData(originalText, replacementText, range) {
	let prefix = originalText.slice(0, range[0]);
	let suffix = originalText.slice(range[1]);

	return prefix + replacementText + suffix;
}

describe('narrowFixRange', () => {
	test('no source', () => {
		const node = postcss.rule({ selector: 'foo' });

		const fixData = {
			range: [0, 6],
			text: 'Foo {}',
		};

		const narrowRange = narrowFixRange(node, fixData);

		expect(narrowRange).toMatchObject({
			range: [0, 6],
			text: 'Foo {}',
		});

		expect(applyFixData('foo {}', narrowRange.text, narrowRange.range)).toBe('Foo {}');
	});

	describe('replace', () => {
		test('a single character at the start of a source', () => {
			const node = postcss.parse('foo {}').first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'Foo {}',
			};

			const narrowRange = narrowFixRange(node, fixData);

			expect(narrowRange).toMatchObject({
				range: [0, 1],
				text: 'F',
			});

			expect(applyFixData('foo {}', narrowRange.text, narrowRange.range)).toBe('Foo {}');
		});

		test('a single character at the start of a declaration', () => {
			const node = postcss.parse('a {color: red}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'Color: red',
			};

			const narrowRange = narrowFixRange(node, fixData);

			expect(narrowRange).toMatchObject({
				range: [3, 4],
				text: 'C',
			});

			expect(applyFixData('a {color: red}', narrowRange.text, narrowRange.range)).toBe(
				'a {Color: red}',
			);
		});

		test('a single character at the end of a source', () => {
			const node = postcss.parse('@import bar.css').first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: '@import bar.csS',
			};

			const narrowRange = narrowFixRange(node, fixData);

			expect(narrowRange).toMatchObject({
				range: [14, 15],
				text: 'S',
			});

			expect(applyFixData('@import bar.css', narrowRange.text, narrowRange.range)).toBe(
				'@import bar.csS',
			);
		});

		test('a single character at the end of a declaration', () => {
			const node = postcss.parse('a {color: red}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'color: reD',
			};

			const narrowRange = narrowFixRange(node, fixData);

			expect(narrowRange).toMatchObject({
				range: [12, 13],
				text: 'D',
			});

			expect(applyFixData('a {color: red}', narrowRange.text, narrowRange.range)).toBe(
				'a {color: reD}',
			);
		});

		test('a single character in the middle of a declaration', () => {
			const node = postcss.parse('a {color: red}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'colOr: red',
			};

			const narrowRange = narrowFixRange(node, fixData);

			expect(narrowRange).toMatchObject({
				range: [6, 7],
				text: 'O',
			});

			expect(applyFixData('a {color: red}', narrowRange.text, narrowRange.range)).toBe(
				'a {colOr: red}',
			);
		});
	});

	describe('insert', () => {
		test('a single character at the start of a source', () => {
			const node = postcss.parse('oo {}').first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'foo {}',
			};

			const narrowRange = narrowFixRange(node, fixData);

			expect(narrowRange).toMatchObject({
				range: [0, 1],
				text: 'fo',
			});

			expect(applyFixData('oo {}', narrowRange.text, narrowRange.range)).toBe('foo {}');
		});

		test('a single character at the start of a declaration', () => {
			const node = postcss.parse('a {color: red}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: '-color: red',
			};

			const narrowRange = narrowFixRange(node, fixData);

			expect(narrowRange).toMatchObject({
				range: [3, 4],
				text: '-c',
			});

			expect(applyFixData('a {color: red}', narrowRange.text, narrowRange.range)).toBe(
				'a {-color: red}',
			);
		});

		test('a single character at the end of a source', () => {
			const node = postcss.parse('@import bar.cs').first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: '@import bar.css',
			};

			const narrowRange = narrowFixRange(node, fixData);

			expect(narrowRange).toMatchObject({
				range: [13, 14],
				text: 'ss',
			});

			expect(applyFixData('@import bar.cs', narrowRange.text, narrowRange.range)).toBe(
				'@import bar.css',
			);
		});

		test('a single character at the end of a declaration', () => {
			const node = postcss.parse('a {color: red}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'color: red-',
			};

			const narrowRange = narrowFixRange(node, fixData);

			expect(narrowRange).toMatchObject({
				range: [12, 13],
				text: 'd-',
			});

			expect(applyFixData('a {color: red}', narrowRange.text, narrowRange.range)).toBe(
				'a {color: red-}',
			);
		});

		test('a single character in the middle of a declaration', () => {
			const node = postcss.parse('a {color: red}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'color-: red',
			};

			const narrowRange = narrowFixRange(node, fixData);

			expect(narrowRange).toMatchObject({
				range: [7, 8],
				text: 'r-',
			});

			expect(applyFixData('a {color: red}', narrowRange.text, narrowRange.range)).toBe(
				'a {color-: red}',
			);
		});

		test('a single character that is already present', () => {
			const node = postcss.parse('a {--foo: z}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: '--foo: zz',
			};

			const narrowRange = narrowFixRange(node, fixData);

			expect(narrowRange).toMatchObject({
				range: [10, 11],
				text: 'zz',
			});

			expect(applyFixData('a {--foo: z}', narrowRange.text, narrowRange.range)).toBe(
				'a {--foo: zz}',
			);
		});

		test('a single character that is already present multiple times', () => {
			const node = postcss.parse('a {--foo: zzz}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: '--foo: zzzz',
			};

			const narrowRange = narrowFixRange(node, fixData);

			expect(narrowRange).toMatchObject({
				range: [12, 13],
				text: 'zz',
			});

			expect(applyFixData('a {--foo: zzz}', narrowRange.text, narrowRange.range)).toBe(
				'a {--foo: zzzz}',
			);
		});

		test('multiple characters at the end of a declaration', () => {
			const node = postcss.parse('a {--foo: abc}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: '--foo: abcdef',
			};

			const narrowRange = narrowFixRange(node, fixData);

			expect(narrowRange).toMatchObject({
				range: [12, 13],
				text: 'cdef',
			});

			expect(applyFixData('a {--foo: abc}', narrowRange.text, narrowRange.range)).toBe(
				'a {--foo: abcdef}',
			);
		});

		test('multiple characters that are already present', () => {
			const node = postcss.parse('a {--foo: abc}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: '--foo: abcabc',
			};

			const narrowRange = narrowFixRange(node, fixData);

			expect(narrowRange).toMatchObject({
				range: [12, 13],
				text: 'cabc',
			});

			expect(applyFixData('a {--foo: abc}', narrowRange.text, narrowRange.range)).toBe(
				'a {--foo: abcabc}',
			);
		});
	});

	describe('remove', () => {
		test('a single character at the start of a source', () => {
			const node = postcss.parse('foo {}').first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'oo {}',
			};

			const narrowRange = narrowFixRange(node, fixData);

			expect(narrowRange).toMatchObject({
				range: [0, 1],
				text: '',
			});

			expect(applyFixData('foo {}', narrowRange.text, narrowRange.range)).toBe('oo {}');
		});

		test('a single character at the start of a declaration', () => {
			const node = postcss.parse('a {color: red}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'olor: red',
			};

			const narrowRange = narrowFixRange(node, fixData);

			expect(narrowRange).toMatchObject({
				range: [3, 4],
				text: '',
			});

			expect(applyFixData('a {color: red}', narrowRange.text, narrowRange.range)).toBe(
				'a {olor: red}',
			);
		});

		test('a single character at the end of a source', () => {
			const node = postcss.parse('@import bar').first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: '@import ba',
			};

			const narrowRange = narrowFixRange(node, fixData);

			expect(narrowRange).toMatchObject({
				range: [10, 11],
				text: '',
			});

			expect(applyFixData('@import bar', narrowRange.text, narrowRange.range)).toBe('@import ba');
		});

		test('a single repeated character at the end of a source', () => {
			const node = postcss.parse('@import bar.css').first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: '@import bar.cs',
			};

			const narrowRange = narrowFixRange(node, fixData);

			expect(narrowRange).toMatchObject({
				range: [14, 15],
				text: '',
			});

			expect(applyFixData('@import bar.css', narrowRange.text, narrowRange.range)).toBe(
				'@import bar.cs',
			);
		});

		test('a single character at the end of a declaration', () => {
			const node = postcss.parse('a {color: red}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'color: re',
			};

			const narrowRange = narrowFixRange(node, fixData);

			expect(narrowRange).toMatchObject({
				range: [12, 13],
				text: '',
			});

			expect(applyFixData('a {color: red}', narrowRange.text, narrowRange.range)).toBe(
				'a {color: re}',
			);
		});

		test('a single character in the middle of a declaration', () => {
			const node = postcss.parse('a {color: red}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'colr: red',
			};

			const narrowRange = narrowFixRange(node, fixData);

			expect(narrowRange).toMatchObject({
				range: [6, 7],
				text: '',
			});

			expect(applyFixData('a {color: red}', narrowRange.text, narrowRange.range)).toBe(
				'a {colr: red}',
			);
		});
	});
});
