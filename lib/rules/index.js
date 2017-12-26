"use strict";

const atRuleBlacklist = require("./at-rule-blacklist");
const atRuleEmptyLineBefore = require("./at-rule-empty-line-before");
const atRuleNameCase = require("./at-rule-name-case");
const atRuleNameNewlineAfter = require("./at-rule-name-newline-after");
const atRuleNameSpaceAfter = require("./at-rule-name-space-after");
const atRuleNoUnknown = require("./at-rule-no-unknown");
const atRuleNoVendorPrefix = require("./at-rule-no-vendor-prefix");
const atRuleSemicolonNewlineAfter = require("./at-rule-semicolon-newline-after");
const atRuleSemicolonSpaceBefore = require("./at-rule-semicolon-space-before");
const atRuleWhitelist = require("./at-rule-whitelist");
const blockClosingBraceEmptyLineBefore = require("./block-closing-brace-empty-line-before");
const blockClosingBraceNewlineAfter = require("./block-closing-brace-newline-after");
const blockClosingBraceNewlineBefore = require("./block-closing-brace-newline-before");
const blockClosingBraceSpaceAfter = require("./block-closing-brace-space-after");
const blockClosingBraceSpaceBefore = require("./block-closing-brace-space-before");
const blockNoEmpty = require("./block-no-empty");
const blockOpeningBraceNewlineAfter = require("./block-opening-brace-newline-after");
const blockOpeningBraceNewlineBefore = require("./block-opening-brace-newline-before");
const blockOpeningBraceSpaceAfter = require("./block-opening-brace-space-after");
const blockOpeningBraceSpaceBefore = require("./block-opening-brace-space-before");
const colorHexCase = require("./color-hex-case");
const colorHexLength = require("./color-hex-length");
const colorNamed = require("./color-named");
const colorNoHex = require("./color-no-hex");
const colorNoInvalidHex = require("./color-no-invalid-hex");
const commentEmptyLineBefore = require("./comment-empty-line-before");
const commentNoEmpty = require("./comment-no-empty");
const commentWhitespaceInside = require("./comment-whitespace-inside");
const commentWordBlacklist = require("./comment-word-blacklist");
const customMediaPattern = require("./custom-media-pattern");
const customPropertyEmptyLineBefore = require("./custom-property-empty-line-before");
const customPropertyPattern = require("./custom-property-pattern");
const declarationBangSpaceAfter = require("./declaration-bang-space-after");
const declarationBangSpaceBefore = require("./declaration-bang-space-before");
const declarationBlockNoDuplicateProperties = require("./declaration-block-no-duplicate-properties");
const declarationBlockNoRedundantLonghandProperties = require("./declaration-block-no-redundant-longhand-properties");
const declarationBlockNoShorthandPropertyOverrides = require("./declaration-block-no-shorthand-property-overrides");
const declarationBlockSemicolonNewlineAfter = require("./declaration-block-semicolon-newline-after");
const declarationBlockSemicolonNewlineBefore = require("./declaration-block-semicolon-newline-before");
const declarationBlockSemicolonSpaceAfter = require("./declaration-block-semicolon-space-after");
const declarationBlockSemicolonSpaceBefore = require("./declaration-block-semicolon-space-before");
const declarationBlockSingleLineMaxDeclarations = require("./declaration-block-single-line-max-declarations");
const declarationBlockTrailingSemicolon = require("./declaration-block-trailing-semicolon");
const declarationColonNewlineAfter = require("./declaration-colon-newline-after");
const declarationColonSpaceAfter = require("./declaration-colon-space-after");
const declarationColonSpaceBefore = require("./declaration-colon-space-before");
const declarationEmptyLineBefore = require("./declaration-empty-line-before");
const declarationNoImportant = require("./declaration-no-important");
const declarationPropertyUnitBlacklist = require("./declaration-property-unit-blacklist");
const declarationPropertyUnitWhitelist = require("./declaration-property-unit-whitelist");
const declarationPropertyValueBlacklist = require("./declaration-property-value-blacklist");
const declarationPropertyValueWhitelist = require("./declaration-property-value-whitelist");
const fontFamilyNameQuotes = require("./font-family-name-quotes");
const fontFamilyNoDuplicateNames = require("./font-family-no-duplicate-names");
const fontFamilyNoMissingGenericFamilyKeyword = require("./font-family-no-missing-generic-family-keyword");
const fontWeightNotation = require("./font-weight-notation");
const functionBlacklist = require("./function-blacklist");
const functionCalcNoUnspacedOperator = require("./function-calc-no-unspaced-operator");
const functionCommaNewlineAfter = require("./function-comma-newline-after");
const functionCommaNewlineBefore = require("./function-comma-newline-before");
const functionCommaSpaceAfter = require("./function-comma-space-after");
const functionCommaSpaceBefore = require("./function-comma-space-before");
const functionLinearGradientNoNonstandardDirection = require("./function-linear-gradient-no-nonstandard-direction");
const functionMaxEmptyLines = require("./function-max-empty-lines");
const functionNameCase = require("./function-name-case");
const functionParenthesesNewlineInside = require("./function-parentheses-newline-inside");
const functionParenthesesSpaceInside = require("./function-parentheses-space-inside");
const functionUrlNoSchemeRelative = require("./function-url-no-scheme-relative");
const functionUrlQuotes = require("./function-url-quotes");
const functionUrlSchemeBlacklist = require("./function-url-scheme-blacklist");
const functionUrlSchemeWhitelist = require("./function-url-scheme-whitelist");
const functionWhitelist = require("./function-whitelist");
const functionWhitespaceAfter = require("./function-whitespace-after");
const indentation = require("./indentation");
const keyframeDeclarationNoImportant = require("./keyframe-declaration-no-important");
const lengthZeroNoUnit = require("./length-zero-no-unit");
const maxEmptyLines = require("./max-empty-lines");
const maxLineLength = require("./max-line-length");
const maxNestingDepth = require("./max-nesting-depth");
const mediaFeatureColonSpaceAfter = require("./media-feature-colon-space-after");
const mediaFeatureColonSpaceBefore = require("./media-feature-colon-space-before");
const mediaFeatureNameBlacklist = require("./media-feature-name-blacklist");
const mediaFeatureNameCase = require("./media-feature-name-case");
const mediaFeatureNameNoUnknown = require("./media-feature-name-no-unknown");
const mediaFeatureNameNoVendorPrefix = require("./media-feature-name-no-vendor-prefix");
const mediaFeatureNameWhitelist = require("./media-feature-name-whitelist");
const mediaFeatureParenthesesSpaceInside = require("./media-feature-parentheses-space-inside");
const mediaFeatureRangeOperatorSpaceAfter = require("./media-feature-range-operator-space-after");
const mediaFeatureRangeOperatorSpaceBefore = require("./media-feature-range-operator-space-before");
const mediaQueryListCommaNewlineAfter = require("./media-query-list-comma-newline-after");
const mediaQueryListCommaNewlineBefore = require("./media-query-list-comma-newline-before");
const mediaQueryListCommaSpaceAfter = require("./media-query-list-comma-space-after");
const mediaQueryListCommaSpaceBefore = require("./media-query-list-comma-space-before");
const noDescendingSpecificity = require("./no-descending-specificity");
const noDuplicateAtImportRules = require("./no-duplicate-at-import-rules");
const noDuplicateSelectors = require("./no-duplicate-selectors");
const noEmptySource = require("./no-empty-source");
const noEolWhitespace = require("./no-eol-whitespace");
const noExtraSemicolons = require("./no-extra-semicolons");
const noInvalidDoubleSlashComments = require("./no-invalid-double-slash-comments");
const noMissingEndOfSourceNewline = require("./no-missing-end-of-source-newline");
const noUnknownAnimations = require("./no-unknown-animations");
const numberLeadingZero = require("./number-leading-zero");
const numberMaxPrecision = require("./number-max-precision");
const numberNoTrailingZeros = require("./number-no-trailing-zeros");
const propertyBlacklist = require("./property-blacklist");
const propertyCase = require("./property-case");
const propertyNoUnknown = require("./property-no-unknown");
const propertyNoVendorPrefix = require("./property-no-vendor-prefix");
const propertyWhitelist = require("./property-whitelist");
const ruleEmptyLineBefore = require("./rule-empty-line-before");
const selectorAttributeBracketsSpaceInside = require("./selector-attribute-brackets-space-inside");
const selectorAttributeOperatorBlacklist = require("./selector-attribute-operator-blacklist");
const selectorAttributeOperatorSpaceAfter = require("./selector-attribute-operator-space-after");
const selectorAttributeOperatorSpaceBefore = require("./selector-attribute-operator-space-before");
const selectorAttributeOperatorWhitelist = require("./selector-attribute-operator-whitelist");
const selectorAttributeQuotes = require("./selector-attribute-quotes");
const selectorClassPattern = require("./selector-class-pattern");
const selectorCombinatorSpaceAfter = require("./selector-combinator-space-after");
const selectorCombinatorSpaceBefore = require("./selector-combinator-space-before");
const selectorDescendantCombinatorNoNonSpace = require("./selector-descendant-combinator-no-non-space");
const selectorIdPattern = require("./selector-id-pattern");
const selectorListCommaNewlineAfter = require("./selector-list-comma-newline-after");
const selectorListCommaNewlineBefore = require("./selector-list-comma-newline-before");
const selectorListCommaSpaceAfter = require("./selector-list-comma-space-after");
const selectorListCommaSpaceBefore = require("./selector-list-comma-space-before");
const selectorMaxAttribute = require("./selector-max-attribute");
const selectorMaxClass = require("./selector-max-class");
const selectorMaxCombinators = require("./selector-max-combinators");
const selectorMaxCompoundSelectors = require("./selector-max-compound-selectors");
const selectorMaxEmptyLines = require("./selector-max-empty-lines");
const selectorMaxId = require("./selector-max-id");
const selectorMaxSpecificity = require("./selector-max-specificity");
const selectorMaxType = require("./selector-max-type");
const selectorMaxUniversal = require("./selector-max-universal");
const selectorNestedPattern = require("./selector-nested-pattern");
const selectorNoQualifyingType = require("./selector-no-qualifying-type");
const selectorNoVendorPrefix = require("./selector-no-vendor-prefix");
const selectorPseudoClassBlacklist = require("./selector-pseudo-class-blacklist");
const selectorPseudoClassCase = require("./selector-pseudo-class-case");
const selectorPseudoClassNoUnknown = require("./selector-pseudo-class-no-unknown");
const selectorPseudoClassParenthesesSpaceInside = require("./selector-pseudo-class-parentheses-space-inside");
const selectorPseudoClassWhitelist = require("./selector-pseudo-class-whitelist");
const selectorPseudoElementCase = require("./selector-pseudo-element-case");
const selectorPseudoElementColonNotation = require("./selector-pseudo-element-colon-notation");
const selectorPseudoElementNoUnknown = require("./selector-pseudo-element-no-unknown");
const selectorTypeCase = require("./selector-type-case");
const selectorTypeNoUnknown = require("./selector-type-no-unknown");
const shorthandPropertyNoRedundantValues = require("./shorthand-property-no-redundant-values");
const stringNoNewline = require("./string-no-newline");
const stringQuotes = require("./string-quotes");
const timeMinMilliseconds = require("./time-min-milliseconds");
const unitBlacklist = require("./unit-blacklist");
const unitCase = require("./unit-case");
const unitNoUnknown = require("./unit-no-unknown");
const unitWhitelist = require("./unit-whitelist");
const valueKeywordCase = require("./value-keyword-case");
const valueListCommaNewlineAfter = require("./value-list-comma-newline-after");
const valueListCommaNewlineBefore = require("./value-list-comma-newline-before");
const valueListCommaSpaceAfter = require("./value-list-comma-space-after");
const valueListCommaSpaceBefore = require("./value-list-comma-space-before");
const valueListMaxEmptyLines = require("./value-list-max-empty-lines");
const valueNoVendorPrefix = require("./value-no-vendor-prefix");

module.exports = {
  "at-rule-blacklist": atRuleBlacklist,
  "at-rule-empty-line-before": atRuleEmptyLineBefore,
  "at-rule-name-case": atRuleNameCase,
  "at-rule-name-newline-after": atRuleNameNewlineAfter,
  "at-rule-semicolon-space-before": atRuleSemicolonSpaceBefore,
  "at-rule-name-space-after": atRuleNameSpaceAfter,
  "at-rule-no-unknown": atRuleNoUnknown,
  "at-rule-no-vendor-prefix": atRuleNoVendorPrefix,
  "at-rule-semicolon-newline-after": atRuleSemicolonNewlineAfter,
  "at-rule-whitelist": atRuleWhitelist,
  "block-closing-brace-empty-line-before": blockClosingBraceEmptyLineBefore,
  "block-closing-brace-newline-after": blockClosingBraceNewlineAfter,
  "block-closing-brace-newline-before": blockClosingBraceNewlineBefore,
  "block-closing-brace-space-after": blockClosingBraceSpaceAfter,
  "block-closing-brace-space-before": blockClosingBraceSpaceBefore,
  "block-no-empty": blockNoEmpty,
  "block-opening-brace-newline-after": blockOpeningBraceNewlineAfter,
  "block-opening-brace-newline-before": blockOpeningBraceNewlineBefore,
  "block-opening-brace-space-after": blockOpeningBraceSpaceAfter,
  "block-opening-brace-space-before": blockOpeningBraceSpaceBefore,
  "color-hex-case": colorHexCase,
  "color-hex-length": colorHexLength,
  "color-named": colorNamed,
  "color-no-hex": colorNoHex,
  "color-no-invalid-hex": colorNoInvalidHex,
  "comment-empty-line-before": commentEmptyLineBefore,
  "comment-no-empty": commentNoEmpty,
  "comment-whitespace-inside": commentWhitespaceInside,
  "comment-word-blacklist": commentWordBlacklist,
  "custom-media-pattern": customMediaPattern,
  "custom-property-empty-line-before": customPropertyEmptyLineBefore,
  "custom-property-pattern": customPropertyPattern,
  "declaration-bang-space-after": declarationBangSpaceAfter,
  "declaration-bang-space-before": declarationBangSpaceBefore,
  "declaration-block-no-duplicate-properties": declarationBlockNoDuplicateProperties,
  "declaration-block-no-redundant-longhand-properties": declarationBlockNoRedundantLonghandProperties,
  "declaration-block-no-shorthand-property-overrides": declarationBlockNoShorthandPropertyOverrides,
  "declaration-block-semicolon-newline-after": declarationBlockSemicolonNewlineAfter,
  "declaration-block-semicolon-newline-before": declarationBlockSemicolonNewlineBefore,
  "declaration-block-semicolon-space-after": declarationBlockSemicolonSpaceAfter,
  "declaration-block-semicolon-space-before": declarationBlockSemicolonSpaceBefore,
  "declaration-block-single-line-max-declarations": declarationBlockSingleLineMaxDeclarations,
  "declaration-block-trailing-semicolon": declarationBlockTrailingSemicolon,
  "declaration-colon-newline-after": declarationColonNewlineAfter,
  "declaration-colon-space-after": declarationColonSpaceAfter,
  "declaration-colon-space-before": declarationColonSpaceBefore,
  "declaration-empty-line-before": declarationEmptyLineBefore,
  "declaration-no-important": declarationNoImportant,
  "declaration-property-unit-blacklist": declarationPropertyUnitBlacklist,
  "declaration-property-unit-whitelist": declarationPropertyUnitWhitelist,
  "declaration-property-value-blacklist": declarationPropertyValueBlacklist,
  "declaration-property-value-whitelist": declarationPropertyValueWhitelist,
  "font-family-no-missing-generic-family-keyword": fontFamilyNoMissingGenericFamilyKeyword,
  "font-family-name-quotes": fontFamilyNameQuotes,
  "font-family-no-duplicate-names": fontFamilyNoDuplicateNames,
  "font-weight-notation": fontWeightNotation,
  "function-blacklist": functionBlacklist,
  "function-calc-no-unspaced-operator": functionCalcNoUnspacedOperator,
  "function-comma-newline-after": functionCommaNewlineAfter,
  "function-comma-newline-before": functionCommaNewlineBefore,
  "function-comma-space-after": functionCommaSpaceAfter,
  "function-comma-space-before": functionCommaSpaceBefore,
  "function-linear-gradient-no-nonstandard-direction": functionLinearGradientNoNonstandardDirection,
  "function-max-empty-lines": functionMaxEmptyLines,
  "function-name-case": functionNameCase,
  "function-parentheses-newline-inside": functionParenthesesNewlineInside,
  "function-parentheses-space-inside": functionParenthesesSpaceInside,
  "function-url-no-scheme-relative": functionUrlNoSchemeRelative,
  "function-url-quotes": functionUrlQuotes,
  "function-url-scheme-blacklist": functionUrlSchemeBlacklist,
  "function-url-scheme-whitelist": functionUrlSchemeWhitelist,
  "function-whitelist": functionWhitelist,
  "function-whitespace-after": functionWhitespaceAfter,
  "keyframe-declaration-no-important": keyframeDeclarationNoImportant,
  "length-zero-no-unit": lengthZeroNoUnit,
  "max-empty-lines": maxEmptyLines,
  "max-line-length": maxLineLength,
  "max-nesting-depth": maxNestingDepth,
  "media-feature-colon-space-after": mediaFeatureColonSpaceAfter,
  "media-feature-colon-space-before": mediaFeatureColonSpaceBefore,
  "media-feature-name-blacklist": mediaFeatureNameBlacklist,
  "media-feature-name-case": mediaFeatureNameCase,
  "media-feature-name-no-unknown": mediaFeatureNameNoUnknown,
  "media-feature-name-no-vendor-prefix": mediaFeatureNameNoVendorPrefix,
  "media-feature-name-whitelist": mediaFeatureNameWhitelist,
  "media-feature-parentheses-space-inside": mediaFeatureParenthesesSpaceInside,
  "media-feature-range-operator-space-after": mediaFeatureRangeOperatorSpaceAfter,
  "media-feature-range-operator-space-before": mediaFeatureRangeOperatorSpaceBefore,
  "media-query-list-comma-newline-after": mediaQueryListCommaNewlineAfter,
  "media-query-list-comma-newline-before": mediaQueryListCommaNewlineBefore,
  "media-query-list-comma-space-after": mediaQueryListCommaSpaceAfter,
  "media-query-list-comma-space-before": mediaQueryListCommaSpaceBefore,
  "no-descending-specificity": noDescendingSpecificity,
  "no-duplicate-at-import-rules": noDuplicateAtImportRules,
  "no-duplicate-selectors": noDuplicateSelectors,
  "no-empty-source": noEmptySource,
  "no-eol-whitespace": noEolWhitespace,
  "no-extra-semicolons": noExtraSemicolons,
  "no-invalid-double-slash-comments": noInvalidDoubleSlashComments,
  "no-missing-end-of-source-newline": noMissingEndOfSourceNewline,
  "no-unknown-animations": noUnknownAnimations,
  "number-leading-zero": numberLeadingZero,
  "number-max-precision": numberMaxPrecision,
  "number-no-trailing-zeros": numberNoTrailingZeros,
  "property-blacklist": propertyBlacklist,
  "property-case": propertyCase,
  "property-no-unknown": propertyNoUnknown,
  "property-no-vendor-prefix": propertyNoVendorPrefix,
  "property-whitelist": propertyWhitelist,
  "rule-empty-line-before": ruleEmptyLineBefore,
  "selector-attribute-brackets-space-inside": selectorAttributeBracketsSpaceInside,
  "selector-attribute-operator-blacklist": selectorAttributeOperatorBlacklist,
  "selector-attribute-operator-space-after": selectorAttributeOperatorSpaceAfter,
  "selector-attribute-operator-space-before": selectorAttributeOperatorSpaceBefore,
  "selector-attribute-operator-whitelist": selectorAttributeOperatorWhitelist,
  "selector-attribute-quotes": selectorAttributeQuotes,
  "selector-class-pattern": selectorClassPattern,
  "selector-combinator-space-after": selectorCombinatorSpaceAfter,
  "selector-combinator-space-before": selectorCombinatorSpaceBefore,
  "selector-descendant-combinator-no-non-space": selectorDescendantCombinatorNoNonSpace,
  "selector-id-pattern": selectorIdPattern,
  "selector-list-comma-newline-after": selectorListCommaNewlineAfter,
  "selector-list-comma-newline-before": selectorListCommaNewlineBefore,
  "selector-list-comma-space-after": selectorListCommaSpaceAfter,
  "selector-list-comma-space-before": selectorListCommaSpaceBefore,
  "selector-max-attribute": selectorMaxAttribute,
  "selector-max-class": selectorMaxClass,
  "selector-max-combinators": selectorMaxCombinators,
  "selector-max-compound-selectors": selectorMaxCompoundSelectors,
  "selector-max-empty-lines": selectorMaxEmptyLines,
  "selector-max-id": selectorMaxId,
  "selector-max-specificity": selectorMaxSpecificity,
  "selector-max-type": selectorMaxType,
  "selector-max-universal": selectorMaxUniversal,
  "selector-nested-pattern": selectorNestedPattern,
  "selector-no-qualifying-type": selectorNoQualifyingType,
  "selector-no-vendor-prefix": selectorNoVendorPrefix,
  "selector-pseudo-class-blacklist": selectorPseudoClassBlacklist,
  "selector-pseudo-class-case": selectorPseudoClassCase,
  "selector-pseudo-class-no-unknown": selectorPseudoClassNoUnknown,
  "selector-pseudo-class-parentheses-space-inside": selectorPseudoClassParenthesesSpaceInside,
  "selector-pseudo-class-whitelist": selectorPseudoClassWhitelist,
  "selector-pseudo-element-case": selectorPseudoElementCase,
  "selector-pseudo-element-colon-notation": selectorPseudoElementColonNotation,
  "selector-pseudo-element-no-unknown": selectorPseudoElementNoUnknown,
  "selector-type-case": selectorTypeCase,
  "selector-type-no-unknown": selectorTypeNoUnknown,
  "shorthand-property-no-redundant-values": shorthandPropertyNoRedundantValues,
  "string-no-newline": stringNoNewline,
  "string-quotes": stringQuotes,
  "time-min-milliseconds": timeMinMilliseconds,
  "unit-blacklist": unitBlacklist,
  "unit-case": unitCase,
  "unit-no-unknown": unitNoUnknown,
  "unit-whitelist": unitWhitelist,
  "value-keyword-case": valueKeywordCase,
  "value-list-comma-newline-after": valueListCommaNewlineAfter,
  "value-list-comma-newline-before": valueListCommaNewlineBefore,
  "value-list-comma-space-after": valueListCommaSpaceAfter,
  "value-list-comma-space-before": valueListCommaSpaceBefore,
  "value-list-max-empty-lines": valueListMaxEmptyLines,
  "value-no-vendor-prefix": valueNoVendorPrefix,
  indentation: indentation /* Placed here for better autofixing */ // eslint-disable-line object-shorthand
};
