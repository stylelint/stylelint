import { copyFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

import replaceBackslashes from '../lib/testUtils/replaceBackslashes.mjs';
import uniqueId from '../lib/testUtils/uniqueId.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export function caseFilePath(caseNumber, fileName = 'stylesheet') {
	return replaceBackslashes(path.join(__dirname, caseNumber, fileName));
}

export function caseFiles(caseNumber) {
	return caseFilePath(caseNumber, 'stylesheet.*');
}

export function caseConfigFile(caseNumber, ext = 'json') {
	return caseFilePath(caseNumber, `config.${ext}`);
}

export async function caseConfig(caseNumber) {
	return JSON.parse(await readFile(caseConfigFile(caseNumber, 'json'), 'utf8'));
}

export async function caseCode(caseNumber, ext = 'css') {
	return readFile(`${caseFilePath(caseNumber)}.${ext}`, 'utf8');
}

export async function caseFilesForFix(caseNumber, ext = 'css') {
	const tempPath = replaceBackslashes(path.join(os.tmpdir(), `stylesheet-${uniqueId()}.${ext}`));

	await copyFile(path.join(__dirname, caseNumber, `stylesheet.${ext}`), tempPath);

	return tempPath;
}

export function prepForSnapshot({ results, cwd, output, report, ...rest }) {
	// If output isn't fixed code
	if (output.startsWith('[')) {
		// The `source` of each file varies between platforms or if a tmp file is used
		output = JSON.parse(output).map((warning) => ({
			...warning,
			source: '/path/to/dummy.css',
		}));
	}

	if (report) {
		// The `source` of each file varies between platforms or if a tmp file is used
		report = JSON.parse(report).map((warning) => ({
			...warning,
			source: '/path/to/dummy.css',
		}));
	}

	return {
		cwd: path.relative(process.cwd(), cwd),
		// The _postcssResult object is not part of our API and is huge
		results: results.map((result) => {
			delete result._postcssResult;

			return { ...result, source: '/path/to/dummy.css' };
		}),
		output, // TODO: Deprecated. Remove in the next major version.
		report,
		...rest,
	};
}
