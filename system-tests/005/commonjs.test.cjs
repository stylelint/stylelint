const path = require('node:path');

const stylelint = require('../../lib/index.cjs');

test('CommonJS API and config', async () => {
	const result = await stylelint.lint({
		files: [caseFilePath('stylesheet.css')],
		configFile: caseFilePath('config.cjs'),
	});

	expect(normalizeResult(result)).toMatchSnapshot();
});

function caseFilePath(basename) {
	return path.join(__dirname, basename).replaceAll('\\', '/');
}

function normalizeResult({ cwd, output, report, results, ...rest }) {
	const dummySource = '/path/to/dummy.css';

	cwd = '/path/to/cwd';
	output = JSON.parse(output).map((entry) => ({ ...entry, source: dummySource }));
	report = JSON.parse(report).map((entry) => ({ ...entry, source: dummySource }));

	results = results.map((entry) => {
		delete entry._postcssResult;

		return { ...entry, source: dummySource };
	});

	return { cwd, output, report, results, ...rest };
}
