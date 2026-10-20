import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import mergeSyntaxDefinitions from '../mergeSyntaxDefinitions.mjs';

describe('mergeSyntaxDefinitions', () => {
	test('merge definitions with undefined arguments', () => {
		const a = { syntax: { types: { a: 'a' } } };
		const b = {};
		const c = {};

		assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a.syntax, b.syntax), a.syntax);

		assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b.syntax, a.syntax), a.syntax);

		assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b.syntax, c.syntax), {});
	});

	describe('atRules', () => {
		test('merge definitions where `atrule` is undefined', () => {
			const a = { atrules: { a: { prelude: 'a' } } };
			const b = {};
			const c = {};

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), a);

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, a), a);

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, c), {});
		});

		test('merge preludes', () => {
			const a = { atrules: { a: { prelude: 'a' } } };
			const b = { atrules: { a: { prelude: '| b' } } };

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), {
				atrules: { a: { prelude: 'a | b' } },
			});

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, a), {
				atrules: { a: { prelude: 'a' } },
			});
		});

		test('override preludes', () => {
			const a = { atrules: { a: { prelude: 'a' } } };
			const b = { atrules: { a: { prelude: 'b' } } };

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), {
				atrules: { a: { prelude: 'b' } },
			});
		});

		test('merge descriptors', () => {
			const a = { atrules: { a: { descriptors: { a: 'a' } } } };
			const b = { atrules: { a: { descriptors: { a: '| b' } } } };

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), {
				atrules: { a: { descriptors: { a: 'a | b' } } },
			});

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, a), {
				atrules: { a: { descriptors: { a: 'a' } } },
			});
		});

		test('override descriptors', () => {
			const a = { atrules: { a: { descriptors: { a: 'a' } } } };
			const b = { atrules: { a: { descriptors: { a: 'b' } } } };

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), {
				atrules: { a: { descriptors: { a: 'b' } } },
			});
		});
	});

	describe('properties', () => {
		test('merge definitions where `properties` is undefined', () => {
			const a = { properties: { a: 'a' } };
			const b = {};
			const c = {};

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), a);

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, a), a);

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, c), {});
		});

		test('merge properties', () => {
			const a = { properties: { a: 'a' } };
			const b = { properties: { a: ' | b' } }; // extra leading space

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), { properties: { a: 'a | b' } });

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, a), { properties: { a: 'a' } });
		});

		test('override properties', () => {
			const a = { properties: { a: 'a' } };
			const b = { properties: { a: 'b' } };

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), { properties: { a: 'b' } });
		});
	});

	describe('types', () => {
		test('merge definitions where `types` is undefined', () => {
			const a = { types: { a: 'a' } };
			const b = {};
			const c = {};

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), a);

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, a), a);

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, c), {});
		});

		test('merge types', () => {
			const a = { types: { a: 'a' } };
			const b = { types: { a: ' | b' } }; // extra leading space

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), { types: { a: 'a | b' } });

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, a), { types: { a: 'a' } });
		});

		test('override types', () => {
			const a = { types: { a: 'a' } };
			const b = { types: { a: 'b' } };

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), { types: { a: 'b' } });
		});
	});

	describe('units', () => {
		test('merge definitions where `units` is undefined', () => {
			const a = { units: { length: ['--foo'] } };
			const b = {};
			const c = {};

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), a);

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, a), a);

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, c), {});
		});

		test('merge units with different categories', () => {
			const a = { units: { length: ['--foo'] } };
			const b = { units: { angle: ['--bar'] } };

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), {
				units: { length: ['--foo'], angle: ['--bar'] },
			});
		});

		test('merge units with same category', () => {
			const a = { units: { length: ['--foo', '--bar'] } };
			const b = { units: { length: ['--bar', '--baz'] } };

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), {
				units: { length: ['--foo', '--bar', '--baz'] },
			});
		});
	});

	describe('CSS wide keywords', () => {
		test('merge definitions where `cssWideKeywords` is undefined', () => {
			const a = { cssWideKeywords: [] };
			const b = {};
			const c = {};

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), a);

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, a), a);

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(b, c), {});
		});

		test('merge keywords', () => {
			const a = { cssWideKeywords: ['a', 'b'] };
			const b = { cssWideKeywords: ['a', 'c'] };

			assert.partialDeepStrictEqual(mergeSyntaxDefinitions(a, b), {
				cssWideKeywords: ['a', 'b', 'c'],
			});
		});
	});
});
