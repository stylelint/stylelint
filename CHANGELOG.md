# Head

* Added: `rule-no-shorthand-property-overrides` rule.
* Added: `ruleTester` to `stylelint.utils` for use by authors of custom rules.
* Removed: `jsesc` devDependency.

# 0.3.2

* Fixed: `hierarchicalSelectors` bug in `indentation` rule.

# 0.3.1

* Fixed: `~=` is no longer mistaken for combinator in `selector-combinator-space-*`.

# 0.3.0

* Added: exposure of `report`, `ruleMessages`, and `styleSearch` in `stylelint.utils` for use by external plugin rules.
* Added: plugin rule support.
* Added: `hierarchicalSelectors` option to `indentation` rule.
* Added: `nesting-block-opening-brace-space-before` rule.
* Added: `nesting-block-opening-brace-newline-before` rule.
* Fixed: the `color-hex-case` rule message is now consistent with the `color-hex-length` rule.
* Fixed: the `property-blacklist` rule message is now consistent with the `property-whitelist` rule.
* Fixed: a typo in the `comment-space-inside` rule message.

# 0.2.0

* Added: `color-hex-case` rule.
* Added: `color-hex-length` rule.
* Fixed: formalized selector-indentation-checking within the `indentation` rule.
* Fixed: allow for arbitrary whitespace after the newline in the `selector-list-comma-newline-*` rules.
* Fixed: `selector-combinator-space-*` no longer checks `:nth-child()` arguments.

# 0.1.2

* Fixed: nesting support for the `block-opening-brace-newline-before` rule.
* Fixed: nesting support for the `block-opening-brace-space-before` rule.
* Fixed: nesting support for the `rule-trailing-semicolon` rule.

# 0.1.1

* Fixed: nesting support for the `rule-no-duplicate-properties` rule.
* Fixed: nesting support for the `rule-properties-order` rule.
* Fixed: whitespace rules accommodate Windows CR-LF line endings.

# 0.1.0

* Added: ability to disable rules via comments in the CSS.
* Added: `at-rule-empty-line-before` rule.
* Added: `at-rule-no-vendor-prefix` rule.
* Added: `block-closing-brace-newline-after` rule.
* Added: `block-closing-brace-newline-before` rule.
* Added: `block-closing-brace-space-after` rule.
* Added: `block-closing-brace-space-before` rule.
* Added: `block-no-empty` rule.
* Added: `block-opening-brace-newline-after` rule.
* Added: `block-opening-brace-newline-before` rule.
* Added: `block-opening-brace-space-after` rule.
* Added: `block-opening-brace-space-before` rule.
* Added: `color-no-invalid-hex` rule.
* Added: `comment-empty-line-before` rule.
* Added: `comment-space-inside` rule.
* Added: `custom-property-no-outside-root` rule.
* Added: `custom-property-pattern` rule.
* Added: `declaration-bang-space-after` rule.
* Added: `declaration-bang-space-before` rule.
* Added: `declaration-block-semicolon-newline-after` rule.
* Added: `declaration-block-semicolon-newline-before` rule.
* Added: `declaration-block-semicolon-space-after` rule.
* Added: `declaration-block-semicolon-space-before` rule.
* Added: `declaration-colon-space-after` rule.
* Added: `declaration-colon-space-before` rule.
* Added: `declaration-no-important` rule.
* Added: `function-calc-no-unspaced-operator` rule.
* Added: `function-comma-space-after` rule.
* Added: `function-comma-space-before` rule.
* Added: `function-parentheses-space-inside` rule.
* Added: `function-space-after` rule.
* Added: `function-url-quotes` rule.
* Added: `indentation` rule.
* Added: `media-feature-colon-space-after` rule.
* Added: `media-feature-colon-space-before` rule.
* Added: `media-feature-name-no-vendor-prefix` rule.
* Added: `media-feature-range-operator-space-after` rule.
* Added: `media-feature-range-operator-space-before` rule.
* Added: `media-query-list-comma-newline-after` rule.
* Added: `media-query-list-comma-newline-before` rule.
* Added: `media-query-list-comma-space-after` rule.
* Added: `media-query-list-comma-space-before` rule.
* Added: `media-query-parentheses-space-inside` rule.
* Added: `no-eol-whitespace` rule.
* Added: `no-missing-eof-newline` rule.
* Added: `no-multiple-empty-lines` rule.
* Added: `number-leading-zero` rule.
* Added: `number-no-trailing-zeros` rule.
* Added: `number-zero-length-no-unit` rule.
* Added: `property-blacklist` rule.
* Added: `property-no-vendor-prefix` rule.
* Added: `property-whitelist` rule.
* Added: `root-no-standard-properties` rule.
* Added: `rule-nested-empty-line-before` rule.
* Added: `rule-no-duplicate-properties` rule.
* Added: `rule-no-single-line` rule.
* Added: `rule-non-nested-empty-line-before` rule.
* Added: `rule-properties-order` rule.
* Added: `rule-trailing-semicolon` rule.
* Added: `selector-combinator-space-after` rule.
* Added: `selector-combinator-space-before` rule.
* Added: `selector-list-comma-newline-after` rule.
* Added: `selector-list-comma-newline-before` rule.
* Added: `selector-list-comma-space-after` rule.
* Added: `selector-list-comma-space-before` rule.
* Added: `selector-no-attribute` rule.
* Added: `selector-no-combinator` rule.
* Added: `selector-no-id` rule.
* Added: `selector-no-type` rule.
* Added: `selector-no-universal` rule.
* Added: `selector-no-vendor-prefix` rule.
* Added: `selector-pseudo-element-colon-notation` rule.
* Added: `selector-root-no-composition` rule.
* Added: `string-quotes` rule.
* Added: `value-list-comma-newline-after` rule.
* Added: `value-list-comma-newline-before` rule.
* Added: `value-list-comma-space-after` rule.
* Added: `value-list-comma-space-before` rule.
* Added: `value-no-vendor-prefix` rule.
