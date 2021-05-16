'use strict';

const isMap = require('../isMap');
const sass = require('postcss-sass');
const scss = require('postcss-scss');
const valueParser = require('postcss-value-parser');

describe('isMap', () => {
	const simpleMaps = [
		['$map: (prop: "flex");', true],
		['$font: (italic bold 10px/8pix)', false],
		['$map: (prop: /* comment */ 0);', true],
		['$calc: calc(100% / 2px);', false],
		['$url: url();', false],
	];
	const nestedMaps = [
		['$map: (prop: 0, prop2: (prop3: "normal"), prop4: 2px);', [0, 17]],
		['$map: (prop: 0, prop2: (prop3: "normal", prop4: (prop5: "grid")), prop6: 2px);', [0, 17, 42]],
	];

	test.each(simpleMaps)('simple maps', (css, expected) => {
		const decls = declarations(css);

		expect(decls).toHaveLength(2);

		decls.forEach((decl) => {
			const parsedValue = valueParser(decl.value).nodes[0];

			expect(isMap(parsedValue)).toBe(expected);
		});
	});

	test.each(nestedMaps)('nested maps', (css, expected) => {
		const decls = declarations(css);

		expect(decls).toHaveLength(2);

		decls.forEach((decl) => {
			const parsedValue = valueParser(decl.value);

			const valueNodes = [];

			parsedValue.walk((valueNode) => valueNodes.push(valueNode));

			expect(valueNodes.length).toBeGreaterThan(0);
			valueNodes.forEach((valueNode) => {
				if (expected.includes(valueNode.sourceIndex)) {
					// eslint-disable-next-line jest/no-conditional-expect
					expect(isMap(valueNode)).toBeTruthy();
				} else {
					// eslint-disable-next-line jest/no-conditional-expect
					expect(isMap(valueNode)).toBeFalsy();
				}
			});
		});
	});

	it('empty map returns `false`', () => {
		const emptyMap = '$map: ();';

		const decls = declarations(emptyMap);

		expect(decls).toHaveLength(2);

		decls.forEach((decl) => {
			const parsedValue = valueParser(decl.value);

			expect(isMap(parsedValue)).toBeFalsy();
		});
	});
});

function declarations(css) {
	const list = [];

	sass.parse(css).walkDecls((decl) => list.push(decl));
	scss.parse(css).walkDecls((decl) => list.push(decl));

	return list;
}
