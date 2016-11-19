# 7.6.0

-   Added: option `customSyntax` (for Node API) and `--custom-syntax` (for CLI).
-   Added: `font-family-no-duplicate-names` rule.
-   Fixed: CLI now understands absolute paths for the `--custom-formatter` option.
-   Fixed: the `string` and `verbose` formatters now use `dim` instead of `gray` for greater compatibility with different terminal color schemes.
-   Fixed: `media-feature-parentheses-space-inside` handles comments within the parentheses.
-   Fixed: `selector-no-qualifying-type` now ignores SCSS `%placeholders`.

# 7.5.0

-   Added: `selector-no-empty` rule.
-   Fixed: if no config is found relative to the stylesheet, look for one relative to `process.cwd()`.
-   Fixed: lookup `ignoreFiles` globs relative to `process.cwd()` if config is directly passed as a JS object and no `configBasedir` is provided.
-   Fixed: SugarSS no longer reports wrong column number in `block-no-empty`.
-   Fixed: `configOverrides` work with `plugins`, `extends`, and `processors`.
-   Fixed: a bug causing inaccuracy in nested `stylelint-disable` and `stylelint-enable` comments.
-   Fixed: false positives for some camel-case SVG keywords in `value-keyword-case`.
-   Fixed: false positives for SCSS interpolation in `function-calc-no-unspaced-operator`.
-   Fixed: `no-descending-specificity` now ignores custom property sets.

# 7.4.2

-   Fixed: regression where using `null` to turn off a rule caused errors.

# 7.4.1

-   Fixed: regression where using `null` for rules that take an array for their primary option would trigger a validation warning.

# 7.4.0

-   Added: each stylesheet looks up configuration from its own path. Different files can now use different configurations during the same linting process.
-   Added: relative path extends, plugins, and processors try to load from `process.cwd()` if they aren't found relative to the invoking configuration.
-   Added: `/* stylelint-disable-next-line */` comments.
-   Added: `media-feature-name-blacklist` rule.
-   Added: `media-feature-name-whitelist` rule.
-   Added: `ignore: ["after-declaration"]` option to `declaration-empty-line-before`.
-   Added: `except: ["empty"]` option to `function-url-quotes`.
-   Fixed: `function-linear-gradient-no-nonstandard-direction` no longer warns when vendor-prefixed linear-gradient properties are used correctly.
-   Fixed: `no-extra-semicolons` now ignores the semicolon that comes after the closing brace of a custom property set.
-   Fixed: `no-unknown-animations` no longer delivers false positives when there are multiple animation names.
-   Fixed: `number-*` rules now ignore numbers in comments and strings.
-   Fixed: `value-keyword-case` now ignores system color keywords.

# 7.3.1

-   Fixed: regression in 7.3.0 which caused a "Cannot read property 'length' of undefined" error on a certain selector.

# 7.3.0

-   Added: `processors` can accept options objects.
-   Added: `ignore: ["inside-function"]` option to `color-named`.
-   Fixed: `--ignore-path` and `--report-needless-disables` no longer fails when used together.
-   Fixed: `block-closing-brace-newline-after` and `block-closing-brace-space-after` now allow a trailing semicolon after the closing brace of a block.
-   Fixed: `block-no-single-line` now ignores empty blocks.
-   Fixed: `declaration-block-no-ignored-properties` now uses the value of the last occurrence of a triggering property.
-   Fixed: `indentation` now correctly handles `_` hacks on property names.
-   Fixed: `property-no-unknown` now ignores SCSS nested properties.

# 7.2.0

-   Added: `--report-needless-disables` and `reportNeedlessDisables` option.
-   Added: `--ignore-disables` and `ignoreDisables` option.
-   Added: `--config-basedir` option to CLI.
-   Added: `declaration-block-no-redundant-longhand-properties` rule.
-   Added: `function-url-scheme-whitelist` rule.
-   Added: `media-feature-name-no-unknown` rule.
-   Added: `selector-descendant-combinator-no-non-space` rule.
-   Added: `value-list-max-empty-lines` rule.
-   Added: `ignoreProperties` option to `color-named`.
-   Added: `ignore: ["consecutive-duplicates-with-different-values"]` option to `declaration-block-no-duplicate-properties`.
-   Added: `ignore: ["comments"]` option to `max-line-length`.
-   Added: `ignoreAtRules` option to `max-nesting-depth`.
-   Added: `ignoreProperties` option to `unit-blacklist` and `unit-whitelist`
-   Fixed: no longer parsing ignored files before ignoring them.
-   Fixed: `configFile` and `configBasedir` can now be used together.
-   Fixed: `max-line-length` now correctly handles Windows line endings.
-   Fixed: `no-descending-specificity` treats selectors with pseudo-elements as distinct from their counterparts without pseudo-classes, because they actually target different elements.
-   Fixed: `no-unknown-animations` and `unit-blacklist` now handle numbers without leading zeros.
-   Fixed: `root-no-standard-properties` now handles custom property sets.
-   Fixed: `selector-no-type` `ignore: ["descendant"]` option now correctly handles descendants within a selector list.
-   Fixed: `selector-pseudo-class-no-unknown` now understands the Shadow DOM selectors of `host` and `host-context`.
-   Fixed: `selector-pseudo-element-no-unknown` now understands the Shadow DOM selector of `slotted`.

# 7.1.0

-   Added: `block-closing-brace-empty-line-before` rule.
-   Added: `comment-no-empty` rule.
-   Added: `custom-property-empty-line-before` rule.
-   Added: `declaration-empty-line-before` rule.
-   Added: `media-feature-name-case` rule.
-   Added: `selector-nested-pattern` rule.
-   Added: `selector-pseudo-class-blacklist` rule.
-   Added: `selector-pseudo-class-whitelist` rule.
-   Added: regex support to the `ignore*` secondary options of the `*-no-unknown` rules.
-   Added: `ignore: ["blockless-after-same-name-blockless"]` option to `at-rule-empty-line-before`.
-   Added: `except: ["blockless-after-same-name-blockless"]` option to `at-rule-empty-line-before`.
-   Added: `ignore: ["empty-lines"]` option to `no-eol-whitespace`.
-   Added: `ignoreTypes` option to `selector-no-type` to whitelist allowed types for selectors.
-   Fixed: `color-named` now ignores declarations that accept *custom idents*.
-   Fixed: `font-family-name-quotes` correctly handles numerical font weights for the `font` shorthand property.
-   Fixed: `indentation` now correctly handles Windows line endings within parentheticals.
-   Fixed: `media-feature-no-missing-punctuation` now ignores media features containing complex values e.g. `(min-width: ($var -    20px))` and `(min-width: calc(100% -    20px))`.
-   Fixed: `no-descending-specificity` message to correctly show which selector should come first.
-   Fixed: `selector-combinator-space-after` and `selector-combinator-space-before` now ignore operators within parenthetical non-standard constructs.

# 7.0.3

-   Fixed: bug causing rules in extended configs to be merged with, rather than replaced by, the extending config.
-   Fixed: `selector-class-pattern` now ignores fractional keyframes selectors.
-   Fixed: `selector-max-specificity` now ignores selectors containing the `matches()` pseudo-class, and warns if the underlying `specificity` module cannot parse the selector.
-   Fixed: `selector-no-type` with secondary option `ignore: ["descendant"]` will now resolve nested selectors.

# 7.0.2

-   Fixed: `at-rule-blacklist`, `at-rule-whitelist`, `comment-word-blacklist`, `selector-attribute-operator-blacklist`, `selector-attribute-operator-whitelist` now accept array as first option.
-   Fixed: `unit-*` rules now ignore CSS hacks.

# 7.0.1

-   Fixed: missing `known-css-properties` dependency.

# 7.0.0

-   Removed: `--extract` and `extractSyleTagsFromHtml` options. Instead, [build](/docs/developer-guide/processors.md) and [use](/docs/user-guide/configuration.md#processors) processors. See the [release planning](/docs/user-guide/release-planning.md) document for more details.
-   Removed: support for plugin rule names that aren't namespaced, i.e. only `your-namespace/your-rule-name` rule names are supported. (If your plugin provides only a single rule or you can't think of a good namespace, you can simply use `plugin/my-rule`.)
-   Removed: `--verbose` CLI flag. Use `--formatter verbose` instead.
-   Removed: NodeJS `0.12.x` support. `4.2.1 LTS` or greater is now required.
-   Removed: `media-query-parentheses-space-inside` rule. Use the new `media-feature-parentheses-space-inside` rule instead.
-   Removed: `no-missing-eof-newline` rule. Use the new rule `no-missing-end-of-source-newline` instead.
-   Removed: `number-zero-length-no-unit` rule. Use the `length-zero-no-unit` rule instead.
-   Removed: `property-unit-blacklist` rule. Use the `declaration-property-unit-blacklist` rule instead.
-   Removed: `property-unit-whitelist` rule. Use the `declaration-property-unit-whitelist` rule instead.
-   Removed: `property-value-blacklist` rule. Use the `declaration-property-value-blacklist` rule instead.
-   Removed: `property-value-whitelist` rule. Use the `declaration-property-value-whitelist` rule instead.
-   Removed: `"emptyLineBefore"` option for `declaration-block-properties-order`. If you use this option, please consider creating a plugin for the community. See the [release planning](/docs/user-guide/release-planning.md) document for more details.
-   Removed: `"single-where-required"`, `"single-where-recommended"`, `"single-unless-keyword"`, `"double-where-required"`, `"double-where-recommended"` and `"double-unless-keyword"` options for `font-family-name-quotes`. Instead, use the `"always-unless-keyword"`, `always-where-recommended` or `always-where-required` options together with the `string-quotes` rule.
-   Removed: `"single"`, `"double"` and `"none"` options for `function-url-quotes`. Instead, use the `"always"` or `"never"` options together with the `string-quotes` rule.
-   Removed: `"hierarchicalSelectors"` option for `indentation`.  If you use this option, please consider creating a plugin for the community. See the [release planning](/docs/user-guide/release-planning.md) document for more details.
-   Removed: `stylelint.utils.cssWordIsVariable()`.
-   Removed: `stylelint.utils.styleSearch()`. Use the external [style-search](https://github.com/davidtheclark/style-search) module instead.
-   Changed: invalid configuration sets result's `stylelintError` to `true`, which in turn causes CLI to exit with a non-zero code.
-   Changed: non-standard syntaxes are automatically inferred from file extensions `.scss`, `.less`, and `.sss`.
-   Changed: `.stylelintignore` now uses `.gitignore` syntax, and stylelint looks for it in `process.cwd()`.
-   Changed: files matching ignore patterns no longer receive an "info"-severity message, which was always printed by the string formatter. Instead, the file's stylelint result object receives an `ignored: true` property, which various formatters can use as needed. The standard `string` formatter prints nothing for ignored files; but when the `verbose` formatter is used, ignored files are included in the filelist.
-   Changed: plugin arrays in extended configs are now concatenated with the main config's plugin array, instead of being overwritten by it. So plugins from the main config and from extended configs will all be loaded.
-   Changed: `-v` flag to display version number.
-   Changed: `comment-word-blacklist` no longer ignores words within copyright comments.
-   Changed: `comment-word-blacklist` will now identify strings within comments, rather than just at the beginning of, when the string option is used.
-   Changed: `declaration-block-no-ignored-properties` now detects use of `min-width` and `max-width` with `inline`, `table-row`, `table-row-group`, `table-column` and `table-column-group` elements.
-   Changed: `declaration-block-no-ignored-properties` now detects use of `overflow`, `overflow-x` and `overflow-y` with `inline` elements.
-   Changed: `declaration-block-no-ignored-properties` now ignores the combination of `float` and `display: inline-block | inline`.
-   Changed: `font-family-name-quotes` now checks the `font` property in addition to the `font-family` property.
-   Changed: `font-family-name-quotes` treats `-apple-*` and `BlinkMacSystemFont` system fonts as keywords that should never be wrapped in quotes.
-   Changed: `indentation` now checks inside of parentheses by default. If you use the `indentInsideParens: "once"` secondary option, simply remove it from your config. If you do not want to check inside of parentheses, use the new `ignore: ["inside-parens"]` secondary option. The `indentInsideParens: "twice"` and `indentInsideParens: "once-at-root-twice-in-block"` secondary options are unchanged.
-   Changed: `keyframe-declaration-no-important` now checks vendor prefixed `@keyframes` at-rules.
-   Changed: `selector-attribute-quotes` now checks attribute selectors with whitespace around the operator or inside the brackets.
-   Changed: `time-no-imperceptible` now checks vendor prefixed properties.
-   Changed: `unit-*` rules now check `@media` values too.
-   Added: plugins can allow primary option arrays by setting `ruleFunction.primaryOptionArray = true`.
-   Added: [processors](/docs/user-guide/configuration.md#processors).
-   Added: `media-feature-parentheses-space-inside` rule.
-   Added: `no-missing-end-of-source-newline` rule.
-   Added: `property-no-unknown` rule.
-   Fixed: Better handling quotes in selector attribute with multiple attributes.
-   Fixed: `no-unknown-animations` now classifies vendor prefixed `@keyframes` at-rules as known.

# 6.9.0

-   Added: `defaultSeverity` configuration option.
-   Added: invoking the CLI with no arguments and no stdin (i.e. just `stylelint`) is equivalent to `stylelint --help`.
-   Added: `function-url-no-scheme-relative` rule.
-   Added: `selector-attribute-quotes` rule.
-   Fixed: the CLI now uses `process.exitCode` with `stdOut` to allow the process to exit naturally and avoid truncating output.
-   Fixed: `function-calc-no-unspaced-operator` correctly interprets negative fractional numbers without leading zeros and those wrapped in parentheses.
-   Fixed: `no-extra-semicolons` now ignores semicolons after Less mixins.
-   Fixed: `number-max-precision` now ignores uppercase and mixed case `@import` at-rules.
-   Fixed: `selector-max-specificity` no longer crashes on selectors containing `:not()` pseudo-classes.
-   Fixed: `time-no-imperceptible` correctly handles negative time.

# 6.8.0

-   Deprecated: `-e` and `--extract` CLI flags, and the `extractStyleTagsFromHtml` node API option. If you use these flags or option, please consider creating a processor for the community. See the [release planning](/docs/user-guide/release-planning.md) document for more details.
-   Added: `at-rule-no-unknown` rule.
-   Added: `no-empty-source` rule.
-   Added: `except: ["after-single-line-comment"]` option for `rule-non-nested-empty-line-before`.
-   Added: `ignoreProperties: []` option for `declaration-block-no-duplicate-properties`.
-   Fixed: accuracy of warning positions for empty blocks when using SugarSS parser.

# 6.7.1

-   Fixed: `block-*-brace-*-before` CRLF (`\r\n`) warning positioning.
-   Fixed: `no-descending-specificity` now does comparison of specificity using ints, rather than strings.
-   Fixed: `selector-no-type` and `selector-type-case` now ignore non-standard keyframe selectors (e.g. within an SCSS mixin).
-   Fixed: `selector-type-no-unknown` no longer reports fractional keyframe selectors.

# 6.7.0

-   Added: `ignoreFunctions: []` option for `function-name-case`.
-   Fixed: rules using `findFontFamily` util correctly interpret `<font-size>/<line-height>` values with unitless line-heights.
-   Fixed: `indentation` better understands nested parentheticals that aren't just Sass maps and lists.
-   Fixed: `no-unsupported-browser-features` message now clearly states that only *fully* supported features are allowed.
-   Fixed: `selector-max-specificity` no longer reports that a selector with 11 elements or more has a higher specificity than a selector with a single classname.
-   Fixed: `selector-type-no-unknown` no longer warns for complex keyframe selectors.

# 6.6.0

-   Deprecated: `number-zero-length-no-unit`. Use `length-zero-no-unit` instead.
-   Deprecated: `property-*-blacklist` and `property-*-whitelist`. Use `declaration-property-*-blacklist` and `declaration-property-*-whitelist` instead.
-   Deprecated: `-v` and `--verbose` CLI flags. Use `-f verbose` or `--formatter verbose` instead.
-   Deprecated: `stylelint.util.styleSearch()`. Use the external module [style-search](https://github.com/davidtheclark/style-search) instead.
-   Added: option `ignorePath` (for JS) and `--ignore-path` (for CLI).
-   Added: `-h` alias for `--help` CLI flag.
-   Added: `at-rule-blacklist` rule.
-   Added: `at-rule-name-newline-after` rule.
-   Added: `at-rule-whitelist` rule.
-   Added: `ignore: "blockless-group"` option for `at-rule-empty-line-before`.
-   Added: `ignoreAtRules: []` option for `at-rule-empty-line-before`.
-   Added: `function-blacklist` now accepts regular expressions.
-   Added: `function-whitelist` now accepts regular expressions.
-   Fixed: crash when tty columns is reported as zero, which happened when running stylelint on Travis CI in OSX.
-   Fixed: selector-targeting rules ignore Less mixins and extends.
-   Fixed: `at-rule-name-newline-after` now correctly accepts one *or more* newlines.
-   Fixed: `declaration-block-semicolon-newline-before` now correctly accepts one *or more* newlines.
-   Fixed: `function-url-quotes` ignores values containing `$sass` and `@less` variables.
-   Fixed: `function-whitespace-after` ignores `postcss-simple-vars`-style interpolation.
-   Fixed: `indentation` better understands nested parentheticals, like nested Sass maps.
-   Fixed: `no-extra-semicolons` reports errors on the correct line.
-   Fixed: `selector-combinator-space-*` rules now ignore escaped combinator-like characters.
-   Fixed: `selector-type-no-unknown` ignores non-standard usage of percentage keyframe selectors (e.g. within an SCSS mixin).
-   Fixed: `value-keyword-case` now ignores custom idents of properties `animation`, `font`, `list-style`.

# 6.5.1

-   Deprecated: `"emptyLineBefore"` option for `declaration-block-properties-order`. If you use this option, please consider creating a plugin for the community. See the [release planning](/docs/user-guide/release-planning.md) document for more details.
-   Deprecated: `"single-where-required"`, `"single-where-recommended"`, `"single-unless-keyword"`, `"double-where-required"`, `"double-where-recommended"` and `"double-unless-keyword"` options for `font-family-name-quotes`. Instead, use the `"always-unless-keyword"`, `always-where-recommended` or `always-where-required` options together with the `string-quotes` rule.
-   Deprecated: `"single"`, `"double"` and `"none"` options for `function-url-quotes`. Instead, use the `"always"` or `"never"` options together with the `string-quotes` rule.
-   Deprecated: `"hierarchicalSelectors"` option for `indentation`.  If you use this option, please consider creating a plugin for the community. See the [release planning](/docs/user-guide/release-planning.md) document for more details.
-   Fixed: the string formatter no longer errors on non-rule errors.
-   Fixed: `selector-list-comma-*` rules now ignore Less mixins.
-   Fixed: `selector-max-compound-selectors` no longer errors on Less mixins.
-   Fixed: `selector-type-no-unknown` now ignores all *An+B notation* and linguistic pseudo-classes.
-   Fixed: `selector-type-no-unknown` now ignores obsolete HTML tags and `<hgroup>`.

# 6.5.0

-   Added: `selector-max-compound-selectors` rule.
-   Fixed: `babel-polyfill` removed so it doesn't clash with other processes using `babel-polyfill`.
-   Fixed: `selector-type-case` and `selector-type-no-unknown` rules now ignore SCSS placeholder selectors.

# 6.4.2

-   Fixed: `selector-pseudo-class-case`, `selector-pseudo-class-no-unknown`, `selector-pseudo-element-case`, `selector-pseudo-element-no-unknown` rules now ignore SCSS variable interpolation.
-   Fixed: `selector-type-no-unknown` now ignores nested selectors and keyframe selectors.

# 6.4.1

-   Fixed: `shorthand-property-no-redundant-values` now ignores `background`, `font`, `border`, `border-top`, `border-bottom`, `border-left`, `border-right`, `list-style`, `transition` properties.
-   Fixed: `unit-no-unknown` now ignores hex colors.

# 6.4.0

-   Added: `keyframe-declaration-no-important` rule.
-   Added: `selector-attribute-operator-blacklist` rule.
-   Added: `selector-attribute-operator-whitelist` rule.
-   Added: `selector-pseudo-class-no-unknown` rule.
-   Added: `selector-type-no-unknown` rule.
-   Fixed: string formatter no longer errors on multi-byte `message`.
-   Fixed: catch errors thrown by `postcss-selector-parser` and register them as PostCSS warnings, providing a better UX for editor plugins.
-   Fixed: some rules now better handle case insensitive CSS identifiers.
-   Fixed: `font-family-name-quotes`, `media-feature-no-missing-punctuation`, `media-query-list-comma-newline-after`, `media-query-list-comma-newline-before`, `media-query-list-comma-space-after` and `media-query-list-comma-space-before` rules now better ignore SCSS, Less variables and nonstandard at-rules.
-   Fixed: `no-unknown-animations` now ignores `ease` value.
-   Fixed: `unit-blacklist`, `unit-case`, `unit-no-unknown`, `unit-whitelist` now better accounts interpolation.
-   Fixed: `unit-no-unknown` no longer breaks Node 0.12 (because we've included the Babel polyfill).
-   Fixed: `value-keyword-case` now ignores custom idents of properties `animation-name`, `counter-increment`, `font-family`, `grid-row`, `grid-column`, `grid-area`, `list-style-type`.
-   Fixed: wrong example for `always-multi-line` in rule `block-opening-brace-newline-before` documentation.

# 6.3.3

-   Fixed: `block-closing-brace-newline-before` no longer delivers false positives for extra semicolon.
-   Fixed: `declaration-block-no-ignored-properties` now detects use of `vertical-align` with block-level elements.
-   Fixed: `font-family-name-quotes` is now case insensitive when hunting for font-family properties.
-   Fixed: `number-zero-length-no-unit` now ignores `deg`, `grad`, `turn` and `rad` units.
-   Fixed: `selector-no-type` does a better job when ignoring descendant and compound selectors.

# 6.3.2

-   Fixed: `shorthand-property-no-redundant-values` now handles uppercase values properly.

# 6.3.1

-   Fixed: `declaration-block-no-ignored-properties` now longer crashes on nested rules.

# 6.3.0

-   Deprecated: support for plugin rule names that aren't namespaced i.e. only `your-namespace/your-rule-name` rule names are supported. If your plugin provides only a single rule or you can't think of a good namespace, you can simply use `plugin/my-rule`).
-   Added: support for plugins that provides an array of rules.
-   Added: support for extracting and linting CSS from within HTML sources.
-   Added: `--stdin-filename` option to CLI.
-   Added: `at-rule-name-space-after` rule.
-   Added: `no-extra-semicolons` rule.
-   Added: `selector-attribute-operator-space-after` rule.
-   Added: `selector-attribute-operator-space-before` rule.
-   Added: `selector-max-empty-lines` rule.
-   Added: `selector-pseudo-element-no-unknown` rule.
-   Added: flexible support for end-of-line comments in `at-rule-semicolon-newline-after`, `block-opening-brace-newline-after`, and `declaration-block-semicolon-newline-after`.
-   Fixed: string and verbose formatters no longer use an ambiguous colour schemes.
-   Fixed: string formatter no longer outputs an empty line if there are no problems.
-   Fixed: all rules now handle case insensitive CSS identifiers.
-   Fixed: `function-comma-newline-after` now allows end-of-line comments.
-   Fixed: `function-url-quotes` now ignores spaces within `url()`.
-   Fixed: `no-descending-specificity` now ignores trailing colons within selectors.
-   Fixed: `no-indistinguishable-colors` now ignores keyword color names within `url()`.
-   Fixed: `number-max-precision` now ignores `@import` at-rules and `url()` functions.
-   Fixed: `selector-class-pattern` and `selector-id-pattern` rules now ignore SCSS variable interpolation.
-   Fixed: `value-list-comma-*` rules now ignore SCSS maps.

# 6.2.2

-   Deprecated: `stylelint.utils.cssWordIsVariable()` as non-standard syntax utils are now defensive.
-   Fixed: `declaration-colon-*` rules now ignore SCSS lists.
-   Fixed: `font-weight-notation` now ignores SCSS interpolation.
-   Fixed: `rule-nested-empty-line-before` now ignores Less blockless rules (mixin and extend calls).

# 6.2.1

-   Fixed: more problems with exposed `stylelint.createRuleTester`.

# 6.2.0

-   Added: `selector-no-qualifying-type` rule.
-   Fixed: `number-leading-zero` will not check `@import` at-rules.
-   Fixed: `selector-class-pattern` now ignores non-ouputting Less mixin definitions and called Less mixins.
-   Fixed: `value-keyword-case` now accounts for camelCase keywords (e.g. `optimizeSpeed`, `optimizeLegibility` and `geometricPrecision`) when the `lower` option is used.
-   Fixed: `testUtils` and `stylelint.createRuleTester` module mistakes.

# 6.1.1

-   Fixed: documentation links to `selector-pseudo-class-parentheses-space-inside` and `selector-attribute-brackets-space-inside`.

# 6.1.0

-   Added: support for `.stylelintignore` file.
-   Added: warning message in output when a file is ignored.
-   Added: `comment-word-blacklist` rule.
-   Added: `selector-attribute-brackets-space-inside` rule.
-   Added: `selector-pseudo-class-parentheses-space-inside` rule.
-   Added: `shorthand-property-no-redundant-values` rule.
-   Added: `ignoreKeywords` option for `value-keyword-case`.
-   Fixed: CRLF (`\r\n`) warning positioning in `string-no-newline`.
-   Fixed: parsing problems when using `///`-SassDoc-style comments.
-   Fixed: `max-empty-lines` places warning at the end of the violating newlines to avoid positioning confusions.

# 6.0.3

-   Fixed: CRLF (`\r\n`) warning positioning in `max-empty-lines` and `function-max-empty-lines`.

# 6.0.2

-   Fixed: `CssSyntaxError` sets `errored` on output to `true`.

# 6.0.1

-   Fixed: `function-name-case` now accounts for camelCase function names (e.g. `translateX`, `scaleX` etc) when the `lower` option is used.

# 6.0.0

-   Changed: `CssSyntaxError` is no longer thrown but reported alongside warnings.
-   Added: new look for standard formatter and support for arbitrary severity names.
-   Added: exposed `stylelint.utils.cssWordIsVariable()`.
-   Added: `at-rule-name-case` rule.
-   Added: `function-name-case` rule.
-   Added: `property-case` rule.
-   Added: `selector-pseudo-class-case` rule.
-   Added: `selector-pseudo-element-case` rule.
-   Added: `unit-case` rule.
-   Added: `value-keyword-case` rule.
-   Added: `indentClosingBrace` option to `indentation`.
-   Added: `indentInsideParens` option to `indentation`.
-   Added: `consecutive-duplicates` option for `declaration-block-no-duplicate-properties` rule.
-   Fixed: `block-no-empty` no longer delivers false positives for less syntax.
-   Fixed: `declaration-block-trailing-semicolon` better understands nested at-rules.
-   Fixed: `number-zero-length-no-unit` now work with `q` unit and ignores `s`, `ms`, `kHz`, `Hz`, `dpcm`, `dppx`, `dpi` units

# 5.4.0

-   Added: `unit-no-unknown` rule.
-   Fixed: `no-descending-specificity` no longer gets confused when the last part of a selector is a compound selector.
-   Fixed: regression causing `indentation` to complain about Sass maps.
-   Fixed: `declaration-block-no-ignored-properties` now ignore `clear` for `position: absolute` and `position: relative` and does not ignore `float` on `display: table-*`.

# 5.3.0

-   Added: (experimental) support for [Less](http://lesscss.org/) syntax.
-   Added: support for [SugarSS](https://github.com/postcss/sugarss) syntax.
-   Added: exposed `stylelint.createRuleTester()`.
-   Added: `declaration-block-no-ignored-properties` rule.
-   Added: `function-max-empty-lines` rule.
-   Added: `function-url-data-uris` rule.
-   Fixed: `block-closing-brace-newline-after` accepts single-line comments immediately after the closing brace.
-   Fixed: `block-closing-brace-newline-after` use of "single space", rather than "newline", in its messages.
-   Fixed: `font-weight-notation` now ignores `initial` value.
-   Fixed: `function-*` rules should all now ignore all Sass maps and lists.
-   Fixed: `function-calc-no-unspaced-operator` accepts newlines.
-   Fixed: `function-comma-space-after`, `function-comma-space-before`, `function-parentheses-newline-inside` and `function-parentheses-space-inside` now ignore SCSS maps.
-   Fixed: `max-line-length` options validation.
-   Fixed: `no-unknown-animations` now ignores `none`, `initial`, `inherit`, `unset` values.
-   Fixed: `property-value-blacklist` and `-whitelist` no longer error on properties without a corresponding list entry.
-   Fixed: `selector-class-pattern` now ignores selectors with Sass interpolation.
-   Fixed: `selector-id-pattern` now ignores selectors with Sass interpolation.
-   Fixed: `selector-no-id` now ignores keyframe selectors.
-   Fixed: `unit-blacklist` and `unit-whitelist` now ignores `url` functions.

# 5.2.1

-   Fixed: `function-calc-no-unspaced-operator` now better ignores non-`calc` functions.
-   Fixed: `no-descending-specificity` no longer delivers false positives after second run in Atom linter.
-   Fixed: `stylelint-disable-rule` imported correctly.

# 5.2.0

-   Added: `at-rule-semicolon-newline-after` rule.
-   Added: `no-indistinguishable-colors` rule.
-   Added: `stylelint-disable-reason` rule.
-   Fixed: `declaration-bang-space-*` understands arbitrary bang declarations (e.g. `!default`).
-   Fixed: `font-weight-notation` now ignore `inherit` value.
-   Fixed: `indentation` treats `@nest` at-rules like regular rules with selectors.
-   Fixed: `no-duplicate-selectors` contextualizes selectors by all at-rules, not just media queries.
-   Fixed: `no-duplicate-selectors` no longer delivers false positives after second run in Atom linter.
-   Fixed: `no-duplicate-selectors` no longer delivers false positives with descendant combinators.
-   Fixed: `number-no-trailing-zeros` no longer delivers false positives in `url()` arguments.
-   Fixed: `root-no-standard-properties` no longer delivers false positives inside the `:not()` pseudo-selector.
-   Fixed: `selector-list-comma-*` rules no longer deliver false positives inside functional notation.

# 5.1.0

-   Added: `selector-type-case` rule.
-   Fixed: no more subtle configuration bug when using extends and plugins together in tangled ways.

# 5.0.1

-   Fixed: `string-no-newline` no longer stumbles when there are comment-starting characters inside strings.

# 5.0.0

-   Removed: `no-indistinguishable-colors` because its dependencies were unusable in Atom. (To be re-evaluated and re-added later.)
-   Removed: `"warn": true` secondary option. Use `"severity": "warning"`, instead.
-   Removed: `color-no-named` rule. Use the new `color-named` rule, with the `"never"` option instead.
-   Removed: `declaration-block-no-single-line` rule. Use the new `block-no-single-line` rule instead.
-   Removed: `rule-no-duplicate-properties` rule. Use the new `declaration-block-no-duplicate-properties` rule instead.
-   Removed: `rule-no-shorthand-property-overrides` rule. Use the new `declaration-block-no-shorthand-property-overrides` rule instead.
-   Removed: `rule-properties-order` rule. Use the new `declaration-block-properties-order` rule instead.
-   Removed: `rule-trailing-semicolon` rule. Use the new `declaration-block-trailing-semicolon` rule instead.
-   Removed `true` option for `emptyLineBefore` when using property groups in `rule-properties-order`. Use the new `"always"` or `"never"` option instead.
-   Removed: `"always"` option for `font-weight-notation`. Use the new `always-where-possible` option instead.
-   Added: support for overlapping `stylelint-disable` commands.
-   Fixed: `max-nesting-depth` does not warn about blockless at-rules.
-   Fixed: `function-comma-newline-after` and related rules consider input to be multi-line (applying to "always-multi-line", etc.) when the newlines are at the beginning or end of the input.
-   Fixed: `no-indistinguishable-colors` no longer errors on color functions containing spaces e.g. `rgb(0, 0, 0)` --   but also removed the rule (see above).
-   Fixed: `declaration-block-properties-order` no longer fails when an unspecified property comes before or after a specified property in a group with `emptyLineBefore: true`.
-   Fixed: `indentation` no longer has false positives when there are empty lines within multi-line values.
-   Fixed: `declaration-colon-*-after` no longer fail to do their job when you want a space or newline after the colon and instead there is no space at all.

# 4.5.1

-   Fixed: `no-unsupported-browser-features` options now optional.
-   Fixed: `no-duplicate-selectors` now ignores keyframe selectors.

# 4.5.0

-   Deprecated: `"warn": true` secondary option. Use `"severity": "warning"`, instead.
-   Deprecated: `color-no-named` rule. Use the new `color-named` rule, with the `"never"` option instead.
-   Deprecated: `declaration-block-no-single-line` rule. Use the new `block-no-single-line` rule instead.
-   Deprecated: `rule-no-duplicate-properties` rule. Use the new `declaration-block-no-duplicate-properties` rule instead.
-   Deprecated: `rule-no-shorthand-property-overrides` rule. Use the new `declaration-block-no-shorthand-property-overrides` rule instead.
-   Deprecated: `rule-properties-order` rule. Use the new `declaration-block-properties-order` rule instead.
-   Deprecated: `rule-trailing-semicolon` rule. Use the new `declaration-block-trailing-semicolon` rule instead.
-   Deprecated `true` option for `emptyLineBefore` when using property groups in `rule-properties-order`. Use the new `"always"` or `"never"` option instead.
-   Deprecated: `"always"` option for `font-weight-notation`. Use the new `always-where-possible` option instead.
-   Added: universal `severity` secondary option as a replacement for `"warn": true` to alter a rule's severity.
-   Added: `block-no-single-line` rule.
-   Added: `color-named` rule.
-   Added: `declaration-block-no-duplicate-properties` rule.
-   Added: `declaration-block-no-shorthand-property-overrides` rule.
-   Added: `declaration-block-properties-order` rule.
-   Added: `declaration-block-trailing-semicolon` rule.
-   Added: `max-nesting-depth` rule.
-   Added: `no-browser-hacks` rule.
-   Added: `no-descending-specificity` rule.
-   Added: `no-indistinguishable-colors` rule.
-   Added: `no-unsupported-browser-features` rule.
-   Added: `selector-max-specificity` rule.
-   Added: `string-no-newline` rule.
-   Added: `"always"` and `"never"` option to `rule-properties-order` `emptyLineBefore` when using property groups
-   Added: `named-where-possible` option to `font-weight-notation`.
-   Added: `unspecified: "bottomAlphabetical"` option to the `rule-properties-order` rule.
-   Added: `ignoreAtRules: []` option to the `block-opening-brace-space-before` and `block-closing-brace-newline-after` rules.
-   Added: support for using the nesting selector (`&`) as a prefix in `selector-no-type`.
-   Added: `stylelint-disable-line` feature.
-   Added: `withinComments`, `withinStrings`, and `checkStrings` options to `styleSearch`, and `insideString` property to the `styleSearch` match object.
-   Added: `resolveNestedSelectors` option to the `selector-class-pattern` rule.
-   Fixed: informative errors are thrown when `stylelint-disable` is misused.
-   Fixed: `selector-no-vendor-prefix` no longer delivers two warnings on vendor-prefixed pseudo-elements with two colons, e.g. `::-moz-placeholder`.
-   Fixed: `no-duplicate-selectors` rule now resolves nested selectors.
-   Fixed: `font-weight-notation` does not throw false warnings when `normal` is used in certain ways.
-   Fixed: `selector-no-*` and `selector-*-pattern` rules now ignore custom property sets.
-   Fixed: nested selector handling for `no-duplicate-selectors`.
-   Fixed: `selector-no-id` does not warn about Sass interpolation inside an `:nth-child()` argument.
-   Fixed: handling of mixed line endings in `rule-nested-empty-line-before`, `rule-non-nested-empty-line-before`, `comment-empty-line-before` and `at-rule-empty-line-before`.
-   Fixed: `number-leading-zero`, `function-comma-space-*`, and `declaration-colon-*` do not throw false positives in `url()` arguments.

# 4.4.0

-   Added: `ignore: "relative"` option for `font-weight-notation`.
-   Fixed: `declaration-colon-space/newline-before/after` rules now ignore scss maps.
-   Fixed: `selector-list-comma-newline-after` allows `//` comments after the comma.

# 4.3.6

-   Fixed: removed `console.log()`s in `property-unit-whitelist`.

# 4.3.5

-   Fixed: removed `console.log()`s in `rule-properties-order`.

# 4.3.4

-   Fixed: option normalization for rules with primary options that are arrays of objects, like `rule-properties-order`.
-   Fixed: accuracy of warning positions are `//` comments when using SCSS parser.
-   Fixed: `no-unknown-animations` ignores variables.
-   Fixed: `no-unknown-animations` does not erroneously flag functions like `steps()` and `cubic-bezier()`.
-   Fixed: clarified error message in `time-no-imperceptible`.
-   Fixed: `font-family-name-quotes` and `font-weight-notation` ignore variables.
-   Fixed: `media-feature-no-missing-punctuation` handles space-padded media features.
-   Fixed: regression causing CLI `--config` relatives paths that don't start with `./` to be rejected.

# 4.3.3

-   Fixed: again removed `stylelint.utils.ruleTester` because its dependencies broke things.

# 4.3.2

-   Fixed: move `tape` to dependencies to support `testUtils`.

# 4.3.1

-   Fixed: include `testUtils` in npm package whitelist.

# 4.3.0

-   Added: `font-family-name-quotes` rule.
-   Added: `font-weight-notation` rule.
-   Added: `media-feature-no-missing-punctuation` rule.
-   Added: `no-duplicate-selectors` rule.
-   Added: `no-invalid-double-slash-comments` rule.
-   Added: `no-unknown-animations` rule.
-   Added: `property-value-blacklist` rule.
-   Added: `property-value-whitelist` rule.
-   Added: `time-no-imperceptible` rule.
-   Added: `ignore: "descendant"` and `ignore: "compounded"` options for `selector-no-type`.
-   Added: support for regular expression property identification in `property-blacklist`, `property-unit-blacklist`, `property-unit-whitelist`, `property-value-blacklist`, and `property-whitelist`.
-   Added: better handling of vendor prefixes in `property-unit-blacklist` and `property-unit-whitelist`, e.g. if you enter `animation` it now also checks `-webkit-animation`.
-   Added: support for using names of modules for the CLI's `--config` argument, not just paths.
-   Added: `codeFilename` option to Node API.
-   Added: exposed rules at `stylelint.rules` to make stylelint even more extensible.
-   Added: brought `stylelint-rule-tester` into this repo, and exposed it at `stylelint.utils.ruleTester`.
-   Fixed: bug in `rule-properties-order` empty line detection when the two newlines were separated
  by some other whitespace.
-   Fixed: option parsing bug that caused problems when using the `"alphabetical"` primary option
  with `rule-properties-order`.
-   Fixed: regard an empty string as a valid CSS code.
-   Fixed: `ignoreFiles` handling of absolute paths.
-   Fixed: `ignoreFiles` uses the `configBasedir` option to interpret relative paths.

# 4.2.0

-   Added: support for custom messages with a `message` secondary property on any rule.
-   Fixed: CLI always ignores contents of `node_modules` and `bower_components` directories.
-   Fixed: bug preventing CLI from understanding absolute paths in `--config` argument.
-   Fixed: bug causing `indentation` to stumble over declarations with semicolons on their own lines.

# 4.1.0

-   Added: helpful option validation message when object is expected but non-object provided.
-   Fixed: `selector-no-id` no longer warns about Sass interpolation when multiple interpolations are used in a selector.

# 4.0.0

-   Removed: support for legacy numbered severities.
-   Added: support for extensions on `.stylelintrc` files (by upgrading cosmiconfig).
-   Added: `ignore: "non-comments"` option to `max-line-length`.
-   Fixed: `function-whitespace-after` does not expect space between `)` and `}`, so it handles Sass interpolation better.

# 3.2.3

-   Fixed: `selector-no-vendor-prefix` now handles custom-property-sets.

# 3.2.2

-   Fixed: `selector-no-type` ignores `nth-child` pseudo-classes and `@keyframes` selectors.

# 3.2.1

-   Fixed: `max-line-length` handles `url()` functions better.
-   Fixed: `block-opening-brace-newline-after` and `declaration-block-semicolon-newline-after` handle end-of-line comments better.

# 3.2.0

-   Added: `legacyNumberedSeverities` config property to force the legacy severity system.
-   Added: `selector-no-id` ignores Sass-style interpolation.
-   Fixed: bug causing extended config to override the config that extends it.

# 3.1.4

-   Fixed: stopped hijacking `--config` property in PostCSS and Node.js APIs. Still using it in the CLI.

# 3.1.3

-   Fixed: bug preventing the disabling of rules analyzing the `root` node, including: `max-line-length`, `max-empty-lines`, `no-eol-whitespace`, `no-missing-eof-newline`, and `string-quotes`.
-   Fixed: bug causing `rule-properties-order` to get confused by properties with an unspecified order.

# 3.1.2

-   Fixed: bug causing an error when `null` was used on rules whose primary options are arrays.

# 3.1.1

-   Fixed: Documentation improvements.

# 3.1.0

-   Added: `stylelint-commands` `ignore` option to `comment-empty-line-before`.
-   Fixed: v3 regression causing bug in `rule-properties-order` and potentially other rules that accept arrays as primary options.
-   Fixed: `no-missing-eof-newline` no longer complains about completely empty files.

# 3.0.3

-   Fixed: list of rules within documentation.

# 3.0.0-3.0.2

-   Removed: `nesting-block-opening-brace-space-before` and `nesting-block-opening-brace-newline-before` rules.
-   Deprecated: numbered severities (0, 1, 2) and will be disabled in `4.0`.
-   Changed: renamed `rule-single-line-max-declarations` to `declaration-block-single-line-max-declarations` and changed scope of the single-line to the declaration block.
-   Changed: renamed `rule-no-single-line` to `declaration-block-no-single-line` and changed scope of the single-line to the declaration block.
-   Changed: renamed the `function-space-after` rule to `function-whitespace-after`.
-   Changed: renamed the `comment-space-inside` rule to `comment-whitespace-inside`.
-   Changed: renamed the `no-multiple-empty-lines` rule to `max-empty-lines` (takes an `int` as option).
-   Changed: `plugins` is now an array instead of an object. And plugins should be created with `stylelint.createPlugin()`.
-   Added: cosmiconfig, which means the following:
    -   support for YAML `.stylelintrc`
    -   support for `stylelint.config.js`
    -   support for `stylelint` property in `package.json`
    -   alternate config loading system, which stops at the first config foun
-   Added: asynchronicity to the PostCSS plugin.
-   Added: `ignoreFiles` option to config.
-   Added: `configFile` option to Node.js API.
-   Fixed: `comment-whitespace-inside` now ignores ignores copyright (`/*! `) and sourcemap (`/*# `) comments.
-   Fixed: `rule-no-duplicate-properties` now ignores the `src` property.

# 2.3.7

-   Fixed: `function-calc-no-unspaced-operator` ignores characters in `$sass` and `@less` variables.
-   Fixed: `rule-properties-order` allows comments at the top of groups that expect newlines before them.
-   Fixed: `styleSearch()` and the rules it powers will not trip up on single-line (`//`) comments.
-   Fixed: `selector-combinator-space-before` now better handles nested selectors starting with combinators.
-   Fixed: `rule-properties-order` now deals property with `-moz-osx-font-smoothing`.

# 2.3.6

-   Fixed: improved documentation of CLI globbing possibilities.
-   Fixed: `rule-properties-order` now accounts for property names containing multiple hyphens.
-   Fixed: `rule-properties-order` grouping bug.

# 2.3.5

-   Added: error about undefined severities blaming stylelint for the bug.
-   Fixed: `selector-pseudo-element-colon-notation` typo in rule name resulting in undefined severity.

# 2.3.4

-   Fixed: `dist/` build.

# 2.3.3

-   Fixed: `property-whitelist`, `rule-no-duplicate-properties`, and `rule-properties-order` ignore variables (`$sass`, `@less`, and `--custom-property`).
-   Fixed: `root-no-standard-properties` ignores `$sass` and `@less` variables.
-   Fixed: `comment-empty-line-before` and `comment-space-inside` no longer complain about `//` comments.

# 2.3.2

-   Fixed: `number-no-trailing-zeros` no longer flags at-import at-rules.

# 2.3.1

-   Fixed: `selector-no-type` no longer flags the *nesting selector* (`&`).

# 2.3.0

-   Added: `configFile` option to PostCSS plugin.
-   Fixed: `function-parentheses-newline-inside` and `function-parentheses-space-inside` bug with nested functions.

# 2.2.0

-   Added: `selector-class-pattern` rule.
-   Added: `selector-id-pattern` rule.
-   Added: `function-parentheses-newline-inside` rule.
-   Added: `"always-single-line"` and `"never-single-line"` options to `function-parentheses-space-inside`.
-   Fixed: CLI `syntax` argument bug.

# 2.1.0

-   Added: `color-no-hex` rule.
-   Added: `color-no-named` rule.
-   Added: `function-blacklist` rule.
-   Added: `function-whitelist` rule.
-   Added: `unit-blacklist` rule.
-   Added: `unit-whitelist` rule.
-   Added: `property-unit-blacklist` rule.
-   Added: `property-unit-whitelist` rule.
-   Added: `rule-single-line-max-declarations` rule.
-   Added: `max-line-length` rule.
-   Added: `first-nested` exception to `comment-empty-line-before`.
-   Added: single value options to `*-blacklist` & `-*whitelist` rules e.g. `{ "function-blacklist": "calc"}`
-   Added: support for flexible groups to `rule-properties-order`.
-   Added: support for an optional empty line between each group to `rule-properties-order`.
-   Added: support for mathematical signs in front of Sass and Less variables in `function-calc-no-unspaced-operator`.
-   Added: support for arbitrary whitespace after function in `function-space-after`.
-   Added: support for arbitrary whitespace at the edge of comments in `comment-space-inside`.
-   Fixed: `comment-space-inside` allows any number of asterisks at the beginning and end of comments.
-   Fixed: bug causing `{ unspecified: "bottom }"` option not to be applied within `rule-properties-order`.
-   Fixed: bug causing `function-comma-*` whitespace rules to improperly judge whether to enforce single-   or multi-line options.
-   Fixed: bug when loading plugins from an extended config
-   Fixed: indentation for function arguments, by ignoring them.

# 2.0.0

-   Changed: plugins are now included and configured via a "locator", rather than either being `required` or being inserted directly into the configuration object as a function.
-   Added: CLI.
-   Added: standalone Node API.
-   Added: quiet mode to CLI and Node API.
-   Added: support for formatters, including custom ones, to CLI and Node API.
-   Added: `string` and `json` formatters.
-   Added: support for using `.stylelintrc` JSON file.
-   Added: support for extending existing configs using the `extends` property.
-   Added: support for SCSS syntax parsing to CLI and Node API.
-   Added: `function-comma-newline-after` rule.
-   Added: `function-comma-newline-before` rule.
-   Added: `"always-single-line"` and `"never-single-line"` options to `function-comma-space-after` rule.
-   Added: `"always-single-line"` and `"never-single-line"` options to `function-comma-space-before` rule.

# 1.2.1

-   Fixed: the `media-query-list-comma-*` rules now only apply to `@media` statements.

# 1.2.0

-   Added: `function-linear-gradient-no-nonstandard-direction` rule.
-   Added: `rule-properties-order` now by default ignores the order of properties left out of your specified array; and the options `"top"`, `"bottom"`, and `"ignore"` are provided to change that behavior.
-   Added: `rule-properties-order` now looks for roots of hyphenated properties in custom arrays so each extension (e.g. `padding-top` as an extension of `padding`) does not need to be specified individually.
-   Added: `"always-single-line"` option to `declaration-colon-space-after`.
-   Added: support for declarations directly on root (e.g. Sass variable declarations).
-   Fixed: `declaration-colon-newline-after` `"always-multi-line"` warning message.

# 1.1.0

-   Added: `declaration-colon-newline-after` rule.
-   Added: the `indentation` rule now checks indentation of multi-line at-rule params, unless there's the `except` option of `param`.
-   Added: support for end-of-line comments in `selector-list-comma-newline-after`.
-   Added: protection against `#${sass-interpolation}` in rules checking for hex colors.
-   Added: support for strings (translated to RegExps) in `custom-property-pattern` and `custom-media-pattern`.
-   Fixed: bug preventing various rules from registering the correct rule names in their warnings, and therefore also preventing them from being disabled with comments.
-   Fixed: the `color-no-invalid-hex` rule no longer flags hashes in `url()` arguments.
-   Fixed: rules using `node.raw()` instead of `node.raws` to avoid expected errors.

# 1.0.1

-   Fixed: `postcss-selector-parser` updated to improve location accuracy for `selector-no-*` rules.

# 1.0.0

-   Removed: compatibility with PostCSS `4.x`.
-   Added: compatibility with PostCSS `5.0.2+`.
-   Fixed: the accuracy of reported line numbers and columns.

# 0.8.0

-   Added: `after-comment` `ignore` option to the `at-rule-empty-line-before` rule.
-   Fixed: the `indentation` rule now correctly handles `*` hacks on property names.
-   Fixed: the `media-feature-colon-space-after` and `media-feature-colon-space-before` rules now only apply to `@media` statements.
-   Fixed: the `rule-no-shorthand-property-overrides` rule message is now consistent with the other messages.

# 0.7.0

-   Added: invalid options cause the rule to abort instead of performing meaningless checks.
-   Added: special warning for missing required options from `validateOptions()`.

# 0.6.2

-   Fixed: npm package no longer includes test files (reducing package size by 500KB).

# 0.6.1

-   Fixed: the `rule-properties-order` and `rule-no-duplicate-properties` rules now correctly check inside @rules.

# 0.6.0

-   Added: `validateOptions` to `stylelint.utils` for use by authors of custom rules.
-   Added: `custom-media-pattern` rule.
-   Added: `number-max-precision` rule.

# 0.5.0

-   Added: validation of all rule options.

# 0.4.1

-   Removed: `ruleTester` from `stylelint.utils` because of the additional dependencies it forces.

# 0.4.0

-   Removed: `jsesc` devDependency.
-   Added: `rule-no-shorthand-property-overrides` rule.
-   Added: `ruleTester` to `stylelint.utils` for use by authors of custom rules.

# 0.3.2

-   Fixed: `hierarchicalSelectors` bug in `indentation` rule.

# 0.3.1

-   Fixed: `~=` is no longer mistaken for combinator in `selector-combinator-space-*`.

# 0.3.0

-   Added: exposure of `report`, `ruleMessages`, and `styleSearch` in `stylelint.utils` for use by external plugin rules.
-   Added: plugin rule support.
-   Added: `hierarchicalSelectors` option to `indentation` rule.
-   Added: `nesting-block-opening-brace-space-before` rule.
-   Added: `nesting-block-opening-brace-newline-before` rule.
-   Fixed: the `color-hex-case` rule message is now consistent with the `color-hex-length` rule.
-   Fixed: the `property-blacklist` rule message is now consistent with the `property-whitelist` rule.
-   Fixed: a typo in the `comment-space-inside` rule message.

# 0.2.0

-   Added: `color-hex-case` rule.
-   Added: `color-hex-length` rule.
-   Fixed: formalized selector-indentation-checking within the `indentation` rule.
-   Fixed: allow for arbitrary whitespace after the newline in the `selector-list-comma-newline-*` rules.
-   Fixed: `selector-combinator-space-*` no longer checks `:nth-child()` arguments.

# 0.1.2

-   Fixed: nesting support for the `block-opening-brace-newline-before` rule.
-   Fixed: nesting support for the `block-opening-brace-space-before` rule.
-   Fixed: nesting support for the `rule-trailing-semicolon` rule.

# 0.1.1

-   Fixed: nesting support for the `rule-no-duplicate-properties` rule.
-   Fixed: nesting support for the `rule-properties-order` rule.
-   Fixed: whitespace rules accommodate Windows CR-LF line endings.

# 0.1.0

-   Added: ability to disable rules via comments in the CSS.
-   Added: `at-rule-empty-line-before` rule.
-   Added: `at-rule-no-vendor-prefix` rule.
-   Added: `block-closing-brace-newline-after` rule.
-   Added: `block-closing-brace-newline-before` rule.
-   Added: `block-closing-brace-space-after` rule.
-   Added: `block-closing-brace-space-before` rule.
-   Added: `block-no-empty` rule.
-   Added: `block-opening-brace-newline-after` rule.
-   Added: `block-opening-brace-newline-before` rule.
-   Added: `block-opening-brace-space-after` rule.
-   Added: `block-opening-brace-space-before` rule.
-   Added: `color-no-invalid-hex` rule.
-   Added: `comment-empty-line-before` rule.
-   Added: `comment-space-inside` rule.
-   Added: `custom-property-no-outside-root` rule.
-   Added: `custom-property-pattern` rule.
-   Added: `declaration-bang-space-after` rule.
-   Added: `declaration-bang-space-before` rule.
-   Added: `declaration-block-semicolon-newline-after` rule.
-   Added: `declaration-block-semicolon-newline-before` rule.
-   Added: `declaration-block-semicolon-space-after` rule.
-   Added: `declaration-block-semicolon-space-before` rule.
-   Added: `declaration-colon-space-after` rule.
-   Added: `declaration-colon-space-before` rule.
-   Added: `declaration-no-important` rule.
-   Added: `function-calc-no-unspaced-operator` rule.
-   Added: `function-comma-space-after` rule.
-   Added: `function-comma-space-before` rule.
-   Added: `function-parentheses-space-inside` rule.
-   Added: `function-space-after` rule.
-   Added: `function-url-quotes` rule.
-   Added: `indentation` rule.
-   Added: `media-feature-colon-space-after` rule.
-   Added: `media-feature-colon-space-before` rule.
-   Added: `media-feature-name-no-vendor-prefix` rule.
-   Added: `media-feature-range-operator-space-after` rule.
-   Added: `media-feature-range-operator-space-before` rule.
-   Added: `media-query-list-comma-newline-after` rule.
-   Added: `media-query-list-comma-newline-before` rule.
-   Added: `media-query-list-comma-space-after` rule.
-   Added: `media-query-list-comma-space-before` rule.
-   Added: `media-query-parentheses-space-inside` rule.
-   Added: `no-eol-whitespace` rule.
-   Added: `no-missing-eof-newline` rule.
-   Added: `no-multiple-empty-lines` rule.
-   Added: `number-leading-zero` rule.
-   Added: `number-no-trailing-zeros` rule.
-   Added: `number-zero-length-no-unit` rule.
-   Added: `property-blacklist` rule.
-   Added: `property-no-vendor-prefix` rule.
-   Added: `property-whitelist` rule.
-   Added: `root-no-standard-properties` rule.
-   Added: `rule-nested-empty-line-before` rule.
-   Added: `rule-no-duplicate-properties` rule.
-   Added: `rule-no-single-line` rule.
-   Added: `rule-non-nested-empty-line-before` rule.
-   Added: `rule-properties-order` rule.
-   Added: `rule-trailing-semicolon` rule.
-   Added: `selector-combinator-space-after` rule.
-   Added: `selector-combinator-space-before` rule.
-   Added: `selector-list-comma-newline-after` rule.
-   Added: `selector-list-comma-newline-before` rule.
-   Added: `selector-list-comma-space-after` rule.
-   Added: `selector-list-comma-space-before` rule.
-   Added: `selector-no-attribute` rule.
-   Added: `selector-no-combinator` rule.
-   Added: `selector-no-id` rule.
-   Added: `selector-no-type` rule.
-   Added: `selector-no-universal` rule.
-   Added: `selector-no-vendor-prefix` rule.
-   Added: `selector-pseudo-element-colon-notation` rule.
-   Added: `selector-root-no-composition` rule.
-   Added: `string-quotes` rule.
-   Added: `value-list-comma-newline-after` rule.
-   Added: `value-list-comma-newline-before` rule.
-   Added: `value-list-comma-space-after` rule.
-   Added: `value-list-comma-space-before` rule.
-   Added: `value-no-vendor-prefix` rule.
