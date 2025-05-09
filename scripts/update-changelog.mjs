import { createRequire } from 'node:module';
import { exec } from 'node:child_process';
import fs from 'node:fs';
import process from 'node:process';
import util from 'node:util';

import { Release, parser } from 'keep-a-changelog';
import increment from 'semver/functions/inc.js';
import read from '@changesets/read';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');
const changesets = await read('./');
const groups = { security: [], removed: [], changed: [], deprecated: [], added: [], fixed: [] };
const execAsync = util.promisify(exec);

let releaseType = 'patch';

for (const {
	releases: [{ type }],
	summary,
	id,
} of changesets) {
	const [change, item] = summary.split(/: (.+)/s);

	let stdout;

	try {
		({ stdout } = await execAsync(`git log --pretty=format:"%ae %s" .changeset/${id}.md`));
	} catch (e) {
		throw new Error(e.message);
	}

	const [email, message] = stdout.split(/ (.*)/s);
	const [, user] = email.match(/(?:\d+\+)?([^@]+)(?=@)/);
	const [issue] = message.match(/#[0-9]{4,}/);
	const PR = `https://github.com/stylelint/stylelint/pull/${issue.slice(1)}`;
	const account = `https://github.com/${user}`;
	const isAlreadyMinor = releaseType === 'minor' && type === 'minor';
	const bumpLevel = releaseType !== 'major' && !isAlreadyMinor && type !== 'patch';

	groups[change.toLowerCase()].push(`${item} ([${issue}](${PR})) ([@${user}](${account})).`);

	if (bumpLevel) releaseType = type;
}

class CustomRelease extends Release {
	constructor(...args) {
		super(...args);

		this.changes = new Map([
			['security', []],
			['removed', []],
			['changed', []],
			['deprecated', []],
			['added', []],
			['fixed', []],
		]);
	}
}

const version = increment(pkg.version, releaseType);
const today = formatDate(new Date());
const description = process.argv[2];
const release = new CustomRelease(version, today, description);
const entries = Object.entries(groups);

for (const [key, value] of entries) {
	if (value.length) value.sort().forEach((change) => release[key](change));
}

const path = './CHANGELOG.md';
const releaseCreator = (...args) => new CustomRelease(...args);
const changelog = parser(fs.readFileSync(path, 'UTF-8'), { releaseCreator }).addRelease(release);

changelog.format = 'markdownlint';
changelog.description = `The format is based on [Keep a Changelog](https://keepachangelog.com/)
and this project adheres to [Semantic Versioning](https://semver.org/).`;

fs.writeFileSync(path, changelog.toString(), 'utf8');
console.info('CHANGELOG updated ✓'); // eslint-disable-line no-console

function formatDate(date) {
	return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
}
