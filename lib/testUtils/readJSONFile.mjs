import * as fs from 'node:fs';

/**
 * @param {string | URL} filePath
 * @returns {unknown}
 */
export default function readJSONFile(filePath) {
	return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
