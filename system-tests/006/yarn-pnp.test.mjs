// This test verifies Yarn PnP integration with tarball installation, simulating
// real-world scenarios where Stylelint is installed in a Yarn PnP environment.
//
// This test requires Yarn to be installed on the system. It is skipped by
// default unless STYLELINT_TEST_YARN_PNP=true is set. CI enables this env var.
//
// The test covers two scenarios:
//
// 1. Same repo: Stylelint and the 3rd-party dependency are installed together
//    in one project. Uses the "combined" fixture.
//
// 2. yarn dlx: Simulates "yarn dlx stylelint" where Stylelint runs from a
//    temporary environment but must resolve configs/plugins from the target
//    project. Runs Stylelint from "stylelint-only" against "config-only", the
//    target project with the 3rd-party dependency and the file to lint.

import assert from 'node:assert/strict';
import childProcess from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';

import { fileURLToPath } from 'node:url';

// eslint-disable-next-line n/no-unsupported-features/node-builtins
import { before, describe, test } from 'node:test';

const execAsync = promisify(childProcess.exec);
const execFileAsync = promisify(childProcess.execFile);

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(currentDir, 'templates');
const fixturesDir = path.join(currentDir, 'fixtures');
const rootDir = path.resolve(currentDir, '../..');

// Disabled by default since it requires Yarn on the system.
const shouldSkipTest = process.env.STYLELINT_TEST_YARN_PNP !== 'true';

/** @typedef {'combined' | 'stylelint-only' | 'config-only'} FixtureType */

/**
 * Get the Yarn version from a template package.json packageManager field.
 * @param {FixtureType} fixtureType
 * @returns {Promise<string>} The Yarn version
 */
async function getYarnVersion(fixtureType) {
	const templatePath = path.join(templatesDir, fixtureType, 'package.json');
	const packageJson = JSON.parse(await fs.readFile(templatePath, 'utf8'));
	const packageManager = packageJson.packageManager;

	if (!packageManager || !packageManager.startsWith('yarn@')) {
		throw new Error(`Expected packageManager to be yarn@<version>, got: ${packageManager}`);
	}

	return packageManager.replace('yarn@', '');
}

/**
 * Copy all files from a template directory to a fixture directory.
 * @param {FixtureType} fixtureType
 */
async function copyTemplateFiles(fixtureType) {
	const templateDir = path.join(templatesDir, fixtureType);
	const fixtureDir = path.join(fixturesDir, fixtureType);

	// Create fixture directory.
	await fs.mkdir(fixtureDir, { recursive: true });

	// Copy all files from template.
	const files = await fs.readdir(templateDir);

	for (const file of files) {
		const srcPath = path.join(templateDir, file);
		const destPath = path.join(fixtureDir, file);

		await fs.copyFile(srcPath, destPath);
	}
}

/**
 * Pack Stylelint into a tarball for installation testing.
 * @returns {Promise<string>} Path to the created tarball
 */
async function packStylelint() {
	const { stdout } = await execAsync('npm pack --json', { cwd: rootDir });
	const [{ filename }] = JSON.parse(stdout);

	return path.join(rootDir, filename);
}

/**
 * Set up a Yarn PnP fixture from a template.
 * @param {FixtureType} fixtureType
 */
async function setupFixture(fixtureType) {
	const fixtureDir = path.join(fixturesDir, fixtureType);
	const yarnVersion = await getYarnVersion(fixtureType);

	// Copy template files to fixture directory.
	await copyTemplateFiles(fixtureType);

	// Create empty yarn.lock to make this a separate project from the parent.
	await fs.writeFile(path.join(fixtureDir, 'yarn.lock'), '', 'utf8');

	// Set up the Yarn version specified in package.json for the fixture.
	await execFileAsync('yarn', ['set', 'version', yarnVersion], {
		cwd: fixtureDir,
		env: { ...process.env, COREPACK_ENABLE_DOWNLOAD_PROMPT: '0' },
	});

	// Install dependencies with Yarn.
	await execFileAsync('yarn', ['install', '--no-immutable'], { cwd: fixtureDir });
}

/**
 * Run Stylelint via Yarn and return parsed JSON results.
 * @param {string} cwd Working directory to run Stylelint from
 * @param {string[]} args Arguments to pass to Stylelint
 * @returns {Promise<object[]>} Parsed lint results
 */
async function runStylelint(cwd, args) {
	let output;

	try {
		const result = await execFileAsync('yarn', ['stylelint', ...args, '--formatter', 'json'], {
			cwd,
		});

		output = result.stdout;
	} catch (err) {
		// Exit code 2 means that lint errors were found, which is expected.
		if (err.code !== 2) {
			assert.fail(
				`Expected exit code 2 but got: ${err.code}\nstdout: ${err.stdout}\nstderr: ${err.stderr}`,
			);
		}

		output = err.stderr;
	}

	return JSON.parse(output);
}

/**
 * Set up all fixtures for testing.
 */
async function setupAllFixtures() {
	// Create fixtures directory.
	await fs.mkdir(fixturesDir, { recursive: true });

	// Pack Stylelint and place in fixtures directory (shared by fixtures that need it).
	const tarballPath = await packStylelint();
	const sharedTarball = path.join(fixturesDir, 'stylelint.tgz');

	await fs.rename(tarballPath, sharedTarball);

	// Set up all fixtures.
	await setupFixture('combined');
	await setupFixture('stylelint-only');
	await setupFixture('config-only');
}

describe('Yarn PnP integration', { skip: shouldSkipTest }, () => {
	before(async () => {
		await setupAllFixtures();
	});

	test('lints with stylelint-config-standard in same repo', async () => {
		const fixtureDir = path.join(fixturesDir, 'combined');

		const results = await runStylelint(fixtureDir, ['stylesheet.css', '--config', 'config.mjs']);

		assert.equal(results.length, 1, 'Should have one lint result.');
		assert.equal(results[0].source, path.join(fixtureDir, 'stylesheet.css'));
		assert.equal(results[0].errored, true, 'Should have errors.');
		assert.equal(results[0].warnings.length, 1, 'Should have one warning.');

		// Check that the rule from stylelint-config-standard was applied.
		const blockNoEmpty = results[0].warnings.find((w) => w.rule === 'block-no-empty');

		assert.ok(blockNoEmpty, 'Should find block-no-empty warning from stylelint-config-standard');
	});

	test('lints cross-repo with Stylelint from one repo and config from another', async () => {
		const stylelintDir = path.join(fixturesDir, 'stylelint-only');
		const configDir = path.join(fixturesDir, 'config-only');
		const stylesheetPath = path.join(configDir, 'stylesheet.css');
		const configPath = path.join(configDir, 'config.mjs');

		// Run Stylelint from stylelint-only repo, targeting files in the
		// config-only repo.
		const results = await runStylelint(stylelintDir, [stylesheetPath, '--config', configPath]);

		assert.equal(results.length, 1, 'Should have one lint result.');
		assert.equal(results[0].source, stylesheetPath);
		assert.equal(results[0].errored, true, 'Should have errors.');
		assert.equal(results[0].warnings.length, 1, 'Should have one warning.');

		// Check that the rule from stylelint-config-standard was applied.
		const blockNoEmpty = results[0].warnings.find((w) => w.rule === 'block-no-empty');

		assert.ok(blockNoEmpty, 'Should find block-no-empty warning from stylelint-config-standard');
	});
});
