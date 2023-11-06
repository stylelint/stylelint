const path = require('node:path');

const stylelint = require('../../lib/index.cjs');

test('CommonJS API and config', async () => {
	expect(
		await stylelint.lint({
			files: [caseFilePath('stylesheet.css')],
			configFile: caseFilePath('config.cjs'),
		}),
	).toMatchSnapshot();
});

function caseFilePath(basename) {
	return path.join(__dirname, basename).replaceAll('\\', '/');
}
