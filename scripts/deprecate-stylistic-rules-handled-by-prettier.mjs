// TODO: This script is one-time. Please delete it if no longer needed.

import cp from 'node:child_process';
import fs from 'node:fs';

const rulesDocLines = fs.readFileSync('docs/user-guide/rules.md').toString().split('\n');

const headingIndex = rulesDocLines.findIndex((line) => line.includes('Handled by pretty printers'));

const ruleNames = rulesDocLines
	.filter((line, index) => index > headingIndex && line.includes('../lib/rules/'))
	.map((line) => line.match(/rules\/(.+)\/README/)[1]);

for (const ruleName of ruleNames) {
	const fileNameJs = `lib/rules/${ruleName}/index.js`;
	const ruleCodeLines = fs.readFileSync(fileNameJs).toString().split('\n');

	const metaStartIndex = ruleCodeLines.findIndex((line) => line.includes('const meta = {'));
	const metaEndIndex = ruleCodeLines.findIndex(
		(line, index) => index > metaStartIndex && line.includes('};'),
	);

	ruleCodeLines.splice(metaEndIndex, 0, 'deprecated: true');

	fs.writeFileSync(fileNameJs, ruleCodeLines.join('\n'));
	process.stdout.write(`Updated: ${fileNameJs}\n`);

	// > **Warning**
	// > This rule is deprecated and will be removed in the future.

	const fileNameMd = `lib/rules/${ruleName}/README.md`;
	const ruleDocLines = fs.readFileSync(fileNameMd).toString().split('\n');

	ruleDocLines.splice(
		2,
		0,
		'> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).',
		'',
	);

	fs.writeFileSync(fileNameMd, ruleDocLines.join('\n'));
	process.stdout.write(`Updated: ${fileNameMd}\n`);
}

process.stdout.write(`\nFormatting files via "npm run format"...\n`);
cp.execSync('npm run format');
process.stdout.write(`${ruleNames.length} files processed!\n`);
