import mergeSyntaxDefinitions from '../mergeSyntaxDefinitions.mjs';

describe('mergeSyntaxDefinitions', () => {
	test('merge definitions with undefined arguments', () => {
		const a = { syntax: { types: { a: 'a' } } };
		const b = {};
		const c = {};

		expect(mergeSyntaxDefinitions(a.syntax, b.syntax)).toMatchObject(a.syntax);

		expect(mergeSyntaxDefinitions(b.syntax, a.syntax)).toMatchObject(a.syntax);

		expect(mergeSyntaxDefinitions(b.syntax, c.syntax)).toMatchObject({});
	});

	describe('atRules', () => {
		test('merge definitions where `atrule` is undefined', () => {
			const a = { atrules: { a: { prelude: 'a' } } };
			const b = {};
			const c = {};

			expect(mergeSyntaxDefinitions(a, b)).toMatchObject(a);

			expect(mergeSyntaxDefinitions(b, a)).toMatchObject(a);

			expect(mergeSyntaxDefinitions(b, c)).toMatchObject({});
		});

		test('merge preludes', () => {
			const a = { atrules: { a: { prelude: 'a' } } };
			const b = { atrules: { a: { prelude: '| b' } } };

			expect(mergeSyntaxDefinitions(a, b)).toMatchObject({ atrules: { a: { prelude: 'a | b' } } });

			expect(mergeSyntaxDefinitions(b, a)).toMatchObject({ atrules: { a: { prelude: 'a' } } });
		});

		test('override preludes', () => {
			const a = { atrules: { a: { prelude: 'a' } } };
			const b = { atrules: { a: { prelude: 'b' } } };

			expect(mergeSyntaxDefinitions(a, b)).toMatchObject({ atrules: { a: { prelude: 'b' } } });
		});

		test('merge descriptors', () => {
			const a = { atrules: { a: { descriptors: { a: 'a' } } } };
			const b = { atrules: { a: { descriptors: { a: '| b' } } } };

			expect(mergeSyntaxDefinitions(a, b)).toMatchObject({
				atrules: { a: { descriptors: { a: 'a | b' } } },
			});

			expect(mergeSyntaxDefinitions(b, a)).toMatchObject({
				atrules: { a: { descriptors: { a: 'a' } } },
			});
		});

		test('override descriptors', () => {
			const a = { atrules: { a: { descriptors: { a: 'a' } } } };
			const b = { atrules: { a: { descriptors: { a: 'b' } } } };

			expect(mergeSyntaxDefinitions(a, b)).toMatchObject({
				atrules: { a: { descriptors: { a: 'b' } } },
			});
		});
	});

	describe('properties', () => {
		test('merge definitions where `properties` is undefined', () => {
			const a = { properties: { a: 'a' } };
			const b = {};
			const c = {};

			expect(mergeSyntaxDefinitions(a, b)).toMatchObject(a);

			expect(mergeSyntaxDefinitions(b, a)).toMatchObject(a);

			expect(mergeSyntaxDefinitions(b, c)).toMatchObject({});
		});

		test('merge properties', () => {
			const a = { properties: { a: 'a' } };
			const b = { properties: { a: ' | b' } }; // extra leading space

			expect(mergeSyntaxDefinitions(a, b)).toMatchObject({ properties: { a: 'a | b' } });

			expect(mergeSyntaxDefinitions(b, a)).toMatchObject({ properties: { a: 'a' } });
		});

		test('override properties', () => {
			const a = { properties: { a: 'a' } };
			const b = { properties: { a: 'b' } };

			expect(mergeSyntaxDefinitions(a, b)).toMatchObject({ properties: { a: 'b' } });
		});
	});

	describe('types', () => {
		test('merge definitions where `types` is undefined', () => {
			const a = { types: { a: 'a' } };
			const b = {};
			const c = {};

			expect(mergeSyntaxDefinitions(a, b)).toMatchObject(a);

			expect(mergeSyntaxDefinitions(b, a)).toMatchObject(a);

			expect(mergeSyntaxDefinitions(b, c)).toMatchObject({});
		});

		test('merge types', () => {
			const a = { types: { a: 'a' } };
			const b = { types: { a: ' | b' } }; // extra leading space

			expect(mergeSyntaxDefinitions(a, b)).toMatchObject({ types: { a: 'a | b' } });

			expect(mergeSyntaxDefinitions(b, a)).toMatchObject({ types: { a: 'a' } });
		});

		test('override types', () => {
			const a = { types: { a: 'a' } };
			const b = { types: { a: 'b' } };

			expect(mergeSyntaxDefinitions(a, b)).toMatchObject({ types: { a: 'b' } });
		});
	});

	describe('CSS wide keywords', () => {
		test('merge definitions where `cssWideKeywords` is undefined', () => {
			const a = { cssWideKeywords: [] };
			const b = {};
			const c = {};

			expect(mergeSyntaxDefinitions(a, b)).toMatchObject(a);

			expect(mergeSyntaxDefinitions(b, a)).toMatchObject(a);

			expect(mergeSyntaxDefinitions(b, c)).toMatchObject({});
		});

		test('merge keywords', () => {
			const a = { cssWideKeywords: ['a', 'b'] };
			const b = { cssWideKeywords: ['a', 'c'] };

			expect(mergeSyntaxDefinitions(a, b)).toMatchObject({ cssWideKeywords: ['a', 'b', 'c'] });
		});
	});
});
