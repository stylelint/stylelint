/* eslint-disable n/no-extraneous-import */
import * as babel from 'prettier/plugins/babel';
import * as typescript from 'prettier/plugins/typescript';
import { lintRule } from 'unified-lint-rule';
import postcss from 'postcss';
import { visit } from 'unist-util-visit';
/* eslint-enable n/no-extraneous-import */

const LANGUAGES = Object.freeze({
	css: 'CSS',
	js: 'JavaScript',
	javascript: 'JavaScript',
	json: 'JSON',
	ts: 'TypeScript',
	typescript: 'TypeScript',
});

function isValidJs(source) {
	try {
		babel.parsers.babel.parse(source, {});

		return true;
	} catch {
		return false;
	}
}

function isValidTs(source) {
	try {
		typescript.parsers.typescript.parse(source, {});

		return true;
	} catch {
		return false;
	}
}

function isValidCss(source) {
	try {
		postcss.parse(source);

		return true;
	} catch {
		return false;
	}
}

function isValidJson(source) {
	try {
		JSON.parse(source);

		return true;
	} catch {
		return false;
	}
}

function checkDiffSyntax({ code, file, before, after, isValid, language }) {
	const invalidSides = [];

	if (!isValid(before)) invalidSides.push('before');

	if (!isValid(after)) invalidSides.push('after');

	if (invalidSides.length === 0) return;

	const message = `Invalid ${LANGUAGES[language]} ${invalidSides.join(' and ')} applying the diff.`;

	file.message(message, { place: code.position });
}

function isDiffHeader(line) {
	return /^(?:---|\+\+\+)(?:\s|$)/u.test(line) || /^@@(?:\s|$)/u.test(line);
}

function checkDiffMarkerIndentation({ code, file, lines }) {
	const hasUnmarkedLines = lines.some(
		(line) => line && !isDiffHeader(line) && !/^[- +]/u.test(line),
	);

	if (hasUnmarkedLines) {
		file.message('Invalid diff marker indentation.', { place: code.position });
	}
}

function checkDiffCodeBlock({ code, file }) {
	const language = code.meta?.trim().split(/\s+/u)[0];
	const lines = code.value.split('\n');
	const beforeLines = [];
	const afterLines = [];

	checkDiffMarkerIndentation({ code, file, lines });

	for (const line of lines) {
		if (isDiffHeader(line)) continue;

		if (line.startsWith('-')) {
			beforeLines.push(line.slice(1));
			continue;
		}

		if (line.startsWith('+')) {
			afterLines.push(line.slice(1));
			continue;
		}

		const context = line.startsWith(' ') ? line.slice(1) : line;

		beforeLines.push(context);
		afterLines.push(context);
	}

	const before = beforeLines.join('\n');
	const after = afterLines.join('\n');

	switch (language) {
		case 'css': {
			checkDiffSyntax({ code, file, before, after, isValid: isValidCss, language });
			break;
		}
		case 'js':
		case 'javascript': {
			checkDiffSyntax({ code, file, before, after, isValid: isValidJs, language });
			break;
		}
		case 'json': {
			checkDiffSyntax({ code, file, before, after, isValid: isValidJson, language });
			break;
		}
		case 'ts':
		case 'typescript': {
			checkDiffSyntax({ code, file, before, after, isValid: isValidTs, language });
			break;
		}
		default: {
			break;
		}
	}
}

function checkCodeBlock({ code, file }) {
	const check = (isValid) => {
		if (!isValid(code.value)) {
			file.message(`Invalid ${LANGUAGES[code.lang]} syntax.`, { place: code.position });
		}
	};

	switch (code.lang) {
		case 'diff': {
			checkDiffCodeBlock({ code, file });
			break;
		}
		case 'css': {
			check(isValidCss);
			break;
		}
		case 'js':
		case 'javascript': {
			check(isValidJs);
			break;
		}
		case 'json': {
			check(isValidJson);
			break;
		}
		case 'ts':
		case 'typescript': {
			check(isValidTs);
			break;
		}
		default: {
			break;
		}
	}
}

/**
 * Check code blocks for syntax in supported languages.
 */
export default lintRule('stylelint:code-block', (tree, file) => {
	visit(tree, 'code', (code) => {
		checkCodeBlock({ code, file });
	});
});
