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
		runTests(css, (decl) => {
			const parsedValue = valueParser(decl.value).nodes[0];

			expect(isMap(parsedValue)).toBe(expected);
		});
	});

	test.each(nestedMaps)('nested maps', (css, expected) => {
		runTests(css, (decl) => {
			const parsedValue = valueParser(decl.value);

			parsedValue.walk((valueNode) => {
				if (expected.includes(valueNode.sourceIndex)) {
					expect(isMap(valueNode)).toBeTruthy();
				} else {
					expect(isMap(valueNode)).toBeFalsy();
				}
			});
		});
	});

	it('empty map returns `false`', () => {
		const emptyMap = '$map: ();';

		runTests(emptyMap, (decl) => {
			const parsedValue = valueParser(decl.value);

			expect(isMap(parsedValue)).toBeFalsy();
		});
	});
});

function sassDecls(css, cb) {
	sass.parse(css).walkDecls(cb);
}

function scssDecls(css, cb) {
	scss.parse(css).walkDecls(cb);
}

function runTests(css, cb) {
	[sassDecls, scssDecls].forEach((fn) => {
		fn(css, cb);
	});
}
