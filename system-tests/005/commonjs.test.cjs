const path = require('node:path');
const process = require('node:process');

const stylelint = require('../../lib/index.cjs');

// TODO: This test fails due to SIGSEGV on Node.js 18 for some reason.
// Remove the skip when dropping the support for Node.js 18.
const [nodeMajorVersion] = process.versions.node.split('.', 1);
const testFn = Number(nodeMajorVersion) >= 20 ? test : test.skip;

testFn('CommonJS API and config', async () => {
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
