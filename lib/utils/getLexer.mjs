import { fork } from 'css-tree';
import syntaxPatchesJson from '@csstools/css-syntax-patches-for-csstree' with { type: 'json' };

import mergeSyntaxDefinitions from './mergeSyntaxDefinitions.mjs';

/** @import { Lexer as CSSTreeLexer } from 'css-tree' */
/** @import { Config as StylelintConfig } from 'stylelint' */
/** @import { SyntaxDefinition } from './mergeSyntaxDefinitions.mjs' */

const { next: syntaxPatches } = syntaxPatchesJson;

const lexerCache = new Map();

/**
 * Get CSSTree lexer based on a Stylelint configuration and an additional syntax definition.
 * The return value is cached for performance.
 *
 * @param {StylelintConfig} config
 * @param {SyntaxDefinition} [additionalSyntax]
 * @returns {CSSTreeLexer}
 */
export default function getLexer(config, additionalSyntax) {
	const syntax = { ...config.languageOptions?.syntax, ...additionalSyntax };

	if (syntax.atRules) {
		syntax.atrules = syntax.atRules;
	}

	const cacheKey = JSON.stringify(syntax);
	const lexer = lexerCache.get(cacheKey);

	if (lexer) return lexer;

	const { lexer: newLexer } = fork(mergeSyntaxDefinitions(syntaxPatches, syntax));

	lexerCache.set(cacheKey, newLexer);

	return newLexer;
}
