import stylelint from 'stylelint';
import { isStandardSyntaxAtRule } from 'stylelint/lib/utils/isStandardSyntax.js';
import { parseMediaQuery } from '@csstools/media-query-list-parser';

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = 'media-type-no-deprecated';
const messages = ruleMessages(ruleName, {
  rejected: (mediaType) => `Unexpected deprecated media type "${mediaType}"`,
});

const meta = {
  url: 'https://stylelint.io/user-guide/rules/media-type-no-deprecated',
  deprecated: false,
  fixable: true,
  recommended: true,
};

const DEPRECATED_MEDIA_TYPES = new Set([
  'tty', 'tv', 'projection', 'handheld',
  'braille', 'embossed', 'aural', 'speech',
]);

function rule(primary, secondaryOptions, context) {
  return (root, result) => {
    const validOptions = validateOptions(
      result,
      ruleName,
      { actual: primary, possible: [true, false] },
      {
        actual: secondaryOptions,
        possible: { ignoreMediaTypes: [String, RegExp] },
        optional: true,
      }
    );

    if (!validOptions || !primary) return;

    const ignorePatterns = secondaryOptions?.ignoreMediaTypes || [];
    const ignoreRegexes = ignorePatterns.map((pattern) =>
      typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern
    );

    root.walkAtRules(/^media$/i, (atRule) => {
      if (!isStandardSyntaxAtRule(atRule)) return;

      let mediaQueryList;
      try {
        mediaQueryList = parseMediaQuery(atRule.params);
      } catch {
        return;
      }

      for (const mediaQuery of mediaQueryList) {
        if (mediaQuery.type !== 'media-query') continue;

        const mediaTypeNode = mediaQuery.nodes.find(
          (node) => node.type === 'media-type'
        );
        if (!mediaTypeNode) continue;

        const mediaType = mediaTypeNode.value.toLowerCase();
        if (!DEPRECATED_MEDIA_TYPES.has(mediaType)) continue;
        if (ignoreRegexes.some((regex) => regex.test(mediaType))) continue;

        if (context.fix) {
          const index = mediaQuery.nodes.indexOf(mediaTypeNode);
          const prevNode = mediaQuery.nodes[index - 1];

          if (prevNode && ['keyword', 'modifier'].includes(prevNode.type)) {
            mediaQuery.nodes.splice(index - 1, 2);
          } else {
            mediaQuery.nodes.splice(index, 1);
          }

          atRule.params = mediaQueryList.map((mq) => mq.toString()).join(',');
          continue;
        }

        report({
          ruleName,
          result,
          message: messages.rejected(mediaType),
          node: atRule,
          word: mediaType,
        });
      }
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
