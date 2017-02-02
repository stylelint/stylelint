"use strict"

const atRuleBlacklist = require("./at-rule-blacklist")
const atRuleEmptyLineBefore = require("./at-rule-empty-line-before")
const atRuleNameCase = require("./at-rule-name-case")
const atRuleNameNewlineAfter = require("./at-rule-name-newline-after")
const atRuleNameSpaceAfter = require("./at-rule-name-space-after")
const atRuleNoUnknown = require("./at-rule-no-unknown")
const atRuleNoVendorPrefix = require("./at-rule-no-vendor-prefix")
const atRuleSemicolonNewlineAfter = require("./at-rule-semicolon-newline-after")
const atRuleWhitelist = require("./at-rule-whitelist")
const blockClosingBraceEmptyLineBefore = require("./block-closing-brace-empty-line-before")
const blockClosingBraceNewlineAfter = require("./block-closing-brace-newline-after")
const blockClosingBraceNewlineBefore = require("./block-closing-brace-newline-before")
const blockClosingBraceSpaceAfter = require("./block-closing-brace-space-after")
const blockClosingBraceSpaceBefore = require("./block-closing-brace-space-before")
const blockNoEmpty = require("./block-no-empty")
const blockNoSingleLine = require("./block-no-single-line")
const blockOpeningBraceNewlineAfter = require("./block-opening-brace-newline-after")
const blockOpeningBraceNewlineBefore = require("./block-opening-brace-newline-before")
const blockOpeningBraceSpaceAfter = require("./block-opening-brace-space-after")
const blockOpeningBraceSpaceBefore = require("./block-opening-brace-space-before")
const colorHexCase = require("./color-hex-case")
const colorHexLength = require("./color-hex-length")
const colorNamed = require("./color-named")
const colorNoHex = require("./color-no-hex")
const colorNoInvalidHex = require("./color-no-invalid-hex")
const commentEmptyLineBefore = require("./comment-empty-line-before")
const commentNoEmpty = require("./comment-no-empty")
const commentWhitespaceInside = require("./comment-whitespace-inside")
const commentWordBlacklist = require("./comment-word-blacklist")
const customMediaPattern = require("./custom-media-pattern")
const customPropertyEmptyLineBefore = require("./custom-property-empty-line-before")
const customPropertyNoOutsideRoot = require("./custom-property-no-outside-root")
const customPropertyPattern = require("./custom-property-pattern")
const declarationBangSpaceAfter = require("./declaration-bang-space-after")
const declarationBangSpaceBefore = require("./declaration-bang-space-before")
const declarationBlockNoDuplicateProperties = require("./declaration-block-no-duplicate-properties")
const declarationBlockNoIgnoredProperties = require("./declaration-block-no-ignored-properties")
const declarationBlockNoRedundantLonghandProperties = require("./declaration-block-no-redundant-longhand-properties")
const declarationBlockNoShorthandPropertyOverrides = require("./declaration-block-no-shorthand-property-overrides")
const declarationBlockPropertiesOrder = require("./declaration-block-properties-order")
const declarationBlockSemicolonNewlineAfter = require("./declaration-block-semicolon-newline-after")
const declarationBlockSemicolonNewlineBefore = require("./declaration-block-semicolon-newline-before")
const declarationBlockSemicolonSpaceAfter = require("./declaration-block-semicolon-space-after")
const declarationBlockSemicolonSpaceBefore = require("./declaration-block-semicolon-space-before")
const declarationBlockSingleLineMaxDeclarations = require("./declaration-block-single-line-max-declarations")
const declarationBlockTrailingSemicolon = require("./declaration-block-trailing-semicolon")
const declarationColonNewlineAfter = require("./declaration-colon-newline-after")
const declarationColonSpaceAfter = require("./declaration-colon-space-after")
const declarationColonSpaceBefore = require("./declaration-colon-space-before")
const declarationEmptyLineBefore = require("./declaration-empty-line-before")
const declarationNoImportant = require("./declaration-no-important")
const declarationPropertyUnitBlacklist = require("./declaration-property-unit-blacklist")
const declarationPropertyUnitWhitelist = require("./declaration-property-unit-whitelist")
const declarationPropertyValueBlacklist = require("./declaration-property-value-blacklist")
const declarationPropertyValueWhitelist = require("./declaration-property-value-whitelist")
const fontFamilyNameQuotes = require("./font-family-name-quotes")
const fontFamilyNoDuplicateNames = require("./font-family-no-duplicate-names")
const fontWeightNotation = require("./font-weight-notation")
const functionBlacklist = require("./function-blacklist")
const functionCalcNoUnspacedOperator = require("./function-calc-no-unspaced-operator")
const functionCommaNewlineAfter = require("./function-comma-newline-after")
const functionCommaNewlineBefore = require("./function-comma-newline-before")
const functionCommaSpaceAfter = require("./function-comma-space-after")
const functionCommaSpaceBefore = require("./function-comma-space-before")
const functionLinearGradientNoNonstandardDirection = require("./function-linear-gradient-no-nonstandard-direction")
const functionMaxEmptyLines = require("./function-max-empty-lines")
const functionNameCase = require("./function-name-case")
const functionParenthesesNewlineInside = require("./function-parentheses-newline-inside")
const functionParenthesesSpaceInside = require("./function-parentheses-space-inside")
const functionUrlDataUris = require("./function-url-data-uris")
const functionUrlNoSchemeRelative = require("./function-url-no-scheme-relative")
const functionUrlQuotes = require("./function-url-quotes")
const functionUrlSchemeWhitelist = require("./function-url-scheme-whitelist")
const functionWhitelist = require("./function-whitelist")
const functionWhitespaceAfter = require("./function-whitespace-after")
const indentation = require("./indentation")
const keyframeDeclarationNoImportant = require("./keyframe-declaration-no-important")
const lengthZeroNoUnit = require("./length-zero-no-unit")
const maxEmptyLines = require("./max-empty-lines")
const maxLineLength = require("./max-line-length")
const maxNestingDepth = require("./max-nesting-depth")
const mediaFeatureColonSpaceAfter = require("./media-feature-colon-space-after")
const mediaFeatureColonSpaceBefore = require("./media-feature-colon-space-before")
const mediaFeatureNameBlacklist = require("./media-feature-name-blacklist")
const mediaFeatureNameCase = require("./media-feature-name-case")
const mediaFeatureNameNoUnknown = require("./media-feature-name-no-unknown")
const mediaFeatureNameNoVendorPrefix = require("./media-feature-name-no-vendor-prefix")
const mediaFeatureNameWhitelist = require("./media-feature-name-whitelist")
const mediaFeatureNoMissingPunctuation = require("./media-feature-no-missing-punctuation")
const mediaFeatureParenthesesSpaceInside = require("./media-feature-parentheses-space-inside")
const mediaFeatureRangeOperatorSpaceAfter = require("./media-feature-range-operator-space-after")
const mediaFeatureRangeOperatorSpaceBefore = require("./media-feature-range-operator-space-before")
const mediaQueryListCommaNewlineAfter = require("./media-query-list-comma-newline-after")
const mediaQueryListCommaNewlineBefore = require("./media-query-list-comma-newline-before")
const mediaQueryListCommaSpaceAfter = require("./media-query-list-comma-space-after")
const mediaQueryListCommaSpaceBefore = require("./media-query-list-comma-space-before")
const noBrowserHacks = require("./no-browser-hacks")
const noDescendingSpecificity = require("./no-descending-specificity")
const noDuplicateSelectors = require("./no-duplicate-selectors")
const noEmptySource = require("./no-empty-source")
const noEolWhitespace = require("./no-eol-whitespace")
const noExtraSemicolons = require("./no-extra-semicolons")
const noIndistinguishableColors = require("./no-indistinguishable-colors")
const noInvalidDoubleSlashComments = require("./no-invalid-double-slash-comments")
const noMissingEndOfSourceNewline = require("./no-missing-end-of-source-newline")
const noSupportedBrowserFeatures = require("./no-unsupported-browser-features")
const noUnknownAnimations = require("./no-unknown-animations")
const numberLeadingZero = require("./number-leading-zero")
const numberMaxPrecision = require("./number-max-precision")
const numberNoTrailingZeros = require("./number-no-trailing-zeros")
const propertyBlacklist = require("./property-blacklist")
const propertyCase = require("./property-case")
const propertyNoUnknown = require("./property-no-unknown")
const propertyNoVendorPrefix = require("./property-no-vendor-prefix")
const propertyWhitelist = require("./property-whitelist")
const rootNoStandardProperties = require("./root-no-standard-properties")
const ruleEmptyLineBefore = require("./rule-empty-line-before")
const ruleNestedEmptyLineBefore = require("./rule-nested-empty-line-before")
const ruleNonNestedEmptyLineBefore = require("./rule-non-nested-empty-line-before")
const selectorAttributeBracketsSpaceInside = require("./selector-attribute-brackets-space-inside")
const selectorAttributeOperatorBlacklist = require("./selector-attribute-operator-blacklist")
const selectorAttributeOperatorSpaceAfter = require("./selector-attribute-operator-space-after")
const selectorAttributeOperatorSpaceBefore = require("./selector-attribute-operator-space-before")
const selectorAttributeOperatorWhitelist = require("./selector-attribute-operator-whitelist")
const selectorAttributeQuotes = require("./selector-attribute-quotes")
const selectorClassPattern = require("./selector-class-pattern")
const selectorCombinatorSpaceAfter = require("./selector-combinator-space-after")
const selectorCombinatorSpaceBefore = require("./selector-combinator-space-before")
const selectorDescendantCombinatorNoNonSpace = require("./selector-descendant-combinator-no-non-space")
const selectorIdPattern = require("./selector-id-pattern")
const selectorListCommaNewlineAfter = require("./selector-list-comma-newline-after")
const selectorListCommaNewlineBefore = require("./selector-list-comma-newline-before")
const selectorListCommaSpaceAfter = require("./selector-list-comma-space-after")
const selectorListCommaSpaceBefore = require("./selector-list-comma-space-before")
const selectorMaxCompoundSelectors = require("./selector-max-compound-selectors")
const selectorMaxEmptyLines = require("./selector-max-empty-lines")
const selectorMaxSpecificity = require("./selector-max-specificity")
const selectorNestedPattern = require("./selector-nested-pattern")
const selectorNoAttribute = require("./selector-no-attribute")
const selectorNoCombinator = require("./selector-no-combinator")
const selectorNoEmpty = require("./selector-no-empty")
const selectorNoId = require("./selector-no-id")
const selectorNoQualifyingType = require("./selector-no-qualifying-type")
const selectorNoType = require("./selector-no-type")
const selectorNoUniversal = require("./selector-no-universal")
const selectorNoVendorPrefix = require("./selector-no-vendor-prefix")
const selectorPseudoClassBlacklist = require("./selector-pseudo-class-blacklist")
const selectorPseudoClassCase = require("./selector-pseudo-class-case")
const selectorPseudoClassNoUnknown = require("./selector-pseudo-class-no-unknown")
const selectorPseudoClassParenthesesSpaceInside = require("./selector-pseudo-class-parentheses-space-inside")
const selectorPseudoClassWhitelist = require("./selector-pseudo-class-whitelist")
const selectorPseudoElementCase = require("./selector-pseudo-element-case")
const selectorPseudoElementColonNotation = require("./selector-pseudo-element-colon-notation")
const selectorPseudoElementNoUnknown = require("./selector-pseudo-element-no-unknown")
const selectorRootNoComposition = require("./selector-root-no-composition")
const selectorTypeCase = require("./selector-type-case")
const selectorTypeNoUnknown = require("./selector-type-no-unknown")
const shorthandPropertyNoRedundantValues = require("./shorthand-property-no-redundant-values")
const stringNoNewline = require("./string-no-newline")
const stringQuotes = require("./string-quotes")
const stylelintDisableReason = require("./stylelint-disable-reason")
const timeMinMilliseconds = require("./time-min-milliseconds")
const timeNoImperceptible = require("./time-no-imperceptible")
const unitBlacklist = require("./unit-blacklist")
const unitCase = require("./unit-case")
const unitNoUnknown = require("./unit-no-unknown")
const unitWhitelist = require("./unit-whitelist")
const valueKeywordCase = require("./value-keyword-case")
const valueListCommaNewlineAfter = require("./value-list-comma-newline-after")
const valueListCommaNewlineBefore = require("./value-list-comma-newline-before")
const valueListCommaSpaceAfter = require("./value-list-comma-space-after")
const valueListCommaSpaceBefore = require("./value-list-comma-space-before")
const valueListMaxEmptyLines = require("./value-list-max-empty-lines")
const valueNoVendorPrefix = require("./value-no-vendor-prefix")

module.exports = {
  "at-rule-blacklist": atRuleBlacklist,
  "at-rule-empty-line-before": atRuleEmptyLineBefore,
  "at-rule-name-case": atRuleNameCase,
  "at-rule-name-newline-after": atRuleNameNewlineAfter,
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
  "comment-no-empty": commentNoEmpty,
  "comment-whitespace-inside": commentWhitespaceInside,
  "comment-word-blacklist": commentWordBlacklist,
  "custom-media-pattern": customMediaPattern,
  "custom-property-empty-line-before": customPropertyEmptyLineBefore,
  "custom-property-no-outside-root": customPropertyNoOutsideRoot,
  "custom-property-pattern": customPropertyPattern,
  "declaration-bang-space-after": declarationBangSpaceAfter,
  "declaration-bang-space-before": declarationBangSpaceBefore,
  "declaration-block-no-duplicate-properties": declarationBlockNoDuplicateProperties,
  "declaration-block-no-ignored-properties": declarationBlockNoIgnoredProperties,
  "declaration-block-no-redundant-longhand-properties": declarationBlockNoRedundantLonghandProperties,
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
  "declaration-empty-line-before": declarationEmptyLineBefore,
  "declaration-no-important": declarationNoImportant,
  "declaration-property-unit-blacklist": declarationPropertyUnitBlacklist,
  "declaration-property-unit-whitelist": declarationPropertyUnitWhitelist,
  "declaration-property-value-blacklist": declarationPropertyValueBlacklist,
  "declaration-property-value-whitelist": declarationPropertyValueWhitelist,
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
  "function-url-data-uris": functionUrlDataUris,
  "function-url-no-scheme-relative": functionUrlNoSchemeRelative,
  "function-url-quotes": functionUrlQuotes,
  "function-url-scheme-whitelist": functionUrlSchemeWhitelist,
  "function-whitelist": functionWhitelist,
  "function-whitespace-after": functionWhitespaceAfter,
  "indentation": indentation, // eslint-disable-line object-shorthand
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
  "media-feature-no-missing-punctuation": mediaFeatureNoMissingPunctuation,
  "media-feature-parentheses-space-inside": mediaFeatureParenthesesSpaceInside,
  "media-feature-range-operator-space-after": mediaFeatureRangeOperatorSpaceAfter,
  "media-feature-range-operator-space-before": mediaFeatureRangeOperatorSpaceBefore,
  "media-query-list-comma-newline-after": mediaQueryListCommaNewlineAfter,
  "media-query-list-comma-newline-before": mediaQueryListCommaNewlineBefore,
  "media-query-list-comma-space-after": mediaQueryListCommaSpaceAfter,
  "media-query-list-comma-space-before": mediaQueryListCommaSpaceBefore,
  "no-browser-hacks": noBrowserHacks,
  "no-descending-specificity": noDescendingSpecificity,
  "no-duplicate-selectors": noDuplicateSelectors,
  "no-empty-source": noEmptySource,
  "no-eol-whitespace": noEolWhitespace,
  "no-extra-semicolons": noExtraSemicolons,
  "no-indistinguishable-colors": noIndistinguishableColors,
  "no-invalid-double-slash-comments": noInvalidDoubleSlashComments,
  "no-missing-end-of-source-newline": noMissingEndOfSourceNewline,
  "no-unknown-animations": noUnknownAnimations,
  "no-unsupported-browser-features": noSupportedBrowserFeatures,
  "number-leading-zero": numberLeadingZero,
  "number-max-precision": numberMaxPrecision,
  "number-no-trailing-zeros": numberNoTrailingZeros,
  "property-blacklist": propertyBlacklist,
  "property-case": propertyCase,
  "property-no-unknown": propertyNoUnknown,
  "property-no-vendor-prefix": propertyNoVendorPrefix,
  "property-whitelist": propertyWhitelist,
  "root-no-standard-properties": rootNoStandardProperties,
  "rule-empty-line-before": ruleEmptyLineBefore,
  "rule-nested-empty-line-before": ruleNestedEmptyLineBefore,
  "rule-non-nested-empty-line-before": ruleNonNestedEmptyLineBefore,
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
  "selector-max-compound-selectors": selectorMaxCompoundSelectors,
  "selector-max-empty-lines": selectorMaxEmptyLines,
  "selector-max-specificity": selectorMaxSpecificity,
  "selector-nested-pattern": selectorNestedPattern,
  "selector-no-attribute": selectorNoAttribute,
  "selector-no-empty": selectorNoEmpty,
  "selector-no-combinator": selectorNoCombinator,
  "selector-no-id": selectorNoId,
  "selector-no-qualifying-type": selectorNoQualifyingType,
  "selector-no-type": selectorNoType,
  "selector-no-universal": selectorNoUniversal,
  "selector-no-vendor-prefix": selectorNoVendorPrefix,
  "selector-pseudo-class-blacklist": selectorPseudoClassBlacklist,
  "selector-pseudo-class-case": selectorPseudoClassCase,
  "selector-pseudo-class-no-unknown": selectorPseudoClassNoUnknown,
  "selector-pseudo-class-parentheses-space-inside": selectorPseudoClassParenthesesSpaceInside,
  "selector-pseudo-class-whitelist": selectorPseudoClassWhitelist,
  "selector-pseudo-element-case": selectorPseudoElementCase,
  "selector-pseudo-element-colon-notation": selectorPseudoElementColonNotation,
  "selector-pseudo-element-no-unknown": selectorPseudoElementNoUnknown,
  "selector-root-no-composition": selectorRootNoComposition,
  "selector-type-case": selectorTypeCase,
  "selector-type-no-unknown": selectorTypeNoUnknown,
  "shorthand-property-no-redundant-values": shorthandPropertyNoRedundantValues,
  "string-no-newline": stringNoNewline,
  "string-quotes": stringQuotes,
  "stylelint-disable-reason": stylelintDisableReason,
  "time-min-milliseconds": timeMinMilliseconds,
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
  "value-list-max-empty-lines": valueListMaxEmptyLines,
  "value-no-vendor-prefix": valueNoVendorPrefix,
}
