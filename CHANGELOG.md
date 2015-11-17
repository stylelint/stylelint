# Head

* Changed: renamed the `function-space-after` rule to `function-whitespace-after`.
* Changed: renamed the `comment-space-inside` rule to `comment-whitespace-inside`.
* Changed: `plugins` is now an array instead of an object. And plugins should be created with `stylelint.createPlugin()`.
* Removed: `nesting-block-opening-brace-space-before` and `nesting-block-opening-brace-newline-before` rules.
* Added: cosmiconfig, which means the following:
  * support for YAML `.stylelintrc`
  * support for `stylelint.config.js`
  * support for `stylelint` property in `package.json`
  * alternate config loading system, which stops at the first config found
* Added: asynchronicity to the PostCSS plugin.
* Added: `configFile` option to Node.js API.

# 2.3.1

* Fixed: `selector-no-type` no longer flags the _nesting selector_ (`&`).

# 2.3.0

* Added: `configFile` option to PostCSS plugin.
* Fixed: `function-parentheses-newline-inside` and `function-parentheses-space-inside` bug with nested functions.

# 2.2.0

* Added: `selector-class-pattern` rule.
* Added: `selector-id-pattern` rule.
* Added: `function-parentheses-newline-inside` rule.
* Added: `"always-single-line"` and `"never-single-line"` options to `function-parentheses-space-inside`.
* Fixed: CLI `syntax` argument bug.

# 2.1.0

* Added: `color-no-hex` rule.
* Added: `color-no-named` rule.
* Added: `function-blacklist` rule.
* Added: `function-whitelist` rule.
* Added: `unit-blacklist` rule.
* Added: `unit-whitelist` rule.
* Added: `property-unit-blacklist` rule.
* Added: `property-unit-whitelist` rule.
* Added: `rule-single-line-max-declarations` rule.
* Added: `max-line-length` rule.
* Added: `first-nested` exception to `comment-empty-line-before`.
* Added: single value options to `*-blacklist` & `-*whitelist` rules e.g. `{ "function-blacklist": "calc"}`
* Added: support for flexible groups to `rule-properties-order`.
* Added: support for an optional empty line between each group to `rule-properties-order`.
* Added: support for mathematical signs in front of Sass and Less variables in `function-calc-no-unspaced-operator`.
* Added: support for arbitrary whitespace after function in `function-space-after`.
* Added: support for arbitrary whitespace at the edge of comments in `comment-space-inside`.
* Fixed: `comment-space-inside` allows any number of asterisks at the beginning and end of comments.
* Fixed: bug causing `{ unspecified: "bottom }"` option not to be applied within `rule-properties-order`.
* Fixed: bug causing `function-comma-*` whitespace rules to improperly judge whether to enforce single- or multi-line options.
* Fixed: bug when loading plugins from an extended config
* Fixed: indentation for function arguments, by ignoring them.

# 2.0.0

* Changed: plugins are now included and configured via a "locator", rather than either being `required` or being inserted directly into the configuration object as a function.
* Added: CLI.
* Added: standalone Node API.
* Added: quiet mode to CLI and Node API.
* Added: support for formatters, including custom ones, to CLI and Node API.
* Added: `string` and `json` formatters.
* Added: support for using `.stylelintrc` JSON file.
* Added: support for extending existing configs using the `extends` property.
* Added: support for SCSS syntax parsing to CLI and Node API.
* Added: `function-comma-newline-after` rule.
* Added: `function-comma-newline-before` rule.
* Added: `"always-single-line"` and `"never-single-line"` options to `function-comma-space-after` rule.
* Added: `"always-single-line"` and `"never-single-line"` options to `function-comma-space-before` rule.

# 1.2.1

* Fixed: the `media-query-list-comma-*` rules now only apply to `@media` statements.

# 1.2.0

* Added: `function-linear-gradient-no-nonstandard-direction` rule.
* Added: `rule-properties-order` now by default ignores the order of properties left out of your specified array; and the options `"top"`, `"bottom"`, and `"ignore"` are provided to change that behavior.
* Added: `rule-properties-order` now looks for roots of hyphenated properties in custom arrays so each extension (e.g. `padding-top` as an extension of `padding`) does not need to be specified individually.
* Added: `"always-single-line"` option to `declaration-colon-space-after`.
* Added: support for declarations directly on root (e.g. Sass variable declarations).
* Fixed: `declaration-colon-newline-after` `"always-multi-line"` warning message.

# 1.1.0

* Added: `declaration-colon-newline-after` rule.
* Added: the `indentation` rule now checks indentation of multi-line at-rule params, unless there's the `except` option of `param`.
* Added: support for end-of-line comments in `selector-list-comma-newline-after`.
* Added: protection against `#${sass-interpolation}` in rules checking for hex colors.
* Added: support for strings (translated to RegExps) in `custom-property-pattern` and `custom-media-pattern`.
* Fixed: bug preventing various rules from registering the correct rule names in their warnings, and therefore also preventing them from being disabled with comments.
* Fixed: the `color-no-invalid-hex` rule no longer flags hashes in `url()` arguments.
* Fixed: rules using `node.raw()` instead of `node.raws` to avoid expected errors.

# 1.0.1

* Fixed: `postcss-selector-parser` updated to improve location accuracy for `selector-no-*` rules.

# 1.0.0

* Removed: compatibility with PostCSS `4.x`.
* Added: compatibility with PostCSS `5.0.2+`.
* Fixed: the accuracy of reported line numbers and columns.

# 0.8.0

* Added: `after-comment` `ignore` option to the `at-rule-empty-line-before` rule.
* Fixed: the `indentation` rule now correctly handles `*` hacks on property names.
* Fixed: the `media-feature-colon-space-after` and `media-feature-colon-space-before` rules now only apply to `@media` statements.
* Fixed: the `rule-no-shorthand-property-overrides` rule message is now consistent with the other messages.

# 0.7.0

* Added: invalid options cause the rule to abort instead of performing meaningless checks.
* Added: special warning for missing required options from `validateOptions()`.

# 0.6.2

* Fixed: npm package no longer includes test files (reducing package size by 500KB).

# 0.6.1

* Fixed: the `rule-properties-order` and `rule-no-duplicate-properties` rules now correctly check inside @rules.

# 0.6.0

* Added: `validateOptions` to `stylelint.utils` for use by authors of custom rules.
* Added: `custom-media-pattern` rule.
* Added: `number-max-precision` rule.

# 0.5.0

* Added: validation of all rule options.

# 0.4.1

* Removed: `ruleTester` from `stylelint.utils` because of the additional dependencies it forces.

# 0.4.0

* Removed: `jsesc` devDependency.
* Added: `rule-no-shorthand-property-overrides` rule.
* Added: `ruleTester` to `stylelint.utils` for use by authors of custom rules.

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
