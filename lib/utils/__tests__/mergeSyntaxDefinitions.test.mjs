import { describe, test } from 'node:test';

import mergeSyntaxDefinitions from '../mergeSyntaxDefinitions.mjs';

describe('mergeSyntaxDefinitions', () => {
	test('merge definitions with undefined arguments', (t) => {
		const a = { syntax: { types: { a: 'a' } } };
		const b = {};
		const c = {};

		t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a.syntax, b.syntax), a.syntax);

		t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b.syntax, a.syntax), a.syntax);

		t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b.syntax, c.syntax), {});
	});

	describe('atRules', () => {
		test('merge definitions where `atrule` is undefined', (t) => {
			const a = { atrules: { a: { prelude: 'a' } } };
			const b = {};
			const c = {};

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), a);

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, a), a);

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, c), {});
		});

		test('merge preludes', (t) => {
			const a = { atrules: { a: { prelude: 'a' } } };
			const b = { atrules: { a: { prelude: '| b' } } };

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), {
				atrules: { a: { prelude: 'a | b' } },
			});

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, a), {
				atrules: { a: { prelude: 'a' } },
			});
		});

		test('override preludes', (t) => {
			const a = { atrules: { a: { prelude: 'a' } } };
			const b = { atrules: { a: { prelude: 'b' } } };

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), {
				atrules: { a: { prelude: 'b' } },
			});
		});

		test('merge descriptors', (t) => {
			const a = { atrules: { a: { descriptors: { a: 'a' } } } };
			const b = { atrules: { a: { descriptors: { a: '| b' } } } };

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), {
				atrules: { a: { descriptors: { a: 'a | b' } } },
			});

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, a), {
				atrules: { a: { descriptors: { a: 'a' } } },
			});
		});

		test('override descriptors', (t) => {
			const a = { atrules: { a: { descriptors: { a: 'a' } } } };
			const b = { atrules: { a: { descriptors: { a: 'b' } } } };

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), {
				atrules: { a: { descriptors: { a: 'b' } } },
			});
		});
	});

	describe('properties', () => {
		test('merge definitions where `properties` is undefined', (t) => {
			const a = { properties: { a: 'a' } };
			const b = {};
			const c = {};

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), a);

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, a), a);

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, c), {});
		});

		test('merge properties', (t) => {
			const a = { properties: { a: 'a' } };
			const b = { properties: { a: ' | b' } }; // extra leading space

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), { properties: { a: 'a | b' } });

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, a), { properties: { a: 'a' } });
		});

		test('override properties', (t) => {
			const a = { properties: { a: 'a' } };
			const b = { properties: { a: 'b' } };

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), { properties: { a: 'b' } });
		});
	});

	describe('types', () => {
		test('merge definitions where `types` is undefined', (t) => {
			const a = { types: { a: 'a' } };
			const b = {};
			const c = {};

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), a);

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, a), a);

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, c), {});
		});

		test('merge types', (t) => {
			const a = { types: { a: 'a' } };
			const b = { types: { a: ' | b' } }; // extra leading space

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), { types: { a: 'a | b' } });

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, a), { types: { a: 'a' } });
		});

		test('override types', (t) => {
			const a = { types: { a: 'a' } };
			const b = { types: { a: 'b' } };

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), { types: { a: 'b' } });
		});
	});

	describe('units', () => {
		test('merge definitions where `units` is undefined', (t) => {
			const a = { units: { length: ['--foo'] } };
			const b = {};
			const c = {};

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), a);

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, a), a);

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, c), {});
		});

		test('merge units with different categories', (t) => {
			const a = { units: { length: ['--foo'] } };
			const b = { units: { angle: ['--bar'] } };

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), {
				units: { length: ['--foo'], angle: ['--bar'] },
			});
		});

		test('merge units with same category', (t) => {
			const a = { units: { length: ['--foo', '--bar'] } };
			const b = { units: { length: ['--bar', '--baz'] } };

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), {
				units: { length: ['--foo', '--bar', '--baz'] },
			});
		});
	});

	describe('CSS wide keywords', () => {
		test('merge definitions where `cssWideKeywords` is undefined', (t) => {
			const a = { cssWideKeywords: [] };
			const b = {};
			const c = {};

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), a);

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, a), a);

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, c), {});
		});

		test('merge keywords', (t) => {
			const a = { cssWideKeywords: ['a', 'b'] };
			const b = { cssWideKeywords: ['a', 'c'] };

			t.assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), {
				cssWideKeywords: ['a', 'b', 'c'],
			});
		});
	});
});
