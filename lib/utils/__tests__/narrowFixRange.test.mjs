import { describe, test } from 'node:test';

import postcss from 'postcss';

import addSemicolonForEditInfo from '../addSemicolonForEditInfo.mjs';
import narrowFixRange from '../narrowFixRange.mjs';

function applyFixData(originalText, replacementText, range) {
	const prefix = originalText.slice(0, range[0]);
	const suffix = originalText.slice(range[1]);

	return prefix + replacementText + suffix;
}

describe('narrowFixRange', () => {
	test('no source', (t) => {
		const node = postcss.rule({ selector: 'foo' });

		const fixData = {
			range: [0, 6],
			text: 'Foo {}',
		};

		const narrowRange = narrowFixRange(node, fixData);

		t.assert.partialDeepStrictEqual(narrowRange, {
			range: [0, 6],
			text: 'Foo {}',
		});

		t.assert.strictEqual(applyFixData('foo {}', narrowRange.text, narrowRange.range), 'Foo {}');
	});

	describe('replace', () => {
		test('a single character at the start of a source', (t) => {
			const node = postcss.parse('foo {}').first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'Foo {}',
			};

			const narrowRange = narrowFixRange(node, fixData);

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [0, 1],
				text: 'F',
			});

			t.assert.strictEqual(applyFixData('foo {}', narrowRange.text, narrowRange.range), 'Foo {}');
		});

		test('a single character at the start of a declaration', (t) => {
			const node = postcss.parse('a {color: red}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'Color: red',
			};

			const narrowRange = narrowFixRange(node, fixData);

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [3, 4],
				text: 'C',
			});

			t.assert.strictEqual(
				applyFixData('a {color: red}', narrowRange.text, narrowRange.range),
				'a {Color: red}',
			);
		});

		test('a single character at the end of a source', (t) => {
			const node = postcss.parse('@import bar.css').first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: '@import bar.csS',
			};

			const narrowRange = narrowFixRange(node, fixData);

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [14, 15],
				text: 'S',
			});

			t.assert.strictEqual(
				applyFixData('@import bar.css', narrowRange.text, narrowRange.range),
				'@import bar.csS',
			);
		});

		test('a single character at the end of a declaration', (t) => {
			const node = postcss.parse('a {color: red}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'color: reD',
			};

			const narrowRange = narrowFixRange(node, fixData);

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [12, 13],
				text: 'D',
			});

			t.assert.strictEqual(
				applyFixData('a {color: red}', narrowRange.text, narrowRange.range),
				'a {color: reD}',
			);
		});

		test('a single character in the middle of a declaration', (t) => {
			const node = postcss.parse('a {color: red}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'colOr: red',
			};

			const narrowRange = narrowFixRange(node, fixData);

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [6, 7],
				text: 'O',
			});

			t.assert.strictEqual(
				applyFixData('a {color: red}', narrowRange.text, narrowRange.range),
				'a {colOr: red}',
			);
		});
	});

	describe('insert', () => {
		test('a single character at the start of a source', (t) => {
			const node = postcss.parse('oo {}').first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'foo {}',
			};

			const narrowRange = narrowFixRange(node, fixData);

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [0, 1],
				text: 'fo',
			});

			t.assert.strictEqual(applyFixData('oo {}', narrowRange.text, narrowRange.range), 'foo {}');
		});

		test('a single character at the start of a declaration', (t) => {
			const node = postcss.parse('a {color: red}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: '-color: red',
			};

			const narrowRange = narrowFixRange(node, fixData);

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [3, 4],
				text: '-c',
			});

			t.assert.strictEqual(
				applyFixData('a {color: red}', narrowRange.text, narrowRange.range),
				'a {-color: red}',
			);
		});

		test('a single character at the end of a source', (t) => {
			const node = postcss.parse('@import bar.cs').first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: '@import bar.css',
			};

			const narrowRange = narrowFixRange(node, fixData);

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [13, 14],
				text: 'ss',
			});

			t.assert.strictEqual(
				applyFixData('@import bar.cs', narrowRange.text, narrowRange.range),
				'@import bar.css',
			);
		});

		test('a single character at the end of a declaration', (t) => {
			const node = postcss.parse('a {color: red}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'color: red-',
			};

			const narrowRange = narrowFixRange(node, fixData);

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [12, 13],
				text: 'd-',
			});

			t.assert.strictEqual(
				applyFixData('a {color: red}', narrowRange.text, narrowRange.range),
				'a {color: red-}',
			);
		});

		test('a single character in the middle of a declaration', (t) => {
			const node = postcss.parse('a {color: red}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'color-: red',
			};

			const narrowRange = narrowFixRange(node, fixData);

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [7, 8],
				text: 'r-',
			});

			t.assert.strictEqual(
				applyFixData('a {color: red}', narrowRange.text, narrowRange.range),
				'a {color-: red}',
			);
		});

		test('a single character that is already present', (t) => {
			const node = postcss.parse('a {--foo: z}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: '--foo: zz',
			};

			const narrowRange = narrowFixRange(node, fixData);

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [10, 11],
				text: 'zz',
			});

			t.assert.strictEqual(
				applyFixData('a {--foo: z}', narrowRange.text, narrowRange.range),
				'a {--foo: zz}',
			);
		});

		test('a single character that is already present multiple times', (t) => {
			const node = postcss.parse('a {--foo: zzz}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: '--foo: zzzz',
			};

			const narrowRange = narrowFixRange(node, fixData);

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [12, 13],
				text: 'zz',
			});

			t.assert.strictEqual(
				applyFixData('a {--foo: zzz}', narrowRange.text, narrowRange.range),
				'a {--foo: zzzz}',
			);
		});

		test('multiple characters at the end of a declaration', (t) => {
			const node = postcss.parse('a {--foo: abc}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: '--foo: abcdef',
			};

			const narrowRange = narrowFixRange(node, fixData);

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [12, 13],
				text: 'cdef',
			});

			t.assert.strictEqual(
				applyFixData('a {--foo: abc}', narrowRange.text, narrowRange.range),
				'a {--foo: abcdef}',
			);
		});

		test('multiple characters that are already present', (t) => {
			const node = postcss.parse('a {--foo: abc}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: '--foo: abcabc',
			};

			const narrowRange = narrowFixRange(node, fixData);

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [12, 13],
				text: 'cabc',
			});

			t.assert.strictEqual(
				applyFixData('a {--foo: abc}', narrowRange.text, narrowRange.range),
				'a {--foo: abcabc}',
			);
		});
	});

	describe('remove', () => {
		test('a single character at the start of a source', (t) => {
			const node = postcss.parse('foo {}').first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'oo {}',
			};

			const narrowRange = narrowFixRange(node, fixData);

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [0, 1],
				text: '',
			});

			t.assert.strictEqual(applyFixData('foo {}', narrowRange.text, narrowRange.range), 'oo {}');
		});

		test('a single character at the start of a declaration', (t) => {
			const node = postcss.parse('a {color: red}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'olor: red',
			};

			const narrowRange = narrowFixRange(node, fixData);

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [3, 4],
				text: '',
			});

			t.assert.strictEqual(
				applyFixData('a {color: red}', narrowRange.text, narrowRange.range),
				'a {olor: red}',
			);
		});

		test('a single character at the end of a source', (t) => {
			const node = postcss.parse('@import bar').first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: '@import ba',
			};

			const narrowRange = narrowFixRange(node, fixData);

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [10, 11],
				text: '',
			});

			t.assert.strictEqual(
				applyFixData('@import bar', narrowRange.text, narrowRange.range),
				'@import ba',
			);
		});

		test('a single repeated character at the end of a source', (t) => {
			const node = postcss.parse('@import bar.css').first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: '@import bar.cs',
			};

			const narrowRange = narrowFixRange(node, fixData);

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [14, 15],
				text: '',
			});

			t.assert.strictEqual(
				applyFixData('@import bar.css', narrowRange.text, narrowRange.range),
				'@import bar.cs',
			);
		});

		test('a single character at the end of a declaration', (t) => {
			const node = postcss.parse('a {color: red}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'color: re',
			};

			const narrowRange = narrowFixRange(node, fixData);

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [12, 13],
				text: '',
			});

			t.assert.strictEqual(
				applyFixData('a {color: red}', narrowRange.text, narrowRange.range),
				'a {color: re}',
			);
		});

		test('a single character in the middle of a declaration', (t) => {
			const node = postcss.parse('a {color: red}').first.first;

			const fixData = {
				range: [node.source.start?.offset, node.source.end?.offset],
				text: 'colr: red',
			};

			const narrowRange = narrowFixRange(node, fixData);

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [6, 7],
				text: '',
			});

			t.assert.strictEqual(
				applyFixData('a {color: red}', narrowRange.text, narrowRange.range),
				'a {colr: red}',
			);
		});
	});

	describe('semicolon', () => {
		test('trailing in declaration', (t) => {
			const node = postcss.parse('a { opacity: 45%; }').first.first;

			node.value = '0.45';

			const fixData = {
				range: [4, 17],
				text: node.toString(),
			};

			const narrowRange = narrowFixRange(node, addSemicolonForEditInfo(node, fixData));

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [13, 16],
				text: '0.45',
			});

			t.assert.strictEqual(
				applyFixData('a { opacity: 45%; }', narrowRange.text, narrowRange.range),
				'a { opacity: 0.45; }',
			);
		});

		test('added during fix', (t) => {
			const node = postcss.parse('a { opacity: 45% }').first.first;

			node.parent.raws.semicolon = true;

			const fixData = {
				range: [4, 16],
				text: node.toString(),
			};

			const narrowRange = narrowFixRange(node, addSemicolonForEditInfo(node, fixData));

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [15, 16],
				text: '%;',
			});

			t.assert.strictEqual(
				applyFixData('a { opacity: 45% }', narrowRange.text, narrowRange.range),
				'a { opacity: 45%; }',
			);
		});

		test('atrule with trailing semicolon', (t) => {
			const node = postcss.parse('@layer foo; @layer bar').first;

			node.params = 'qux';

			const fixData = {
				range: [0, 11],
				text: node.toString(),
			};

			const narrowRange = narrowFixRange(node, addSemicolonForEditInfo(node, fixData));

			t.assert.partialDeepStrictEqual(narrowRange, {
				range: [7, 10],
				text: 'qux',
			});

			t.assert.strictEqual(
				applyFixData('@layer foo; @layer bar', narrowRange.text, narrowRange.range),
				'@layer qux; @layer bar',
			);
		});
	});
});
