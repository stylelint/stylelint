const test = require('node:test');
const path = require('node:path');

const stylelint = require('../../lib/index.mjs');

test(
	'CommonJS API and config',
	async (t) => {
		const result = await stylelint.lint({
			files: [caseFilePath('stylesheet.css')],
			configFile: caseFilePath('config.cjs'),
		});

		t.assert.deepStrictEqual(
			normalizeResult(result),
			require('./__snapshots__/commonjs.test.cjs.snap.mjs').default,
		);
	},
	{ timeout: 20000 },
);

function caseFilePath(basename) {
	return path.join(__dirname, basename).replaceAll('\\', '/');
}

function normalizeResult({ cwd, report, results, ...rest }) {
	const dummySource = '/path/to/dummy.css';

	cwd = '/path/to/cwd';
	report = JSON.parse(report).map((entry) => ({ ...entry, source: dummySource }));

	results = results.map((entry) => {
		delete entry._postcssResult;

		return { ...entry, source: dummySource };
	});

	return { cwd, report, results, ...rest };
}
