// --- Keep the historical changelog format. Changesets is not enough to keep it.

import { readFileSync, writeFileSync } from 'node:fs';
import process from 'node:process';

const ENTRY_PREFIXES = ['Removed', 'Changed', 'Deprecated', 'Added', 'Fixed'];
const entryPattern = new RegExp(`^- (${ENTRY_PREFIXES.join('|')}):`);

/** @type {(a: string, b: string) => number} */
const byPrefixOrder = (a, b) => {
	const aPrefix = entryPattern.exec(a)?.[1];
	const bPrefix = entryPattern.exec(b)?.[1];

	if (aPrefix && bPrefix) {
		const comparison = ENTRY_PREFIXES.indexOf(aPrefix) - ENTRY_PREFIXES.indexOf(bPrefix);

		if (comparison !== 0) return comparison;

		return a.localeCompare(b);
	}

	if (!aPrefix && bPrefix) return 1;

	if (aPrefix && !bPrefix) return -1;

	return 0;
};

const path = process.argv[2];

if (!path) {
	throw new Error('Please provide a path to the changelog file.');
}

const content = readFileSync(path, 'utf8');
const currentLines = content.split('\n');
const newLines = [];
const entries = [];
let latestVersion = undefined;
let stoppedIndex = -1;
let subHeader = false;

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

for (const line of currentLines) {
	stoppedIndex++;

	if (line.startsWith('## ')) {
		if (!latestVersion) {
			latestVersion = line.replace('## ', '');
			newLines.push(`## ${latestVersion} - ${today}`);
			continue;
		} else {
			entries.sort(byPrefixOrder);
			newLines.push('', ...entries, '');
			newLines.push(...currentLines.slice(stoppedIndex));
			break;
		}
	}

	if (/^### (?:Major|Minor|Patch) Changes/i.test(line)) {
		subHeader = true;
		continue;
	} else if (subHeader) {
		subHeader = false;
		continue;
	}

	if (line.startsWith('- ')) {
		entries.push(line);
		continue;
	}

	if (line === '' && latestVersion) {
		continue;
	}

	newLines.push(line);
}

writeFileSync(path, newLines.join('\n'), 'utf8');
console.log(`"${path}" rewritten.`); // eslint-disable-line no-console
