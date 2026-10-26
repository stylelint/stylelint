import { mkdirSync } from 'node:fs';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

const TEST_FILES = [
	'lib/**/__tests__/**/*.test.?(m|c)js',
	'lib/rules/*/__tests__/index.mjs',
	'system-tests/**/*.test.?(m|c)js',
	'.changeset/*.test.mjs',
];
const COVERAGE_DIRECTORY = '.coverage';
const COVERAGE_OPTIONS = [
	'--experimental-test-coverage',
	'--test-coverage-include=lib/**/*.mjs',
	'--test-coverage-include=.changeset/changelog-stylelint.mjs',
	'--test-coverage-exclude=lib/**/__tests__/**',
	'--test-coverage-exclude=lib/testUtils/**',
	'--test-coverage-branches=90',
	'--test-coverage-functions=90',
	'--test-coverage-lines=90',
	'--test-reporter=lcov',
	`--test-reporter-destination=${COVERAGE_DIRECTORY}/lcov.info`,
];

const isOption = (/** @type {string} */ arg) => arg.startsWith('--');

const args = process.argv.slice(2);
const coverage = args.includes('--coverage');
const options = args.filter((arg) => isOption(arg) && arg !== '--coverage');
const files = args.filter((arg) => !isOption(arg));

if (coverage) mkdirSync(COVERAGE_DIRECTORY, { recursive: true });

const { status } = spawnSync(
	process.execPath,
	[
		'--import',
		import.meta.resolve('../lib/testUtils/setup.mjs'),
		'--test',
		`--test-reporter=${import.meta.resolve('../lib/testUtils/reporter.mjs')}`,
		'--test-reporter-destination=stdout',
		...(coverage ? COVERAGE_OPTIONS : []),
		...options,
		...(files.length > 0 ? files : TEST_FILES),
	],
	{ stdio: 'inherit' },
);

process.exitCode = status ?? 1;
