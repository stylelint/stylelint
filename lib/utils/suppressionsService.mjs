/*
 * This file is based on ESLint's suppressions-service.js
 * https://github.com/eslint/eslint/blob/v9.26.0/lib/services/suppressions-service.js
 *
 * Copyright OpenJS Foundation and other contributors, https://openjsf.org/
 * Released under the MIT License:
 * https://github.com/eslint/eslint/blob/main/LICENSE
 */
import fs from 'node:fs';
import path from 'node:path';

import getRelativePath from './getRelativePath.mjs';
import isPathNotFoundError from './isPathNotFoundError.mjs';

/** @import {LintResult, Warning, SuppressedViolations} from 'stylelint' */

/**
 * Manages the suppressed violations.
 */
export class SuppressionsService {
	filePath = '';
	cwd = '';

	/**
	 * Creates a new instance of SuppressionsService.
	 * @param {Object} options The options.
	 * @param {string} options.filePath The path to the suppressions file.
	 * @param {string} options.cwd The current working directory.
	 */
	constructor({ filePath, cwd }) {
		this.filePath = filePath;
		this.cwd = cwd;
	}

	/**
	 * Updates the suppressions file based on the current violations and the provided rules.
	 * If no rules are provided, all violations are suppressed.
	 * @param {LintResult[] | undefined} results The lint results.
	 * @param {string[] | undefined} rules The rules to suppress.
	 * @returns {Promise<void>}
	 */
	async suppress(results, rules) {
		const suppressions = await this.load();

		if (results === undefined) return;

		for (const result of results) {
			const source = result.source;

			if (!source) continue;

			const relativePath = path.isAbsolute(source) ? getRelativePath(this.cwd, source) : source;

			const violationsByRule = SuppressionsService.countViolationsByRule(result.warnings);

			for (const rule of Object.keys(violationsByRule)) {
				if (rules && !rules.includes(rule)) continue;

				suppressions[relativePath] ??= {};

				if (!violationsByRule[rule]) continue;

				suppressions[relativePath][rule] = violationsByRule[rule];
			}
		}

		return this.save(suppressions);
	}

	/**
	 * Removes old, unused suppressions for violations that do not occur anymore.
	 * @param {LintResult[]} results The lint results.
	 * @returns {Promise<void>} No return value.
	 */
	async prune(results) {
		const suppressions = await this.load();
		const { unused } = this.applySuppressions(results, suppressions);

		for (const file in unused) {
			if (!suppressions[file]) {
				continue;
			}

			for (const rule in unused[file]) {
				if (!suppressions[file][rule]) {
					continue;
				}

				const suppressionsCount = suppressions[file][rule].count;

				if (!unused[file][rule]) continue;

				const violationsCount = unused[file][rule].count;

				if (suppressionsCount === violationsCount) {
					// Remove unused rules
					delete suppressions[file][rule];
				} else {
					// Update the count to match the new number of violations
					suppressions[file][rule].count -= violationsCount;
				}
			}

			// Cleanup files with no rules
			if (Object.keys(suppressions[file]).length === 0) {
				delete suppressions[file];
			}
		}

		return this.save(suppressions);
	}

	/**
	 * Checks the provided suppressions against the lint results.
	 *
	 * For each file, counts the number of violations per rule.
	 * For each rule in each file, compares the number of violations against the counter from the suppressions file.
	 * If the number of violations is less or equal to the counter, warnings are ignored.
	 * Otherwise, all violations are reported as usual.
	 * @param {LintResult[]} results The lint results.
	 * @param {SuppressedViolations} suppressions The suppressions.
	 * @returns {{
	 *   results: LintResult[],
	 *   unused: SuppressedViolations
	 * }} The updated results and the unused suppressions.
	 */
	applySuppressions(results, suppressions) {
		/**
		 * We copy the results to avoid modifying the original objects
		 * We remove only result warnings that are matched and hence suppressed
		 * We leave the rest untouched to minimize the risk of losing parts of the original data
		 */
		const clonedResults = results.map((r) => {
			return {
				...r,
				warnings: structuredClone(r.warnings),
			};
		});

		/** @type {SuppressedViolations} */
		const unused = {};

		for (const result of clonedResults) {
			const source = result.source;

			if (!source) continue;

			const relativePath = path.isAbsolute(source) ? getRelativePath(this.cwd, source) : source;

			if (!suppressions[relativePath]) {
				continue;
			}

			const violationsByRule = SuppressionsService.countViolationsByRule(result.warnings);

			for (const rule in violationsByRule) {
				if (!suppressions[relativePath][rule]) {
					continue;
				}

				const suppressionsCount = suppressions[relativePath][rule].count;

				const ruleStats = violationsByRule[rule];

				if (!ruleStats) continue;

				const violationsCount = ruleStats.count;

				// Suppress warnings if the number of violations is less or equal to the suppressions count
				if (violationsCount <= suppressionsCount) {
					result.warnings = result.warnings.filter((warning) => warning.rule !== rule);
				}

				// Update the count to match the new number of violations, otherwise remove the rule entirely
				if (violationsCount < suppressionsCount) {
					unused[relativePath] ??= {};
					unused[relativePath][rule] ??= { count: 0 };
					unused[relativePath][rule].count = suppressionsCount - violationsCount;
				}
			}

			// Mark as unused all the suppressions that were not matched against a rule
			for (const rule in suppressions[relativePath]) {
				if (violationsByRule[rule]) {
					continue;
				}

				const savedEntry = suppressions[relativePath][rule];

				if (!savedEntry) continue;

				unused[relativePath] ??= {};
				unused[relativePath][rule] = savedEntry;
			}
		}

		return {
			results: clonedResults,
			unused,
		};
	}

	/**
	 * Loads the suppressions file.
	 * @throws {Error} If the suppressions file cannot be parsed.
	 * @returns {Promise<SuppressedViolations>} The suppressions.
	 */
	async load() {
		try {
			const data = await fs.promises.readFile(this.filePath, 'utf8');

			return JSON.parse(data);
		} catch (err) {
			if (isPathNotFoundError(err)) {
				return {};
			}

			throw new Error(`Failed to parse suppressions file at ${this.filePath}`);
		}
	}

	/**
	 * Updates the suppressions file.
	 * @param {SuppressedViolations} suppressions The suppressions to save.
	 * @returns {Promise<void>}
	 * @private
	 */
	save(suppressions) {
		return fs.promises.writeFile(this.filePath, JSON.stringify(suppressions, null, 2));
	}

	/**
	 * Counts the violations by rule, ignoring warnings.
	 * @param {Warning[]} warnings The warnings to count.
	 * @returns {Record<string, {count: number}>} The number of violations by rule.
	 */
	static countViolationsByRule(warnings) {
		/** @type {Record<string, {count: number}>} */
		const totals = {};

		for (const warning of warnings) {
			const rule = warning.rule;

			if (warning.severity !== 'error' || !rule) continue;

			totals[rule] ??= { count: 0 };
			totals[rule].count += 1;
		}

		return totals;
	}
}
