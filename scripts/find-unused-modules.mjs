import { basename } from 'node:path';
import { execSync } from 'node:child_process';

import fg from 'fast-glob';

const files = fg.sync('lib/**/*.js', { ignore: '**/__tests__/**' });

for (const file of files) {
	const name = basename(file, '.js');

	const matchedFilesText = execSync(`git grep -l -w "${name}"`).toString().trim();
	const matchedFiles = matchedFilesText.split(/\s+/).sort().join(',');

	if (
		matchedFiles === file ||
		matchedFiles === `lib/utils/__tests__/${name}.test.js,${file}` ||
		matchedFiles === `lib/utils/__tests__/${name}.test.mjs,${file}`
	) {
		console.log(file); // eslint-disable-line no-console
	}
}
