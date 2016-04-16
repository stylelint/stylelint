import atRuleSemicolonNewlineAfter from "./at-rule-semicolon-newline-after"
import atRuleNameCase from "./at-rule-name-case"
import atRuleEmptyLineBefore from "./at-rule-empty-line-before"
import atRuleNoVendorPrefix from "./at-rule-no-vendor-prefix"
import blockClosingBraceNewlineAfter from "./block-closing-brace-newline-after"
import blockClosingBraceNewlineBefore from "./block-closing-brace-newline-before"
import blockClosingBraceSpaceAfter from "./block-closing-brace-space-after"
import blockClosingBraceSpaceBefore from "./block-closing-brace-space-before"
import blockNoEmpty from "./block-no-empty"
import blockNoSingleLine from "./block-no-single-line"
import blockOpeningBraceNewlineAfter from "./block-opening-brace-newline-after"
import blockOpeningBraceNewlineBefore from "./block-opening-brace-newline-before"
import blockOpeningBraceSpaceAfter from "./block-opening-brace-space-after"
import blockOpeningBraceSpaceBefore from "./block-opening-brace-space-before"
import colorHexCase from "./color-hex-case"
import colorHexLength from "./color-hex-length"
import colorNamed from "./color-named"
import colorNoHex from "./color-no-hex"
import colorNoInvalidHex from "./color-no-invalid-hex"
import commentEmptyLineBefore from "./comment-empty-line-before"
import commentWhitespaceInside from "./comment-whitespace-inside"
import customMediaPattern from "./custom-media-pattern"
import customPropertyNoOutsideRoot from "./custom-property-no-outside-root"
import customPropertyPattern from "./custom-property-pattern"
import declarationBangSpaceAfter from "./declaration-bang-space-after"
import declarationBangSpaceBefore from "./declaration-bang-space-before"
import declarationBlockNoDuplicateProperties from "./declaration-block-no-duplicate-properties"
import declarationBlockNoIgnoredProperties from "./declaration-block-no-ignored-properties"
import declarationBlockNoShorthandPropertyOverrides from "./declaration-block-no-shorthand-property-overrides"
import declarationBlockPropertiesOrder from "./declaration-block-properties-order"
import declarationBlockSemicolonNewlineAfter from "./declaration-block-semicolon-newline-after"
import declarationBlockSemicolonNewlineBefore from "./declaration-block-semicolon-newline-before"
import declarationBlockSemicolonSpaceAfter from "./declaration-block-semicolon-space-after"
import declarationBlockSemicolonSpaceBefore from "./declaration-block-semicolon-space-before"
import declarationBlockSingleLineMaxDeclarations from "./declaration-block-single-line-max-declarations"
import declarationBlockTrailingSemicolon from "./declaration-block-trailing-semicolon"
import declarationColonNewlineAfter from "./declaration-colon-newline-after"
import declarationColonSpaceAfter from "./declaration-colon-space-after"
import declarationColonSpaceBefore from "./declaration-colon-space-before"
import declarationNoImportant from "./declaration-no-important"
import fontFamilyNameQuotes from "./font-family-name-quotes"
import fontWeightNotation from "./font-weight-notation"
import functionBlacklist from "./function-blacklist"
import functionCalcNoUnspacedOperator from "./function-calc-no-unspaced-operator"
import functionCommaNewlineAfter from "./function-comma-newline-after"
import functionCommaNewlineBefore from "./function-comma-newline-before"
import functionCommaSpaceAfter from "./function-comma-space-after"
import functionCommaSpaceBefore from "./function-comma-space-before"
import functionLinearGradientNoNonstandardDirection from "./function-linear-gradient-no-nonstandard-direction"
import functionMaxEmptyLines from "./function-max-empty-lines"
import functionNameCase from "./function-name-case"
import functionParenthesesNewlineInside from "./function-parentheses-newline-inside"
import functionParenthesesSpaceInside from "./function-parentheses-space-inside"
import functionUrlDataUris from "./function-url-data-uris"
import functionUrlQuotes from "./function-url-quotes"
import functionWhitelist from "./function-whitelist"
import functionWhitespaceAfter from "./function-whitespace-after"
import indentation from "./indentation"
import maxEmptyLines from "./max-empty-lines"
import maxLineLength from "./max-line-length"
import maxNestingDepth from "./max-nesting-depth"
import mediaFeatureColonSpaceAfter from "./media-feature-colon-space-after"
import mediaFeatureColonSpaceBefore from "./media-feature-colon-space-before"
import mediaFeatureNameNoVendorPrefix from "./media-feature-name-no-vendor-prefix"
import mediaFeatureNoMissingPunctuation from "./media-feature-no-missing-punctuation"
import mediaFeatureRangeOperatorSpaceAfter from "./media-feature-range-operator-space-after"
import mediaFeatureRangeOperatorSpaceBefore from "./media-feature-range-operator-space-before"
import mediaQueryListCommaNewlineAfter from "./media-query-list-comma-newline-after"
import mediaQueryListCommaNewlineBefore from "./media-query-list-comma-newline-before"
import mediaQueryListCommaSpaceAfter from "./media-query-list-comma-space-after"
import mediaQueryListCommaSpaceBefore from "./media-query-list-comma-space-before"
import mediaQueryParenthesesSpaceInside from "./media-query-parentheses-space-inside"
import noBrowserHacks from "./no-browser-hacks"
import noDescendingSpecificity from "./no-descending-specificity"
import noDuplicateSelectors from "./no-duplicate-selectors"
import noEolWhitespace from "./no-eol-whitespace"
import noIndistinguishableColors from "./no-indistinguishable-colors"
import noInvalidDoubleSlashComments from "./no-invalid-double-slash-comments"
import noMissingEofNewline from "./no-missing-eof-newline"
import noSupportedBrowserFeatures from "./no-unsupported-browser-features"
import noUnknownAnimations from "./no-unknown-animations"
import numberLeadingZero from "./number-leading-zero"
import numberMaxPrecision from "./number-max-precision"
import numberNoTrailingZeros from "./number-no-trailing-zeros"
import numberZeroLengthNoUnit from "./number-zero-length-no-unit"
import propertyBlacklist from "./property-blacklist"
import propertyCase from "./property-case"
import propertyNoVendorPrefix from "./property-no-vendor-prefix"
import propertyUnitBlacklist from "./property-unit-blacklist"
import propertyUnitWhitelist from "./property-unit-whitelist"
import propertyValueBlacklist from "./property-value-blacklist"
import propertyValueWhitelist from "./property-value-whitelist"
import propertyWhitelist from "./property-whitelist"
import rootNoStandardProperties from "./root-no-standard-properties"
import ruleNestedEmptyLineBefore from "./rule-nested-empty-line-before"
import ruleNonNestedEmptyLineBefore from "./rule-non-nested-empty-line-before"
import selectorClassPattern from "./selector-class-pattern"
import selectorCombinatorSpaceAfter from "./selector-combinator-space-after"
import selectorCombinatorSpaceBefore from "./selector-combinator-space-before"
import selectorIdPattern from "./selector-id-pattern"
import selectorListCommaNewlineAfter from "./selector-list-comma-newline-after"
import selectorListCommaNewlineBefore from "./selector-list-comma-newline-before"
import selectorListCommaSpaceAfter from "./selector-list-comma-space-after"
import selectorListCommaSpaceBefore from "./selector-list-comma-space-before"
import selectorMaxSpecificity from "./selector-max-specificity"
import selectorNoAttribute from "./selector-no-attribute"
import selectorNoCombinator from "./selector-no-combinator"
import selectorNoId from "./selector-no-id"
import selectorNoType from "./selector-no-type"
import selectorNoUniversal from "./selector-no-universal"
import selectorNoVendorPrefix from "./selector-no-vendor-prefix"
import selectorPseudoClassCase from "./selector-pseudo-class-case"
import selectorPseudoElementCase from "./selector-pseudo-element-case"
import selectorPseudoElementColonNotation from "./selector-pseudo-element-colon-notation"
import selectorRootNoComposition from "./selector-root-no-composition"
import selectorTypeCase from "./selector-type-case"
import stringNoNewline from "./string-no-newline"
import stringQuotes from "./string-quotes"
import stylelintDisableReason from "./stylelint-disable-reason"
import timeNoImperceptible from "./time-no-imperceptible"
import unitBlacklist from "./unit-blacklist"
import unitCase from "./unit-case"
import unitNoUnknown from "./unit-no-unknown"
import unitWhitelist from "./unit-whitelist"
import valueKeywordCase from "./value-keyword-case"
import valueListCommaNewlineAfter from "./value-list-comma-newline-after"
import valueListCommaNewlineBefore from "./value-list-comma-newline-before"
import valueListCommaSpaceAfter from "./value-list-comma-space-after"
import valueListCommaSpaceBefore from "./value-list-comma-space-before"
import valueNoVendorPrefix from "./value-no-vendor-prefix"

export default {
  "at-rule-semicolon-newline-after": atRuleSemicolonNewlineAfter,
  "at-rule-name-case": atRuleNameCase,
  "at-rule-empty-line-before": atRuleEmptyLineBefore,
  "at-rule-no-vendor-prefix": atRuleNoVendorPrefix,
  "block-closing-brace-newline-after": blockClosingBraceNewlineAfter,
  "block-closing-brace-newline-before": blockClosingBraceNewlineBefore,
  "block-closing-brace-space-after": blockClosingBraceSpaceAfter,
  "block-closing-brace-space-before": blockClosingBraceSpaceBefore,
  "block-no-empty": blockNoEmpty,
  "block-no-single-line": blockNoSingleLine,
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
  "comment-whitespace-inside": commentWhitespaceInside,
  "custom-media-pattern": customMediaPattern,
  "custom-property-no-outside-root": customPropertyNoOutsideRoot,
  "custom-property-pattern": customPropertyPattern,
  "declaration-bang-space-after": declarationBangSpaceAfter,
  "declaration-bang-space-before": declarationBangSpaceBefore,
  "declaration-block-no-duplicate-properties": declarationBlockNoDuplicateProperties,
  "declaration-block-no-ignored-properties": declarationBlockNoIgnoredProperties,
  "declaration-block-no-shorthand-property-overrides": declarationBlockNoShorthandPropertyOverrides,
  "declaration-block-properties-order": declarationBlockPropertiesOrder,
  "declaration-block-semicolon-newline-after": declarationBlockSemicolonNewlineAfter,
  "declaration-block-semicolon-newline-before": declarationBlockSemicolonNewlineBefore,
  "declaration-block-semicolon-space-after": declarationBlockSemicolonSpaceAfter,
  "declaration-block-semicolon-space-before": declarationBlockSemicolonSpaceBefore,
  "declaration-block-single-line-max-declarations": declarationBlockSingleLineMaxDeclarations,
  "declaration-block-trailing-semicolon": declarationBlockTrailingSemicolon,
  "declaration-colon-newline-after": declarationColonNewlineAfter,
  "declaration-colon-space-after": declarationColonSpaceAfter,
  "declaration-colon-space-before": declarationColonSpaceBefore,
  "declaration-no-important": declarationNoImportant,
  "font-family-name-quotes": fontFamilyNameQuotes,
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
  "function-url-data-uris": functionUrlDataUris,
  "function-url-quotes": functionUrlQuotes,
  "function-whitelist": functionWhitelist,
  "function-whitespace-after": functionWhitespaceAfter,
  "indentation": indentation, // eslint-disable-line object-shorthand
  "max-empty-lines": maxEmptyLines,
  "max-line-length": maxLineLength,
  "max-nesting-depth": maxNestingDepth,
  "media-feature-colon-space-after": mediaFeatureColonSpaceAfter,
  "media-feature-colon-space-before": mediaFeatureColonSpaceBefore,
  "media-feature-name-no-vendor-prefix": mediaFeatureNameNoVendorPrefix,
  "media-feature-no-missing-punctuation": mediaFeatureNoMissingPunctuation,
  "media-feature-range-operator-space-after": mediaFeatureRangeOperatorSpaceAfter,
  "media-feature-range-operator-space-before": mediaFeatureRangeOperatorSpaceBefore,
  "media-query-list-comma-newline-after": mediaQueryListCommaNewlineAfter,
  "media-query-list-comma-newline-before": mediaQueryListCommaNewlineBefore,
  "media-query-list-comma-space-after": mediaQueryListCommaSpaceAfter,
  "media-query-list-comma-space-before": mediaQueryListCommaSpaceBefore,
  "media-query-parentheses-space-inside": mediaQueryParenthesesSpaceInside,
  "no-browser-hacks": noBrowserHacks,
  "no-descending-specificity": noDescendingSpecificity,
  "no-duplicate-selectors": noDuplicateSelectors,
  "no-eol-whitespace": noEolWhitespace,
  "no-indistinguishable-colors": noIndistinguishableColors,
  "no-invalid-double-slash-comments": noInvalidDoubleSlashComments,
  "no-missing-eof-newline": noMissingEofNewline,
  "no-unknown-animations": noUnknownAnimations,
  "no-unsupported-browser-features": noSupportedBrowserFeatures,
  "number-leading-zero": numberLeadingZero,
  "number-max-precision": numberMaxPrecision,
  "number-no-trailing-zeros": numberNoTrailingZeros,
  "number-zero-length-no-unit": numberZeroLengthNoUnit,
  "property-blacklist": propertyBlacklist,
  "property-case": propertyCase,
  "property-no-vendor-prefix": propertyNoVendorPrefix,
  "property-unit-blacklist": propertyUnitBlacklist,
  "property-unit-whitelist": propertyUnitWhitelist,
  "property-value-blacklist": propertyValueBlacklist,
  "property-value-whitelist": propertyValueWhitelist,
  "property-whitelist": propertyWhitelist,
  "root-no-standard-properties": rootNoStandardProperties,
  "rule-nested-empty-line-before": ruleNestedEmptyLineBefore,
  "rule-non-nested-empty-line-before": ruleNonNestedEmptyLineBefore,
  "selector-class-pattern": selectorClassPattern,
  "selector-combinator-space-after": selectorCombinatorSpaceAfter,
  "selector-combinator-space-before": selectorCombinatorSpaceBefore,
  "selector-id-pattern": selectorIdPattern,
  "selector-list-comma-newline-after": selectorListCommaNewlineAfter,
  "selector-list-comma-newline-before": selectorListCommaNewlineBefore,
  "selector-list-comma-space-after": selectorListCommaSpaceAfter,
  "selector-list-comma-space-before": selectorListCommaSpaceBefore,
  "selector-max-specificity": selectorMaxSpecificity,
  "selector-no-attribute": selectorNoAttribute,
  "selector-no-combinator": selectorNoCombinator,
  "selector-no-id": selectorNoId,
  "selector-no-type": selectorNoType,
  "selector-no-universal": selectorNoUniversal,
  "selector-no-vendor-prefix": selectorNoVendorPrefix,
  "selector-pseudo-class-case": selectorPseudoClassCase,
  "selector-pseudo-element-case": selectorPseudoElementCase,
  "selector-pseudo-element-colon-notation": selectorPseudoElementColonNotation,
  "selector-root-no-composition": selectorRootNoComposition,
  "selector-type-case": selectorTypeCase,
  "string-no-newline": stringNoNewline,
  "string-quotes": stringQuotes,
  "stylelint-disable-reason": stylelintDisableReason,
  "time-no-imperceptible": timeNoImperceptible,
  "unit-blacklist": unitBlacklist,
  "unit-case": unitCase,
  "unit-no-unknown": unitNoUnknown,
  "unit-whitelist": unitWhitelist,
  "value-keyword-case": valueKeywordCase,
  "value-list-comma-newline-after": valueListCommaNewlineAfter,
  "value-list-comma-newline-before": valueListCommaNewlineBefore,
  "value-list-comma-space-after": valueListCommaSpaceAfter,
  "value-list-comma-space-before": valueListCommaSpaceBefore,
  "value-no-vendor-prefix": valueNoVendorPrefix,
}
