# Changelog

## 16.16.0 - 2025-03-14

It adds support for computing `EditInfo` to 22 more rules and reverts a change that added `context.lexer` to our public API in the previous release.

### Added

- `at-rule-empty-line-before` support for computing `EditInfo` ([#8425](https://github.com/stylelint/stylelint/pull/8425)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `at-rule-no-deprecated` support for computing `EditInfo` ([#8426](https://github.com/stylelint/stylelint/pull/8426)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `at-rule-no-vendor-prefix` support for computing `EditInfo` ([#8427](https://github.com/stylelint/stylelint/pull/8427)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `color-function-notation` support for computing `EditInfo` ([#8437](https://github.com/stylelint/stylelint/pull/8437)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `declaration-empty-line-before` support for computing `EditInfo` ([#8443](https://github.com/stylelint/stylelint/pull/8443)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `declaration-property-value-keyword-no-deprecated` support for computing `EditInfo`. ([#8439](https://github.com/stylelint/stylelint/pull/8439)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `font-family-name-quotes` support for computing `EditInfo` ([#8419](https://github.com/stylelint/stylelint/pull/8419)) ([@ryo-manba](https://github.com/ryo-manba)).
- `font-weight-notation` support for computing `EditInfo` ([#8420](https://github.com/stylelint/stylelint/pull/8420)) ([@ryo-manba](https://github.com/ryo-manba)).
- `function-calc-no-unspaced-operator` support for computing `EditInfo` ([#8440](https://github.com/stylelint/stylelint/pull/8440)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `function-name-case` support for support for computing `EditInfo`." ([#8442](https://github.com/stylelint/stylelint/pull/8442)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `hue-degree-notation` support for computing `EditInfo` ([#8444](https://github.com/stylelint/stylelint/pull/8444)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `import-notation` support for computing `EditInfo`. ([#8445](https://github.com/stylelint/stylelint/pull/8445)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `keyframe-selector-notation` support for computing `EditInfo` ([#8457](https://github.com/stylelint/stylelint/pull/8457)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `length-zero-no-unit` support for computing `EditInfo` ([#8459](https://github.com/stylelint/stylelint/pull/8459)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `lightness-notation` support for computing `EditInfo` ([#8458](https://github.com/stylelint/stylelint/pull/8458)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `media-feature-name-no-vendor-prefix` support for computing `EditInfo` ([#8456](https://github.com/stylelint/stylelint/pull/8456)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `media-feature-range-notation` support for computing `EditInfo` ([#8455](https://github.com/stylelint/stylelint/pull/8455)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `property-no-vendor-prefix` support for computing `EditInfo` ([#8461](https://github.com/stylelint/stylelint/pull/8461)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `rule-empty-line-before` support for computing `EditInfo` ([#8460](https://github.com/stylelint/stylelint/pull/8460)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `selector-no-vendor-prefix` support for `EditInfo` ([#8462](https://github.com/stylelint/stylelint/pull/8462)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `selector-not-notation` support for computing `EditInfo` ([#8463](https://github.com/stylelint/stylelint/pull/8463)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `selector-pseudo-element-colon-notation` support for `EditInfo` ([#8464](https://github.com/stylelint/stylelint/pull/8464)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `selector-type-case` support for computing `EditInfo` ([#8467](https://github.com/stylelint/stylelint/pull/8467)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `shorthand-property-no-redundant-values` support for computing `EditInfo` ([#8466](https://github.com/stylelint/stylelint/pull/8466)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `value-keyword-case` support for computing `EditInfo` ([#8469](https://github.com/stylelint/stylelint/pull/8469)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `value-no-vendor-prefix` support for computing `EditInfo` ([#8470](https://github.com/stylelint/stylelint/pull/8470)) ([@pamelalozano16](https://github.com/pamelalozano16)).

### Fixed

- `Could not find a declaration file for module 'css-tree'` type error ([#8452](https://github.com/stylelint/stylelint/pull/8452)) ([@danielrentz](https://github.com/danielrentz)).

## 16.15.0 - 2025-02-28

It adds 1 new rule, a `languageOptions` configuration property for configuring some of the new rules added in `16.13.0`, regex support to 1 option and support for computing `EditInfo` to 6 rules. It fixes 9 bugs, including 2 with the `tap` reporter.

### Added

- `syntax-string-no-invalid` rule ([#8331](https://github.com/stylelint/stylelint/pull/8331)) ([@ryo-manba](https://github.com/ryo-manba)).
- `languageOptions` configuration property ([#8297](https://github.com/stylelint/stylelint/pull/8297)) ([@ryo-manba](https://github.com/ryo-manba)).
- regex support to `ignoreAtRules` option of `at-rule-empty-line-before` ([#8385](https://github.com/stylelint/stylelint/pull/8385)) ([@ryo-manba](https://github.com/ryo-manba)).
- `alpha-value-notation` support for computing `EditInfo` ([#8369](https://github.com/stylelint/stylelint/pull/8369)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `color-hex-length` support for computing `EditInfo` ([#8415](https://github.com/stylelint/stylelint/pull/8415)) ([@ryo-manba](https://github.com/ryo-manba)).
- `comment-empty-line-before` support for computing `EditInfo` ([#8416](https://github.com/stylelint/stylelint/pull/8416)) ([@ryo-manba](https://github.com/ryo-manba)).
- `comment-whitespace-inside` support for computing `EditInfo` ([#8417](https://github.com/stylelint/stylelint/pull/8417)) ([@ryo-manba](https://github.com/ryo-manba)).
- `custom-property-empty-line-before` support for computing `EditInfo` ([#8418](https://github.com/stylelint/stylelint/pull/8418)) ([@ryo-manba](https://github.com/ryo-manba)).
- `declaration-block-no-duplicate-properties` support for computing `EditInfo` ([#8363](https://github.com/stylelint/stylelint/pull/8363)) ([@romainmenke](https://github.com/romainmenke)).

### Fixed

- `tap` formatter not escaping `#` and `\` in its test point descriptions ([#8334](https://github.com/stylelint/stylelint/pull/8334)) ([@Mouvedia](https://github.com/Mouvedia)).
- `tap` formatter outputting invalid YAML blocks for rules containing double quotes in their warnings' messages ([#8334](https://github.com/stylelint/stylelint/pull/8334)) ([@Mouvedia](https://github.com/Mouvedia)).
- `declaration-block-no-redundant-longhand-properties` false positives for properties with `!important` ([#8366](https://github.com/stylelint/stylelint/pull/8366)) ([@immitsu](https://github.com/immitsu)).
- `EditInfo` missing semicolon in `text` field ([#8370](https://github.com/stylelint/stylelint/pull/8370)) ([@pamelalozano16](https://github.com/pamelalozano16)).
- `declaration-property-value-keyword-no-deprecated` false negatives for `text-decoration: blink` ([#8351](https://github.com/stylelint/stylelint/pull/8351)) ([@Mouvedia](https://github.com/Mouvedia)).
- `declaration-property-value-keyword-no-deprecated` false positives for styled components interpolated functions ([#8392](https://github.com/stylelint/stylelint/pull/8392)) ([@Mouvedia](https://github.com/Mouvedia)).
- `font-family-name-quotes` false positives due to vendor-prefixed font-size values ([#8393](https://github.com/stylelint/stylelint/pull/8393)) ([@Mouvedia](https://github.com/Mouvedia)).
- `font-family-no-missing-generic-family-keyword` false positives for `math`, `emoji` and `fangsong` ([#8395](https://github.com/stylelint/stylelint/pull/8395)) ([@ViachaslauIhnatsiuk](https://github.com/ViachaslauIhnatsiuk)).
- `selector-type-no-unknown` false positives for `selectmenu` and `popup` ([#8376](https://github.com/stylelint/stylelint/pull/8376)) ([@Mouvedia](https://github.com/Mouvedia)).

## 16.14.1 - 2025-01-27

It fixes a bug with caching.

### Fixed

- incompatible cache file format ([#8359](https://github.com/stylelint/stylelint/pull/8359)) ([@romainmenke](https://github.com/romainmenke)).

## 16.14.0 - 2025-01-25

It fixes 8 bugs and adds features to our `Warning` type.

### Added

- replaced text and corresponding range to `Warning` type ([#8234](https://github.com/stylelint/stylelint/pull/8234)) ([@romainmenke](https://github.com/romainmenke)).

### Fixed

- `SyntaxError: The requested module 'table'...` ([#8325](https://github.com/stylelint/stylelint/pull/8325)) ([@denisx](https://github.com/denisx)).
- `RuleContext['fix']` type ([#8309](https://github.com/stylelint/stylelint/pull/8309)) ([@Mouvedia](https://github.com/Mouvedia)).
- `declaration-property-value-keyword-no-deprecated` autofix of `border-color` and `overflow` ([#8346](https://github.com/stylelint/stylelint/pull/8346)) ([@Mouvedia](https://github.com/Mouvedia)).
- `declaration-property-value-keyword-no-deprecated` false negatives for `overflow-x` and `overflow-y` ([#8340](https://github.com/stylelint/stylelint/pull/8340)) ([@Mouvedia](https://github.com/Mouvedia)).
- `declaration-property-value-keyword-no-deprecated` false negatives for `scrollbar-color` ([#8346](https://github.com/stylelint/stylelint/pull/8346)) ([@Mouvedia](https://github.com/Mouvedia)).
- `declaration-property-value-keyword-no-deprecated` false positives for non-standard syntax values ([#8329](https://github.com/stylelint/stylelint/pull/8329)) ([@Mouvedia](https://github.com/Mouvedia)).
- `declaration-property-value-keyword-no-deprecated` warning message for `overflow: <keyword> <keyword>` ([#8340](https://github.com/stylelint/stylelint/pull/8340)) ([@Mouvedia](https://github.com/Mouvedia)).
- `selector-pseudo-class-no-unknown` false positives for `:has-slotted` ([#8332](https://github.com/stylelint/stylelint/pull/8332)) ([@Mouvedia](https://github.com/Mouvedia)).

## 16.13.2 - 2025-01-14

It fixes a regression bug with `--fix`.

### Fixed

- `--fix` CLI flag raising unknown value error ([#8313](https://github.com/stylelint/stylelint/pull/8313)) ([@ybiquitous](https://github.com/ybiquitous)).

## 16.13.1 - 2025-01-13

It fixes one bug due to an upstream change in our `ignore` dependency.

### Fixed

- `ignore.default is not a function` ([#8305](https://github.com/stylelint/stylelint/pull/8305)) ([@romainmenke](https://github.com/romainmenke)).

## 16.13.0 - 2025-01-12

It adds 3 rules to help you write error-free at-rules and 2 rules to warn you about deprecated CSS features. We've turned these rules on in our [standard config](https://www.npmjs.com/package/stylelint-config-standard).

It also adds new rule options, a feature to display how long rules take, lax autofix and support for `messageArgs` in more rules. It fixes 7 bugs.

Lastly, we've made a deprecation that may affect some plugins. We've updated our docs for [plugin authors](docs/developer-guide/plugins.md#quiet-deprecation-warnings) and [end users](docs/user-guide/options.md#quietdeprecationwarnings) on how to silence deprecation warnings.

### Deprecated

- ambiguous position arguments passed to `utils.report()` ([#8244](https://github.com/stylelint/stylelint/pull/8244)) ([@romainmenke](https://github.com/romainmenke)).

### Added

- `lax`/`strict` values to the `fix` Node.js API option and CLI flag ([#8106](https://github.com/stylelint/stylelint/pull/8106)) ([@ryo-manba](https://github.com/ryo-manba)).
- support for profiling rule performance via the `TIMING` environment variable ([#8108](https://github.com/stylelint/stylelint/pull/8108)) ([@ryo-manba](https://github.com/ryo-manba)).
- `at-rule-descriptor-no-unknown` rule ([#8197](https://github.com/stylelint/stylelint/pull/8197)) ([@ryo-manba](https://github.com/ryo-manba)).
- `at-rule-descriptor-value-no-unknown` rule ([#8211](https://github.com/stylelint/stylelint/pull/8211)) ([@ryo-manba](https://github.com/ryo-manba)).
- `at-rule-no-deprecated` rule ([#8251](https://github.com/stylelint/stylelint/pull/8251)) ([@jeddy3](https://github.com/jeddy3)).
- `at-rule-prelude-no-invalid` rule ([#8268](https://github.com/stylelint/stylelint/pull/8268)) ([@ryo-manba](https://github.com/ryo-manba)).
- `declaration-property-value-keyword-no-deprecated` rule ([#8223](https://github.com/stylelint/stylelint/pull/8223)) ([@Mouvedia](https://github.com/Mouvedia)).
- `"ignore": ["at-rule-preludes", "declaration-values"]` to `string-no-newline` ([#8214](https://github.com/stylelint/stylelint/pull/8214)) ([@ryo-manba](https://github.com/ryo-manba)).
- `messageArgs` to `declaration-property-value-no-unknown`, `font-family-name-quotes`, `font-family-no-duplicate-names`, `function-calc-no-unspaced-operator`, `import-notation`, `media-feature-name-unit-allowed-list`, `selector-attribute-quotes` and `selector-pseudo-element-colon-notation` ([#8285](https://github.com/stylelint/stylelint/pull/8285) & [#8252](https://github.com/stylelint/stylelint/pull/8252)) ([@Mouvedia](https://github.com/Mouvedia)).

### Fixed

- deprecation warnings to only display once per (custom) rule ([#8265](https://github.com/stylelint/stylelint/pull/8265)) ([@romainmenke](https://github.com/romainmenke)).
- `*-no-vendor-prefix` message ambiguity ([#8239](https://github.com/stylelint/stylelint/pull/8239)) ([@Mouvedia](https://github.com/Mouvedia)).
- `at-rule-(dis)allowed-list`, `at-rule-no-vendor-prefix`, `at-rule-property-required-list` message argument ([#8277](https://github.com/stylelint/stylelint/pull/8277)) ([@Mouvedia](https://github.com/Mouvedia)).
- `at-rule-property-required-list` message for inclusion of properties and descriptors ([#8207](https://github.com/stylelint/stylelint/pull/8207)) ([@jeddy3](https://github.com/jeddy3)).
- `at-rule-*` false positives and negatives for `@charset` rule ([#8215](https://github.com/stylelint/stylelint/pull/8215)) ([@jeddy3](https://github.com/jeddy3)).
- `declaration-property-value-no-unknown` false positives for descriptors ([#8240](https://github.com/stylelint/stylelint/pull/8240)) ([@jeddy3](https://github.com/jeddy3)).
- `property-(dis)allowed-list` false negatives for custom properties, use `/^--/` to (dis)allow them ([#8209](https://github.com/stylelint/stylelint/pull/8209)) ([@fbasmaison-lucca](https://github.com/fbasmaison-lucca)).
- `property-no-unknown` false positives for descriptors ([#8203](https://github.com/stylelint/stylelint/pull/8203)) ([@jeddy3](https://github.com/jeddy3)).
- `selector-pseudo-class-no-unknown` false positives for deprecated pseudo-classes ([#8264](https://github.com/stylelint/stylelint/pull/8264)) ([@Mouvedia](https://github.com/Mouvedia)).
- `selector-type-case` false positives for `hatchPath` ([#8264](https://github.com/stylelint/stylelint/pull/8264)) ([@Mouvedia](https://github.com/Mouvedia)).
- `selector-type-no-unknown` false positives for `shadow`, `hatch` and `hatchpath` ([#8264](https://github.com/stylelint/stylelint/pull/8264)) ([@Mouvedia](https://github.com/Mouvedia)).

## 16.12.0 - 2024-12-15

### Added

- `selector-pseudo-class-allowed-list` now checks `@page` pseudo-classes ([#8176](https://github.com/stylelint/stylelint/pull/8176)) ([@Mouvedia](https://github.com/Mouvedia)).
- `selector-pseudo-class-disallowed-list` now checks `@page` pseudo-classes ([#8171](https://github.com/stylelint/stylelint/pull/8171)) ([@Mouvedia](https://github.com/Mouvedia)).

### Fixed

- `at-rule-property-required-list` message to use "descriptor" for accuracy ([#8186](https://github.com/stylelint/stylelint/pull/8186)) ([@ybiquitous](https://github.com/ybiquitous)).
- `custom-property-no-missing-var-function` false positives for `container-name` ([#8157](https://github.com/stylelint/stylelint/pull/8157)) ([@Mouvedia](https://github.com/Mouvedia)).
- `custom-property-no-missing-var-function` false positives for custom properties passed to `running()` ([#8172](https://github.com/stylelint/stylelint/pull/8172)) ([@Mouvedia](https://github.com/Mouvedia)).
- `function-no-unknown` false positives for `running()` ([#8172](https://github.com/stylelint/stylelint/pull/8172)) ([@Mouvedia](https://github.com/Mouvedia)).
- `selector-pseudo-class-no-unknown` false positives for `:open` ([#8184](https://github.com/stylelint/stylelint/pull/8184)) ([@lukewarlow](https://github.com/lukewarlow)).
- `selector-pseudo-class-no-unknown` false positives for `:recto`, `:verso` and `:nth()` ([#8170](https://github.com/stylelint/stylelint/pull/8170)) ([@Mouvedia](https://github.com/Mouvedia)).
- `selector-pseudo-class-no-unknown` false positives for some `moz-*` vendor-prefixed pseudo-classes ([#8188](https://github.com/stylelint/stylelint/pull/8188)) ([@Mouvedia](https://github.com/Mouvedia)).
- `selector-pseudo-element-no-unknown` false positives for `::details-content` ([#8174](https://github.com/stylelint/stylelint/pull/8174)) ([@lukewarlow](https://github.com/lukewarlow)).
- `selector-type-no-unknown` false positives for idents in functional pseudo-classes ([#8191](https://github.com/stylelint/stylelint/pull/8191)) ([@elskhn](https://github.com/elskhn)).
- `value-keyword-case` false negatives ([#8158](https://github.com/stylelint/stylelint/pull/8158)) ([@Mouvedia](https://github.com/Mouvedia)).
- `value-keyword-case` false positives for vendor-prefixed system colors ([#8146](https://github.com/stylelint/stylelint/pull/8146)) ([@Mouvedia](https://github.com/Mouvedia)).

## 16.11.0 - 2024-11-28

### Added

- `--report-unscoped-disables` CLI flag and `reportUnscopedDisables` option to Node.js API and configuration object ([#8024](https://github.com/stylelint/stylelint/pull/8024)) ([@Mouvedia](https://github.com/Mouvedia)).
- `ignoreFunctions: []` to `media-query-no-invalid` ([#8060](https://github.com/stylelint/stylelint/pull/8060)) ([@ryo-manba](https://github.com/ryo-manba)).
- `name` configuration property under `overrides` ([#8095](https://github.com/stylelint/stylelint/pull/8095)) ([@ryo-manba](https://github.com/ryo-manba)).

### Fixed

- `benchmark-rule` script to resolve `TypeError` ([#8090](https://github.com/stylelint/stylelint/pull/8090)) ([@ybiquitous](https://github.com/ybiquitous)).
- `github` formatter deprecation warning link to `https://stylelint.io/awesome-stylelint#formatters` ([#8115](https://github.com/stylelint/stylelint/pull/8115)) ([@ryo-manba](https://github.com/ryo-manba)).
- `function-calc-no-unspaced-operator` false negatives for `calc-size` ([#8026](https://github.com/stylelint/stylelint/pull/8026)) ([@azat-io](https://github.com/azat-io)).
- `max-nesting-depth` false positives when the `&` selector is being ignored ([#8048](https://github.com/stylelint/stylelint/pull/8048)) ([@ryo-manba](https://github.com/ryo-manba)).
- `media-feature-name-value-no-unknown` false positives for `display-mode: picture-in-picture` ([#8136](https://github.com/stylelint/stylelint/pull/8136)) ([@Mouvedia](https://github.com/Mouvedia)).
- `no-irregular-whitespace` reported ranges ([#8066](https://github.com/stylelint/stylelint/pull/8066)) ([@romainmenke](https://github.com/romainmenke)).
- `selector-attribute-name-disallowed-list` reported ranges ([#8037](https://github.com/stylelint/stylelint/pull/8037)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-attribute-operator-allowed-list` reported ranges ([#8038](https://github.com/stylelint/stylelint/pull/8038)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-attribute-operator-disallowed-list` reported ranges ([#8039](https://github.com/stylelint/stylelint/pull/8039)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-class-pattern` reported ranges ([#8042](https://github.com/stylelint/stylelint/pull/8042)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-combinator-allowed-list` reported ranges ([#8046](https://github.com/stylelint/stylelint/pull/8046)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-combinator-disallowed-list` reported ranges ([#8047](https://github.com/stylelint/stylelint/pull/8047)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-disallowed-list` reported ranges ([#8067](https://github.com/stylelint/stylelint/pull/8067)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-id-pattern` reported ranges ([#8045](https://github.com/stylelint/stylelint/pull/8045)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-max-attribute` reported ranges ([#8052](https://github.com/stylelint/stylelint/pull/8052)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-max-class` reported ranges ([#8053](https://github.com/stylelint/stylelint/pull/8053)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-max-combinators` reported-ranges ([#8055](https://github.com/stylelint/stylelint/pull/8055)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-max-compound-selectors` reported ranges ([#8056](https://github.com/stylelint/stylelint/pull/8056)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-max-id` reported ranges ([#8054](https://github.com/stylelint/stylelint/pull/8054)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-max-pseudo-class` reported ranges ([#8057](https://github.com/stylelint/stylelint/pull/8057)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-max-specificity` reported ranges ([#8058](https://github.com/stylelint/stylelint/pull/8058)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-max-universal` reported ranges ([#8059](https://github.com/stylelint/stylelint/pull/8059)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-nested-pattern` reported ranges ([#8072](https://github.com/stylelint/stylelint/pull/8072)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-no-vendor-prefix` reported ranges ([#8073](https://github.com/stylelint/stylelint/pull/8073)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-not-notation` reported ranges ([#8074](https://github.com/stylelint/stylelint/pull/8074)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-pseudo-class-allowed-list` reported ranges ([#8061](https://github.com/stylelint/stylelint/pull/8061)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-pseudo-class-disallowed-list` reported ranges ([#8062](https://github.com/stylelint/stylelint/pull/8062)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-pseudo-class-no-unknown` reported ranges ([#8063](https://github.com/stylelint/stylelint/pull/8063)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-pseudo-element-allowed-list` reported ranges ([#8068](https://github.com/stylelint/stylelint/pull/8068)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-pseudo-element-colon-notation` reported ranges ([#8069](https://github.com/stylelint/stylelint/pull/8069)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-pseudo-element-disallowed-list` reported ranges ([#8070](https://github.com/stylelint/stylelint/pull/8070)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-pseudo-element-no-unknown` false positives for `::scroll-marker` and `::scroll-marker-group` ([#8110](https://github.com/stylelint/stylelint/pull/8110)) ([@Mouvedia](https://github.com/Mouvedia)).
- `selector-pseudo-element-no-unknown` reported ranges ([#8071](https://github.com/stylelint/stylelint/pull/8071)) ([@ryo-manba](https://github.com/ryo-manba)).
- `selector-type-no-unknown` reported ranges ([#8076](https://github.com/stylelint/stylelint/pull/8076)) ([@ryo-manba](https://github.com/ryo-manba)).

## 16.10.0 - 2024-10-11

### Changed

- `shorthand-property-no-redundant-values` reported ranges ([#8008](https://github.com/stylelint/stylelint/pull/8008)) ([@Mouvedia](https://github.com/Mouvedia)).

### Added

- `formatter` configuration property ([#7826](https://github.com/stylelint/stylelint/pull/7826)) ([@emmacharp](https://github.com/emmacharp)).
- `validate` option to Node.js API and `--validate` CLI flag ([#8009](https://github.com/stylelint/stylelint/pull/8009)) ([@Mouvedia](https://github.com/Mouvedia)).
- fixed section to the output of the `verbose` formatter ([#7985](https://github.com/stylelint/stylelint/pull/7985)) ([@Mouvedia](https://github.com/Mouvedia)).
- support for `string | RegExp` to `ignoreValues` option of `value-no-vendor-prefix` ([#7969](https://github.com/stylelint/stylelint/pull/7969)) ([@Mouvedia](https://github.com/Mouvedia)).
- support for `string` to `ignoreLonghands` option of `declaration-block-no-redundant-longhand-properties` ([#7971](https://github.com/stylelint/stylelint/pull/7971)) ([@Mouvedia](https://github.com/Mouvedia)).

### Fixed

- `at-rule-no-unknown` false positives for `@position-try` ([#7968](https://github.com/stylelint/stylelint/pull/7968)) ([@yelizsevinc](https://github.com/yelizsevinc)).
- `declaration-block-no-redundant-longhand-properties` autofix for `grid-column`/`grid-row` ([#8023](https://github.com/stylelint/stylelint/pull/8023)) ([@ryo-manba](https://github.com/ryo-manba)).
- `declaration-property-value-no-unknown` false negatives/positives via [`css-tree@3.0.0`](https://github.com/csstree/csstree/releases/tag/v3.0.0) ([#7993](https://github.com/stylelint/stylelint/pull/7993)) ([@Mouvedia](https://github.com/Mouvedia)).
- `declaration-property-value-no-unknown` reported ranges and message ([#8003](https://github.com/stylelint/stylelint/pull/8003)) ([@romainmenke](https://github.com/romainmenke)).
- `keyframe-selector-notation` reported ranges ([#7992](https://github.com/stylelint/stylelint/pull/7992)) ([@romainmenke](https://github.com/romainmenke)).
- `length-zero-no-unit` false positives for Sass variables ([#8035](https://github.com/stylelint/stylelint/pull/8035)) ([@ryo-manba](https://github.com/ryo-manba)).
- `no-descending-specificity` reported ranges ([#7996](https://github.com/stylelint/stylelint/pull/7996)) ([@romainmenke](https://github.com/romainmenke)).
- `selector-anb-no-unmatchable` reported ranges and message ([#8001](https://github.com/stylelint/stylelint/pull/8001)) ([@romainmenke](https://github.com/romainmenke)).
- `string` formatter handling of log symbols for non-Unicode terminals ([#7981](https://github.com/stylelint/stylelint/pull/7981)) ([@Mouvedia](https://github.com/Mouvedia)).
- built `.cjs` files to address Rollup vulnerability ([#8010](https://github.com/stylelint/stylelint/pull/8010)) ([@ybiquitous](https://github.com/ybiquitous)).
- incorrect `config` option for Node.js API with `extends` and `overrides` ([#8030](https://github.com/stylelint/stylelint/pull/8030)) ([@ybiquitous](https://github.com/ybiquitous)).
- stricter validation for the options of `declaration-property-max-values`, `declaration-property-value-no-unknown` and `number-max-precision` ([#7975](https://github.com/stylelint/stylelint/pull/7975)) ([@Mouvedia](https://github.com/Mouvedia)).

## 16.9.0 - 2024-08-28

### Changed

- `secondaryOptions` argument type of the `Rule` function ([#7950](https://github.com/stylelint/stylelint/pull/7950)) ([@Mouvedia](https://github.com/Mouvedia)).

### Fixed

- `color-function-notation` reporting functions with less than 3 arguments ([#7948](https://github.com/stylelint/stylelint/pull/7948)) ([@Mouvedia](https://github.com/Mouvedia)).
- `declaration-property-value-no-unknown` false positives/negatives ([#7944](https://github.com/stylelint/stylelint/pull/7944) & [#7957](https://github.com/stylelint/stylelint/pull/7957) & [#7956](https://github.com/stylelint/stylelint/pull/7956)) ([@Mouvedia](https://github.com/Mouvedia) & [@sidverma32](https://github.com/sidverma32)).
  - false positives: `overflow`, `word-break`, `width`
  - false negatives: `anchor-name`, `field-sizing`, `text-box-edge`, `text-box-trim`, `text-spacing-trim`, `text-wrap`, `text-wrap-mode`, `text-wrap-style`, `view-timeline`, `view-timeline-axis`, `view-timeline-inset`, `view-timeline-name`, `view-transition-name`
- `keyframe-block-no-duplicate-selectors`/`keyframe-declaration-no-important`/`keyframe-selector-notation`/`no-unknown-animations` false negatives for `@-o-keyframes` and `@-ms-keyframes` ([#7953](https://github.com/stylelint/stylelint/pull/7953)) ([@Mouvedia](https://github.com/Mouvedia)).
- `no-duplicate-selectors` reported ranges ([#7938](https://github.com/stylelint/stylelint/pull/7938)) ([@romainmenke](https://github.com/romainmenke)).
- `property-no-vendor-prefix` report for `-webkit-background-size` ([#7940](https://github.com/stylelint/stylelint/pull/7940)) ([@Mouvedia](https://github.com/Mouvedia)).
- `selector-class-pattern` reported ranges ([#7959](https://github.com/stylelint/stylelint/pull/7959)) ([@Mouvedia](https://github.com/Mouvedia)).
- `selector-no-qualifying-type` reported ranges ([#7937](https://github.com/stylelint/stylelint/pull/7937)) ([@romainmenke](https://github.com/romainmenke)).
- honour Node.js `--no-deprecation` flag for rule deprecation warnings ([#7943](https://github.com/stylelint/stylelint/pull/7943)) ([@Mouvedia](https://github.com/Mouvedia)).

## 16.8.2 - 2024-08-15

### Deprecated

- `context.fix` usage in favour of recommending to pass a `fix` callback to `report()` ([#7895](https://github.com/stylelint/stylelint/pull/7895)) ([@Mouvedia](https://github.com/Mouvedia)).

### Added

- deprecation notice annotation to the output of the `github` formatter ([#7909](https://github.com/stylelint/stylelint/pull/7909)) ([@Mouvedia](https://github.com/Mouvedia)).

### Fixed

- `custom-property-no-missing-var-function` false positives for `view-transition-name` ([#7914](https://github.com/stylelint/stylelint/pull/7914)) ([@Mouvedia](https://github.com/Mouvedia)).
- `keyframe-block-no-duplicate-selectors` reported ranges ([#7932](https://github.com/stylelint/stylelint/pull/7932)) ([@romainmenke](https://github.com/romainmenke)).
- `no-invalid-double-slash-comments` reported ranges ([#7907](https://github.com/stylelint/stylelint/pull/7907) & [#7905](https://github.com/stylelint/stylelint/pull/7905)) ([@Mouvedia](https://github.com/Mouvedia) & [@romainmenke](https://github.com/romainmenke)).
- `selector-max-type` reported ranges ([#7916](https://github.com/stylelint/stylelint/pull/7916)) ([@romainmenke](https://github.com/romainmenke)).
- `selector-type-no-unknown` false positives for `::highlight()` and `::view-transition-*()` ([#7913](https://github.com/stylelint/stylelint/pull/7913)) ([@Mouvedia](https://github.com/Mouvedia)).

## 16.8.1 - 2024-07-30

### Fixed

- `no-duplicate-selectors` false positives with Less syntax ([#7888](https://github.com/stylelint/stylelint/pull/7888)) ([@romainmenke](https://github.com/romainmenke)).

## 16.8.0 - 2024-07-29

### Deprecated

- `github` formatter ([#7865](https://github.com/stylelint/stylelint/pull/7865)) ([@marcalexiei](https://github.com/marcalexiei)).

### Fixed

- `function-url-quotes` false positives for SCSS variables and `#`/`?` characters ([#7874](https://github.com/stylelint/stylelint/pull/7874)) ([@vimalloc](https://github.com/vimalloc)).
- `keyframe-selector-notation` false positives for `entry-crossing` and `exit-crossing` ([#7859](https://github.com/stylelint/stylelint/pull/7859)) ([@romainmenke](https://github.com/romainmenke)).
- `no-descending-specificity` false positives for nested rules without declarations ([#7850](https://github.com/stylelint/stylelint/pull/7850)) ([@romainmenke](https://github.com/romainmenke)).
- `no-duplicate-selectors` end positions ([#7867](https://github.com/stylelint/stylelint/pull/7867)) ([@romainmenke](https://github.com/romainmenke)).
- `no-duplicate-selectors` false negatives for three or more duplicates ([#7867](https://github.com/stylelint/stylelint/pull/7867)) ([@romainmenke](https://github.com/romainmenke)).
- `selector-max-compound-selectors` error for `@nest` ([#7875](https://github.com/stylelint/stylelint/pull/7875)) ([@romainmenke](https://github.com/romainmenke)).
- `selector-pseudo-class-no-unknown` false positives for `:active-view-transition` and `:active-view-transition-type()` ([#7868](https://github.com/stylelint/stylelint/pull/7868)) ([@Mouvedia](https://github.com/Mouvedia)).
- `selector-type-*`, `selector-max-type` and `selector-class-pattern` false positives for `<timeline-range-name>` in keyframe selectors ([#7856](https://github.com/stylelint/stylelint/pull/7856)) ([@romainmenke](https://github.com/romainmenke)).
- `stylelint.utils.checkAgainstRule()` regression when `reportNeedlessDisables` and `quiet` are both enabled ([#7879](https://github.com/stylelint/stylelint/pull/7879)) ([@ybiquitous](https://github.com/ybiquitous)).
- configuration comments within selector and value lists being ignored ([#7839](https://github.com/stylelint/stylelint/pull/7839)) ([@romainmenke](https://github.com/romainmenke)).

## 16.7.0 - 2024-07-12

### Changed

- `tap` formatter to support TAP14 ([#7759](https://github.com/stylelint/stylelint/pull/7759)) ([@Mouvedia](https://github.com/Mouvedia)).

### Added

- `url` secondary option ([#7743](https://github.com/stylelint/stylelint/pull/7743)) ([@emmacharp](https://github.com/emmacharp)).

### Fixed

- `at-rule-no-unknown` false positives for `@historical-forms` and `@font-palette-values` ([#7774](https://github.com/stylelint/stylelint/pull/7774)) ([@Mouvedia](https://github.com/Mouvedia)).
- `at-rule-no-unknown` false positives for `@view-transition` ([#7753](https://github.com/stylelint/stylelint/pull/7753)) ([@sebdanielsson](https://github.com/sebdanielsson)).
- `at-rule-no-vendor-prefix` false negatives for `@-moz-document` and `@-webkit-viewport` ([#7772](https://github.com/stylelint/stylelint/pull/7772)) ([@Mouvedia](https://github.com/Mouvedia)).
- `comment-whitespace-inside` end positions ([#7744](https://github.com/stylelint/stylelint/pull/7744)) ([@Mouvedia](https://github.com/Mouvedia)).
- `declaration-block-no-duplicate-properties` reported ranges ([#7758](https://github.com/stylelint/stylelint/pull/7758)) ([@Mouvedia](https://github.com/Mouvedia)).
- `declaration-block-no-redundant-longhand-properties`/`declaration-block-no-shorthand-property-overrides` false negatives for `font-variant` ([#7734](https://github.com/stylelint/stylelint/pull/7734)) ([@Bilie](https://github.com/Bilie)).
- `font-family-name-quotes` false negatives for `-moz-*`/`-webkit-*` keywords ([#7777](https://github.com/stylelint/stylelint/pull/7777)) ([@Mouvedia](https://github.com/Mouvedia)).
- `font-family-no-missing-generic-family-keyword` false negatives for font families which names match a CSS3 `font-variant` keyword ([#7823](https://github.com/stylelint/stylelint/pull/7823)) ([@Mouvedia](https://github.com/Mouvedia)).
- `function-name-case` end positions ([#7747](https://github.com/stylelint/stylelint/pull/7747)) ([@Mouvedia](https://github.com/Mouvedia)).
- `function-no-unknown` performance by reducing file read count ([#7801](https://github.com/stylelint/stylelint/pull/7801)) ([@ybiquitous](https://github.com/ybiquitous)).
- `media-feature-name-no-vendor-prefix` autofix ([#7770](https://github.com/stylelint/stylelint/pull/7770)) ([@Mouvedia](https://github.com/Mouvedia)).
- `no-invalid-double-slash-comments` reported ranges ([#7768](https://github.com/stylelint/stylelint/pull/7768)) ([@Mouvedia](https://github.com/Mouvedia)).
- `property-no-unknown` false positives for `navigation` and miscellaneous legacy properties ([#7764](https://github.com/stylelint/stylelint/pull/7764)) ([@Mouvedia](https://github.com/Mouvedia)).
- `quietDeprecationWarnings` to suppress `stylelint:003` warning ([#7837](https://github.com/stylelint/stylelint/pull/7837)) ([@ybiquitous](https://github.com/ybiquitous)).
- `selector-no-vendor-prefix` autofix ([#7763](https://github.com/stylelint/stylelint/pull/7763)) ([@Mouvedia](https://github.com/Mouvedia)).
- `selector-not-notation` end positions when new lines are part of the selector ([#7755](https://github.com/stylelint/stylelint/pull/7755)) ([@Mouvedia](https://github.com/Mouvedia)).
- `selector-type-case` end positions ([#7752](https://github.com/stylelint/stylelint/pull/7752)) ([@Mouvedia](https://github.com/Mouvedia)).
- `shorthand-property-no-redundant-values` false negatives for logical properties, `overflow`, `overscroll-behavior`, `scroll-margin` and `scroll-padding` ([#7808](https://github.com/stylelint/stylelint/pull/7808)) ([@Mouvedia](https://github.com/Mouvedia)).
- `string-no-newline` false positives for escaped multi-line ([#7818](https://github.com/stylelint/stylelint/pull/7818)) ([@romainmenke](https://github.com/romainmenke)).
- `value-keyword-case` end positions ([#7760](https://github.com/stylelint/stylelint/pull/7760)) ([@Mouvedia](https://github.com/Mouvedia)).
- `stylelint.utils.checkAgainstRule()` for Promise-based rules ([#7821](https://github.com/stylelint/stylelint/pull/7821)) ([@aaronccasanova](https://github.com/aaronccasanova)).
- `stylelint.utils.checkAgainstRule()` to use `result.stylelint` if present ([#7833](https://github.com/stylelint/stylelint/pull/7833)) ([@ybiquitous](https://github.com/ybiquitous)).
- YAML diagnostic block _end marker line_ of the `tap` formatter ([#7759](https://github.com/stylelint/stylelint/pull/7759)) ([@Mouvedia](https://github.com/Mouvedia)).
- autofix of incorrectly implemented plugins when unscoped stylelint commands are present ([#7733](https://github.com/stylelint/stylelint/pull/7733)) ([@romainmenke](https://github.com/romainmenke)).

## 16.6.1 - 2024-05-28

### Fixed

- `no-descending-specificity` false positives for nested selectors ([#7724](https://github.com/stylelint/stylelint/pull/7724)) ([@romainmenke](https://github.com/romainmenke)).
- `selector-type-no-unknown` false positive for `model` ([#7718](https://github.com/stylelint/stylelint/pull/7718)) ([@Mouvedia](https://github.com/Mouvedia)).

## 16.6.0 - 2024-05-24

### Fixed

- `function-calc-no-unspaced-operator` false negatives ([#7655](https://github.com/stylelint/stylelint/pull/7655) & [#7670](https://github.com/stylelint/stylelint/pull/7670) & [#7676](https://github.com/stylelint/stylelint/pull/7676)) ([@ybiquitous](https://github.com/ybiquitous) & [@romainmenke](https://github.com/romainmenke)).
- `selector-not-notation` autofix of the `"simple"` option ([#7703](https://github.com/stylelint/stylelint/pull/7703)) ([@Mouvedia](https://github.com/Mouvedia)).
- `selector-max-specificity` end positions ([#7685](https://github.com/stylelint/stylelint/pull/7685)) ([@romainmenke](https://github.com/romainmenke)).
- `no-descending-specificity` end positions ([#7701](https://github.com/stylelint/stylelint/pull/7701)) ([@romainmenke](https://github.com/romainmenke)).
- missing GitHub Sponsor for `npm fund` ([#7707](https://github.com/stylelint/stylelint/pull/7707)) ([@ybiquitous](https://github.com/ybiquitous)).

## 16.5.0 - 2024-05-02

### Added

- regex support to `ignoreValues` for `value-no-vendor-prefix` ([#7650](https://github.com/stylelint/stylelint/pull/7650)) ([@Mouvedia](https://github.com/Mouvedia)).

### Fixed

- `shorthand-property-no-redundant-values` false negatives for functions ([#7657](https://github.com/stylelint/stylelint/pull/7657)) ([@ybiquitous](https://github.com/ybiquitous)).
- `value-no-vendor-prefix` false negatives/positives ([#7654](https://github.com/stylelint/stylelint/pull/7654) & [#7658](https://github.com/stylelint/stylelint/pull/7658)) ([@Mouvedia](https://github.com/Mouvedia)).
- `CosmiconfigResult` type error ([#7661](https://github.com/stylelint/stylelint/pull/7661)) ([@ybiquitous](https://github.com/ybiquitous)).

## 16.4.0 - 2024-04-23

### Added

- `no-unknown-custom-media` ([#7594](https://github.com/stylelint/stylelint/pull/7594)) ([@fpetrakov](https://github.com/fpetrakov)).
- `ignoreLonghands: []` to `declaration-block-no-redundant-longhand-properties` ([#7611](https://github.com/stylelint/stylelint/pull/7611)) ([@Mouvedia](https://github.com/Mouvedia)).
- `ignore: ["keyframe-selectors"]` to `rule-selector-property-disallowed-list` ([#7572](https://github.com/stylelint/stylelint/pull/7572)) ([@emmacharp](https://github.com/emmacharp)).
- experimental support for post processors ([#7568](https://github.com/stylelint/stylelint/pull/7568)) ([@YuanboXue-Amber](https://github.com/YuanboXue-Amber)).

### Fixed

- `declaration-block-no-redundant-longhand-properties` autofix conflicts ([#7626](https://github.com/stylelint/stylelint/pull/7626)) ([@Mouvedia](https://github.com/Mouvedia)).
- `declaration-block-no-redundant-longhand-properties` autofix for `text-decoration` ([#7611](https://github.com/stylelint/stylelint/pull/7611)) ([@Mouvedia](https://github.com/Mouvedia)).
- `declaration-block-no-shorthand-property-overrides` false negatives for `border` ([#7585](https://github.com/stylelint/stylelint/pull/7585)) ([@fpetrakov](https://github.com/fpetrakov)).
- `declaration-block-no-shorthand-property-overrides` false negatives for `font` and `border` ([#7606](https://github.com/stylelint/stylelint/pull/7606)) ([@Mouvedia](https://github.com/Mouvedia)).
- `function-calc-no-unspaced-operator` false negatives for some math functions ([#7619](https://github.com/stylelint/stylelint/pull/7619)) ([@Mouvedia](https://github.com/Mouvedia)).
- `function-no-unknown` false positives for `anchor`, `anchor-size` and `palette-mix` ([#7607](https://github.com/stylelint/stylelint/pull/7607) & [#7640](https://github.com/stylelint/stylelint/pull/7640)) ([@Mouvedia](https://github.com/Mouvedia)).
- `selector-max-attribute` end positions ([#7592](https://github.com/stylelint/stylelint/pull/7592)) ([@romainmenke](https://github.com/romainmenke)).
- `selector-max-class` end positions ([#7590](https://github.com/stylelint/stylelint/pull/7590)) ([@romainmenke](https://github.com/romainmenke)).
- `selector-max-combinators` end positions ([#7596](https://github.com/stylelint/stylelint/pull/7596)) ([@romainmenke](https://github.com/romainmenke)).
- `selector-max-compound-selectors` end positions ([#7599](https://github.com/stylelint/stylelint/pull/7599)) ([@romainmenke](https://github.com/romainmenke)).
- `selector-max-pseudo-class` end positions ([#7598](https://github.com/stylelint/stylelint/pull/7598)) ([@romainmenke](https://github.com/romainmenke)).
- `selector-max-universal` end positions ([#7597](https://github.com/stylelint/stylelint/pull/7597)) ([@romainmenke](https://github.com/romainmenke)).
- `selector-type-no-unknown` false positives for experimental and deprecated HTML tags ([#7612](https://github.com/stylelint/stylelint/pull/7612)) ([@Mouvedia](https://github.com/Mouvedia)).

## 16.3.1 - 2024-03-26

### Fixed

- `selector-max-id` end positions ([#7571](https://github.com/stylelint/stylelint/pull/7571)) ([@romainmenke](https://github.com/romainmenke)).
- import errors for configs and plugins omitting `/index.js` ([#7578](https://github.com/stylelint/stylelint/pull/7578)) ([@ota-meshi](https://github.com/ota-meshi)).

## 16.3.0 - 2024-03-24

### Added

- `ignoreSelectors: []` to `selector-max-compound-selectors` ([#7544](https://github.com/stylelint/stylelint/pull/7544)) ([@FloEdelmann](https://github.com/FloEdelmann)).
- tally of fixable problems to `string` and `verbose` formatters ([#7539](https://github.com/stylelint/stylelint/pull/7539)) ([@m-allanson](https://github.com/m-allanson)).
- support for `*-deprecation` command-line flags of Node.js ([#7550](https://github.com/stylelint/stylelint/pull/7550)) ([@fpetrakov](https://github.com/fpetrakov)).

### Fixed

- false positive CJS deprecation warning for dual-package plugins ([#7532](https://github.com/stylelint/stylelint/pull/7532)) ([@JounQin](https://github.com/JounQin)).
- `rule-selector-property-disallowed-list` false positives for nesting selectors ([#7558](https://github.com/stylelint/stylelint/pull/7558)) ([@romainmenke](https://github.com/romainmenke)).
- `selector-pseudo-*-allowed-list` false positives for vendor prefixes ([#7525](https://github.com/stylelint/stylelint/pull/7525)) ([@carlosjeurissen](https://github.com/carlosjeurissen)).
- `report()` for `index`/`endIndex` zero values ([#7565](https://github.com/stylelint/stylelint/pull/7565)) ([@romainmenke](https://github.com/romainmenke)).
- `selector-max-type` end positions ([#7518](https://github.com/stylelint/stylelint/pull/7518)) ([@romainmenke](https://github.com/romainmenke)).

## 16.2.1 - 2024-02-01

### Fixed

- report flags not reporting on subsequent runs when cache is used ([#7483](https://github.com/stylelint/stylelint/pull/7483)) ([@ybiquitous](https://github.com/ybiquitous)).
- `custom-property-no-missing-var-function` false positives for properties that can contain author-defined identifiers ([#7478](https://github.com/stylelint/stylelint/pull/7478)) ([@ybiquitous](https://github.com/ybiquitous)).
- `selector-pseudo-class-no-unknown` false positives for `:seeking`, the media loading state and sound state pseudo-classes ([#7490](https://github.com/stylelint/stylelint/pull/7490)) ([@Mouvedia](https://github.com/Mouvedia)).
- `selector-max-specificity` false positives with `ignoreSelectors` option for `of <selector>` syntax ([#7475](https://github.com/stylelint/stylelint/pull/7475)) ([@ybiquitous](https://github.com/ybiquitous)).
- `function-calc-no-unspaced-operator` performance ([#7505](https://github.com/stylelint/stylelint/pull/7505)) ([@ybiquitous](https://github.com/ybiquitous)).
- `validateOptions` to report when secondary option object is an empty object or null ([#7476](https://github.com/stylelint/stylelint/pull/7476)) ([@ybiquitous](https://github.com/ybiquitous)).
- `report()` error message responsibility for a missing node or line number ([#7474](https://github.com/stylelint/stylelint/pull/7474)) ([@ybiquitous](https://github.com/ybiquitous)).

## 16.2.0 - 2024-01-19

### Added

- `media-query-no-invalid` specific problem messages ([#7462](https://github.com/stylelint/stylelint/pull/7462)) ([@romainmenke](https://github.com/romainmenke)).
- `checkContextFunctionalPseudoClasses: []` to `selector-max-id` ([#7380](https://github.com/stylelint/stylelint/pull/7380)) ([@brigitamaria](https://github.com/brigitamaria)).

### Fixed

- `declaration-property-value-no-unknown` false negatives for `@starting-style` ([#7461](https://github.com/stylelint/stylelint/pull/7461)) ([@fpetrakov](https://github.com/fpetrakov)).
- `function-no-unknown|value-keyword-case` false positives for template literals with line breaks ([#7443](https://github.com/stylelint/stylelint/pull/7443)) ([@Sh031224](https://github.com/Sh031224)).
- `allowEmptyInput` option ignored in configuration object regression ([#7446](https://github.com/stylelint/stylelint/pull/7446)) ([@ybiquitous](https://github.com/ybiquitous)).
- `at-rule-no-unknown` false positives for `@starting-style` ([#7438](https://github.com/stylelint/stylelint/pull/7438)) ([@fpetrakov](https://github.com/fpetrakov)).
- `ERR_UNSUPPORTED_ESM_URL_SCHEME` for `--custom-formatter` on Windows ([#7432](https://github.com/stylelint/stylelint/pull/7432)) ([@JounQin](https://github.com/JounQin)).
- `Error: Could not find <package>` message clarity ([#7456](https://github.com/stylelint/stylelint/pull/7456)) ([@jeddy3](https://github.com/jeddy3)).
- `overrides.files` negated pattern regression introduced in 15.0.0 ([#7468](https://github.com/stylelint/stylelint/pull/7468)) ([@ybiquitous](https://github.com/ybiquitous)).

## 16.1.0 - 2023-12-25

### Added

- `lightness-notation` rule ([#7366](https://github.com/stylelint/stylelint/pull/7366)) ([@fpetrakov](https://github.com/fpetrakov)).
- `ignore: ["keyframe-selectors"]` to `selector-disallowed-list` ([#7417](https://github.com/stylelint/stylelint/pull/7417)) ([@mattxwang](https://github.com/mattxwang)).

### Fixed

- `selector-pseudo-class-no-unknown` false positive for `:popover-open` ([#7425](https://github.com/stylelint/stylelint/pull/7425)) ([@mattxwang](https://github.com/mattxwang)).
- `declaration-property-value-no-unknown` and other false positives for multiline SCSS interpolation. ([#7406](https://github.com/stylelint/stylelint/pull/7406)) ([@FloEdelmann](https://github.com/FloEdelmann)).
- `function-url-quotes` false positives for SCSS variable and `@` character ([#7416](https://github.com/stylelint/stylelint/pull/7416)) ([@mattxwang](https://github.com/mattxwang)).

## 16.0.2 - 2023-12-11

### Fixed

- `ERR_UNSUPPORTED_ESM_URL_SCHEME` error on Windows ([#7383](https://github.com/stylelint/stylelint/pull/7383)) ([@JounQin](https://github.com/JounQin)).

## 16.0.1 - 2023-12-08

### Fixed

- type definitions for CommonJS and ESM compatibility ([#7377](https://github.com/stylelint/stylelint/pull/7377)) ([@remcohaszing](https://github.com/remcohaszing)).

## 16.0.0 - 2023-12-08

[Migrating to `16.0.0` guide](docs/migration-guide/to-16.md).

### Removed

- Node.js less than 18.12.0 support ([#7020](https://github.com/stylelint/stylelint/pull/7020)) ([@ybiquitous](https://github.com/ybiquitous)).
- 76 rules deprecated in 15.0.0 ([#6979](https://github.com/stylelint/stylelint/pull/6979)) ([@mattxwang](https://github.com/mattxwang)).

### Changed

- `stylelint.formatters` object to have `Promise` values ([#7184](https://github.com/stylelint/stylelint/pull/7184)) ([@ybiquitous](https://github.com/ybiquitous)).
- exit code for CLI flag error ([#7134](https://github.com/stylelint/stylelint/pull/7134)) ([@ybiquitous](https://github.com/ybiquitous)).
- default syntax behaviour to always use safe-parser with `fix` regardless of extension ([#7357](https://github.com/stylelint/stylelint/pull/7357)) ([@ybiquitous](https://github.com/ybiquitous)).
- TypeScript definitions for ESM ([#7309](https://github.com/stylelint/stylelint/pull/7309)) ([@ybiquitous](https://github.com/ybiquitous)).
- `stylelint.rules` object to have `Promise` values ([#7279](https://github.com/stylelint/stylelint/pull/7279)) ([@ybiquitous](https://github.com/ybiquitous)).
- `stylelint.utils.checkAgainstRule` to be an async function ([#7339](https://github.com/stylelint/stylelint/pull/7339)) ([@ybiquitous](https://github.com/ybiquitous)).
- `.js` extension to `.mjs` and `.cjs` ([#7307](https://github.com/stylelint/stylelint/pull/7307)) ([@ybiquitous](https://github.com/ybiquitous)).

### Deprecated

- CommonJS Node.js API ([#7353](https://github.com/stylelint/stylelint/pull/7353)) ([@ybiquitous](https://github.com/ybiquitous)).
- `output` property in a Node.js API returned object. Instead, `report`/`code` properties are recommended ([#7183](https://github.com/stylelint/stylelint/pull/7183)) ([@ybiquitous](https://github.com/ybiquitous)) & ([@haocheng6](https://github.com/haocheng6)).

### Added

- `exports` field to `package.json` for Conditional Exports (ESM/CommonJS) ([#7307](https://github.com/stylelint/stylelint/pull/7307)) ([@ybiquitous](https://github.com/ybiquitous)).
- support for ESM plugins ([#7339](https://github.com/stylelint/stylelint/pull/7339)) ([@ybiquitous](https://github.com/ybiquitous)).
- support for ESM custom formatters ([#7343](https://github.com/stylelint/stylelint/pull/7343)) ([@ybiquitous](https://github.com/ybiquitous)).
- support for a package name as arguments to `--custom-formatter` ([#7343](https://github.com/stylelint/stylelint/pull/7343)) ([@ybiquitous](https://github.com/ybiquitous)).
- `severity` secondary option's function support ([#7202](https://github.com/stylelint/stylelint/pull/7202)) ([@kizu](https://github.com/kizu)).
- support for a `Promise` formatter function ([#7184](https://github.com/stylelint/stylelint/pull/7184)) ([@ybiquitous](https://github.com/ybiquitous)).
- support for ESM custom syntaxes ([#7351](https://github.com/stylelint/stylelint/pull/7351)) ([@ybiquitous](https://github.com/ybiquitous)).
- `report`/`code` properties to a Node.js API returned object ([#7183](https://github.com/stylelint/stylelint/pull/7183)) ([@ybiquitous](https://github.com/ybiquitous)) & ([@haocheng6](https://github.com/haocheng6)).

### Fixed

- no longer needed workaround for Cosmiconfig segfault ([#7329](https://github.com/stylelint/stylelint/pull/7329)) ([@ybiquitous](https://github.com/ybiquitous)).
- CLI regression to avoid waiting for stdin without any input ([#7131](https://github.com/stylelint/stylelint/pull/7131)) ([@ybiquitous](https://github.com/ybiquitous)).
- CLI to avoid different outputs on empty files and empty stdin ([#7131](https://github.com/stylelint/stylelint/pull/7131)) ([@ybiquitous](https://github.com/ybiquitous)).

## 15.11.0 - 2023-10-17

### Added

- `ignoreRules` to `max-nesting-depth` ([#7215](https://github.com/stylelint/stylelint/pull/7215)) ([@mattxwang](https://github.com/mattxwang)).

### Fixed

- `declaration-block-no-redundant-longhand-properties` autofix for `grid-template` with `repeat()` ([#7230](https://github.com/stylelint/stylelint/pull/7230)) ([@mattxwang](https://github.com/mattxwang)).
- `declaration-block-no-redundant-longhand-properties` false negative for `font-synthesis` ([#7214](https://github.com/stylelint/stylelint/pull/7214)) ([@mattxwang](https://github.com/mattxwang)).
- `declaration-block-no-redundant-longhand-properties` false negatives for `*-block` and `*-inline` logical properties ([#7208](https://github.com/stylelint/stylelint/pull/7208)) ([@mattxwang](https://github.com/mattxwang)).
- `declaration-block-no-redundant-longhand-properties` false negatives for `overflow`, `overscroll-behavior`, `scroll-margin`, `scroll-padding`, and new Box Alignment shorthands ([#7213](https://github.com/stylelint/stylelint/pull/7213)) ([@mattxwang](https://github.com/mattxwang)).
- `function-no-unknown` false positives for `light-dark`, `linear` and `xywh` ([#7242](https://github.com/stylelint/stylelint/pull/7242)) ([@mattxwang](https://github.com/mattxwang)).

## 15.10.3 - 2023-08-18

### Fixed

- `declaration-property-value-no-unknown` false negatives for typed custom properties ([#7078](https://github.com/stylelint/stylelint/pull/7078)) ([@romainmenke](https://github.com/romainmenke)).
- `property-no-unknown` false positives for scroll-driven animations ([#7090](https://github.com/stylelint/stylelint/pull/7090)) ([@renato-bohler](https://github.com/renato-bohler)).

## 15.10.2 - 2023-07-19

### Fixed

- `declaration-property-value-no-unknown` false negatives for nested declarations ([#7079](https://github.com/stylelint/stylelint/pull/7079)) ([@romainmenke](https://github.com/romainmenke)).
- `selector-pseudo-element-no-unknown` false positives for `view-transition` pseudo-elements ([#7070](https://github.com/stylelint/stylelint/pull/7070)) ([@danielroe](https://github.com/danielroe)).

## 15.10.1 - 2023-07-06

### Security

- fix for `semver` vulnerability ([#7043](https://github.com/stylelint/stylelint/pull/7043)) ([@romainmenke](https://github.com/romainmenke)).

### Fixed

- invalid option regression on Windows 10 ([#7043](https://github.com/stylelint/stylelint/pull/7043)) ([@romainmenke](https://github.com/romainmenke)).

## 15.10.0 - 2023-07-04

### Added

- `media-query-no-invalid` ([#6963](https://github.com/stylelint/stylelint/pull/6963)) ([@romainmenke](https://github.com/romainmenke)).
- support for JS objects with `extends` config option ([#6998](https://github.com/stylelint/stylelint/pull/6998)) ([@fpetrakov](https://github.com/fpetrakov)).

### Fixed

- inconsistent `errored` properties in `stylelint.lint()` return value ([#6983](https://github.com/stylelint/stylelint/pull/6983)) ([@ybiquitous](https://github.com/ybiquitous)).
- `{selector,value}-no-vendor-prefix` performance ([#7016](https://github.com/stylelint/stylelint/pull/7016)) ([@jeddy3](https://github.com/jeddy3)).
- `custom-property-pattern` performance ([#7009](https://github.com/stylelint/stylelint/pull/7009)) ([@jeddy3](https://github.com/jeddy3)).
- `function-linear-gradient-no-nonstandard-direction` false positives for `<color-interpolation-method>` ([#6987](https://github.com/stylelint/stylelint/pull/6987)) ([@romainmenke](https://github.com/romainmenke)).
- `function-name-case` performance ([#7010](https://github.com/stylelint/stylelint/pull/7010)) ([@jeddy3](https://github.com/jeddy3)).
- `function-no-unknown` performance ([#7004](https://github.com/stylelint/stylelint/pull/7004)) ([@jeddy3](https://github.com/jeddy3)).
- `function-url-quotes` performance ([#7011](https://github.com/stylelint/stylelint/pull/7011)) ([@jeddy3](https://github.com/jeddy3)).
- `hue-degree-notation` false negatives for `oklch` ([#7015](https://github.com/stylelint/stylelint/pull/7015)) ([@romainmenke](https://github.com/romainmenke)).
- `hue-degree-notation` performance ([#7012](https://github.com/stylelint/stylelint/pull/7012)) ([@jeddy3](https://github.com/jeddy3)).
- `media-feature-name-no-unknown` false positives for `environment-blending`, `nav-controls`, `prefers-reduced-data`, and `video-color-gamut` ([#6978](https://github.com/stylelint/stylelint/pull/6978)) ([@romainmenke](https://github.com/romainmenke)).
- `media-feature-name-no-vendor-prefix` positions for `*-device-pixel-ratio` ([#6977](https://github.com/stylelint/stylelint/pull/6977)) ([@romainmenke](https://github.com/romainmenke)).
- `no-descending-specificity` performance ([#7026](https://github.com/stylelint/stylelint/pull/7026)) ([@romainmenke](https://github.com/romainmenke)).
- `no-duplicate-at-import-rules` false negatives for imports with `supports` and `layer` conditions ([#7001](https://github.com/stylelint/stylelint/pull/7001)) ([@romainmenke](https://github.com/romainmenke)).
- `selector-anb-no-unmatchable` performance ([#7042](https://github.com/stylelint/stylelint/pull/7042)) ([@romainmenke](https://github.com/romainmenke)).
- `selector-id-pattern` performance ([#7013](https://github.com/stylelint/stylelint/pull/7013)) ([@jeddy3](https://github.com/jeddy3)).
- `selector-pseudo-class-no-unknown` false negatives for pseudo-elements with matching names ([#6964](https://github.com/stylelint/stylelint/pull/6964)) ([@Mouvedia](https://github.com/Mouvedia)).
- `selector-pseudo-element-no-unknown` performance ([#7007](https://github.com/stylelint/stylelint/pull/7007)) ([@jeddy3](https://github.com/jeddy3)).
- `selector-type-case` performance ([#7041](https://github.com/stylelint/stylelint/pull/7041)) ([@romainmenke](https://github.com/romainmenke)).
- `selector-type-no-unknown` performance ([#7027](https://github.com/stylelint/stylelint/pull/7027)) ([@romainmenke](https://github.com/romainmenke)).
- `unit-disallowed-list` false negatives with percentages ([#7018](https://github.com/stylelint/stylelint/pull/7018)) ([@romainmenke](https://github.com/romainmenke)).

## 15.9.0 - 2023-06-23

### Added

- `insideFunctions: {"function": int}` to `number-max-precision` ([#6932](https://github.com/stylelint/stylelint/pull/6932)) ([@romainmenke](https://github.com/romainmenke)).

### Fixed

- `declaration-block-no-redundant-longhand-properties` autofix for `border-radius` shorthand ([#6958](https://github.com/stylelint/stylelint/pull/6958)) ([@mattxwang](https://github.com/mattxwang)).
- `declaration-block-no-redundant-longhand-properties` autofix for `border-width` shorthand ([#6956](https://github.com/stylelint/stylelint/pull/6956)) ([@mattxwang](https://github.com/mattxwang)).
- `declaration-block-no-redundant-longhand-properties` autofix for `grid-column` and `grid-row` ([#6957](https://github.com/stylelint/stylelint/pull/6957)) ([@mattxwang](https://github.com/mattxwang)).

## 15.8.0 - 2023-06-17

### Added

- `media-feature-name-value-no-unknown` ([#6906](https://github.com/stylelint/stylelint/pull/6906)) ([@romainmenke](https://github.com/romainmenke)).
- support for `.mjs` configuration files ([#6910](https://github.com/stylelint/stylelint/pull/6910)) ([@ybiquitous](https://github.com/ybiquitous)).

### Fixed

- `--print-config` description in CLI help ([#6914](https://github.com/stylelint/stylelint/pull/6914)) ([@ybiquitous](https://github.com/ybiquitous)).
- `allowEmptyInput` option in configuration files ([#6929](https://github.com/stylelint/stylelint/pull/6929)) ([@ybiquitous](https://github.com/ybiquitous)).
- `custom-property-no-missing-var-function` performance ([#6922](https://github.com/stylelint/stylelint/pull/6922)) ([@romainmenke](https://github.com/romainmenke)).
- `function-calc-no-unspaced-operator` performance ([#6923](https://github.com/stylelint/stylelint/pull/6923)) ([@romainmenke](https://github.com/romainmenke)).
- `function-linear-gradient-no-nonstandard-direction` performance ([#6924](https://github.com/stylelint/stylelint/pull/6924)) ([@romainmenke](https://github.com/romainmenke)).
- `function-no-unknown` false positives for SCSS functions with namespace ([#6921](https://github.com/stylelint/stylelint/pull/6921)) ([@romainmenke](https://github.com/romainmenke)).
- `max-nesting-depth` error for at-rules in Sass syntax ([#6909](https://github.com/stylelint/stylelint/pull/6909)) ([@ybiquitous](https://github.com/ybiquitous)).
- `selector-anb-no-unmatchable` performance ([#6925](https://github.com/stylelint/stylelint/pull/6925)) ([@romainmenke](https://github.com/romainmenke)).
- remove `v8-compile-cache` dependency ([#6907](https://github.com/stylelint/stylelint/pull/6907)) ([@ybiquitous](https://github.com/ybiquitous)).

## 15.7.0 - 2023-06-05

### Added

- `splitList: boolean` to `selector-nested-pattern` ([#6896](https://github.com/stylelint/stylelint/pull/6896)) ([@is2ei](https://github.com/is2ei)).

### Fixed

- `unit-no-unknown` false positives for `unicode-range` descriptors ([#6892](https://github.com/stylelint/stylelint/pull/6892)) ([@romainmenke](https://github.com/romainmenke)).
- segmentation fault errors for Cosmiconfig 8.2 ([#6902](https://github.com/stylelint/stylelint/pull/6902)) ([@romainmenke](https://github.com/romainmenke)).

## 15.6.3 - 2023-06-03

### Fixed

- `alpha-value-notation` false positives for `color()` ([#6885](https://github.com/stylelint/stylelint/pull/6885)) ([@romainmenke](https://github.com/romainmenke)).
- `alpha-value-notation` performance with improved benchmark script ([#6864](https://github.com/stylelint/stylelint/pull/6864)) ([@romainmenke](https://github.com/romainmenke)).
- `at-rule-property-required-list` performance ([#6865](https://github.com/stylelint/stylelint/pull/6865)) ([@romainmenke](https://github.com/romainmenke)).
- `color-*` performance ([#6868](https://github.com/stylelint/stylelint/pull/6868)) ([@romainmenke](https://github.com/romainmenke)).
- `length-zero-no-unit` false positives on new math functions ([#6871](https://github.com/stylelint/stylelint/pull/6871)) ([@romainmenke](https://github.com/romainmenke)).
- `string` formatter for unexpected truncation on non-ASCII characters ([#6861](https://github.com/stylelint/stylelint/pull/6861)) ([@Max10240](https://github.com/Max10240)).
- `unit-no-unknown` false positives for the second and subsequent `image-set()` with `x` descriptor ([#6879](https://github.com/stylelint/stylelint/pull/6879)) ([@romainmenke](https://github.com/romainmenke)).

## 15.6.2 - 2023-05-16

### Fixed

- `alpha-value-notation` false negatives for `oklab()`, `oklch()`, and `color()` ([#6844](https://github.com/stylelint/stylelint/pull/6844)) ([@romainmenke](https://github.com/romainmenke)).
- `declaration-block-no-redundant-longhand-properties` autofix with `cubic-bezier()` ([#6841](https://github.com/stylelint/stylelint/pull/6841)) ([@romainmenke](https://github.com/romainmenke)).
- `function-no-unknown` false positives for unspaced operators against nested brackets ([#6842](https://github.com/stylelint/stylelint/pull/6842)) ([@romainmenke](https://github.com/romainmenke)).
- `function-url-quotes` false positives for SCSS `with()` construct ([#6847](https://github.com/stylelint/stylelint/pull/6847)) ([@ybiquitous](https://github.com/ybiquitous)).
- `media-feature-name-no-unknown` false positives for `not` and `or` ([#6838](https://github.com/stylelint/stylelint/pull/6838)) ([@romainmenke](https://github.com/romainmenke)).

## 15.6.1 - 2023-05-02

### Fixed

- `declaration-block-no-redundant-longhand-properties` autofix for `transition` ([#6815](https://github.com/stylelint/stylelint/pull/6815)) ([@mattxwang](https://github.com/mattxwang)).
- `github` formatter for missing final newline ([#6822](https://github.com/stylelint/stylelint/pull/6822)) ([@konomae](https://github.com/konomae)).
- `selector-pseudo-class-no-unknown` false positive for `:modal` ([#6811](https://github.com/stylelint/stylelint/pull/6811)) ([@Yasir761](https://github.com/Yasir761)).

## 15.6.0 - 2023-04-23

### Added

- `allowEmptyInput`, `cache`, `fix` options to configuration object ([#6778](https://github.com/stylelint/stylelint/pull/6778)) ([@mattxwang](https://github.com/mattxwang)).
- `ignore: ["with-var-inside"]` to `color-function-notation` ([#6802](https://github.com/stylelint/stylelint/pull/6802)) ([@mattxwang](https://github.com/mattxwang)).

### Fixed

- `declaration-block-no-duplicate-properties` autofix for 3 or more duplicates ([#6801](https://github.com/stylelint/stylelint/pull/6801)) ([@mattxwang](https://github.com/mattxwang)).
- `declaration-block-no-duplicate-properties` false positives with option `ignore: ["consecutive-duplicates-with-different-syntaxes"]` ([#6797](https://github.com/stylelint/stylelint/pull/6797)) ([@romainmenke](https://github.com/romainmenke)).
- `declaration-block-no-duplicate-properties` syntax error ([#6792](https://github.com/stylelint/stylelint/pull/6792)) ([@yoyo837](https://github.com/yoyo837)).
- `declaration-block-no-redundant-longhand-properties` autofix for `grid-template` ([#6777](https://github.com/stylelint/stylelint/pull/6777)) ([@mattxwang](https://github.com/mattxwang)).
- `function-url-quotes` autofix for comments in SCSS function ([#6800](https://github.com/stylelint/stylelint/pull/6800)) ([@ybiquitous](https://github.com/ybiquitous)).

## 15.5.0 - 2023-04-16

### Added

- `ignore: ["consecutive-duplicates-with-different-syntaxes"]` to `declaration-block-no-duplicate-properties` ([#6772](https://github.com/stylelint/stylelint/pull/6772)) ([@kimulaco](https://github.com/kimulaco)).
- `ignoreProperties: []` to `declaration-block-no-duplicate-custom-properties` ([#6773](https://github.com/stylelint/stylelint/pull/6773)) ([@mattxwang](https://github.com/mattxwang)).
- raw regex support to `ignoreProperties` for `declaration-block-no-duplicate-properties` ([#6764](https://github.com/stylelint/stylelint/pull/6764)) ([@ybiquitous](https://github.com/ybiquitous)).

### Fixed

- `block-no-empty` false positives with non-whitespace characters ([#6782](https://github.com/stylelint/stylelint/pull/6782)) ([@ybiquitous](https://github.com/ybiquitous)).
- `color-function-notation` false positives for namespaced imports ([#6774](https://github.com/stylelint/stylelint/pull/6774)) ([@mattxwang](https://github.com/mattxwang)).
- `custom-property-empty-line-before` false positives for CSS-in-JS ([#6767](https://github.com/stylelint/stylelint/pull/6767)) ([@ybiquitous](https://github.com/ybiquitous)).
- `media-feature-range-notation` parse error ([#6760](https://github.com/stylelint/stylelint/pull/6760)) ([@fpetrakov](https://github.com/fpetrakov)).
- CLI help improvements ([#6783](https://github.com/stylelint/stylelint/pull/6783)) ([@ybiquitous](https://github.com/ybiquitous)).

## 15.4.0 - 2023-04-01

### Added

- `--quiet-deprecation-warnings` flag ([#6724](https://github.com/stylelint/stylelint/pull/6724)) ([@mattxwang](https://github.com/mattxwang)).
- `-c` alias for `--config` ([#6720](https://github.com/stylelint/stylelint/pull/6720)) ([@sidverma32](https://github.com/sidverma32)).
- `media-feature-range-notation` autofix ([#6742](https://github.com/stylelint/stylelint/pull/6742)) ([@romainmenke](https://github.com/romainmenke)).
- `no-unknown-custom-properties` rule ([#6731](https://github.com/stylelint/stylelint/pull/6731)) ([@jameschensmith](https://github.com/jameschensmith)).

### Fixed

- `function-url-quotes` autofix for double-slash comments in SCSS maps ([#6745](https://github.com/stylelint/stylelint/pull/6745)) ([@jgerigmeyer](https://github.com/jgerigmeyer)).
- `isPathIgnored()` utility's performance ([#6728](https://github.com/stylelint/stylelint/pull/6728)) ([@ybiquitous](https://github.com/ybiquitous)).
- `rule-selector-property-disallowed-list` secondary options ([#6723](https://github.com/stylelint/stylelint/pull/6723)) ([@mattxwang](https://github.com/mattxwang)).
- `declaration-block-no-redundant-longhand-properties` with basic keywords ([#6748](https://github.com/stylelint/stylelint/pull/6748)) ([@mattxwang](https://github.com/mattxwang)).
- deprecation warnings for disabled rules ([#6747](https://github.com/stylelint/stylelint/pull/6747)) ([@ybiquitous](https://github.com/ybiquitous)).

## 15.3.0 - 2023-03-16

### Added

- `configurationComment` configuration property ([#6629](https://github.com/stylelint/stylelint/pull/6629)) ([@ifitzpatrick](https://github.com/ifitzpatrick)).
- `selector-anb-no-unmatchable` rule ([#6678](https://github.com/stylelint/stylelint/pull/6678)) ([@mattxwang](https://github.com/mattxwang)).

### Fixed

- TypeScript error for CommonJS importing ([#6703](https://github.com/stylelint/stylelint/pull/6703)) ([@remcohaszing](https://github.com/remcohaszing)).
- `*-no-redundant-*` false negatives for `inset` shorthand ([#6699](https://github.com/stylelint/stylelint/pull/6699)) ([@rayrw](https://github.com/rayrw)).
- `function-url-quotes` autofix for multiple `url()` ([#6711](https://github.com/stylelint/stylelint/pull/6711)) ([@ybiquitous](https://github.com/ybiquitous)).
- `value-keyword-case` false positives for Level 4 system colours ([#6712](https://github.com/stylelint/stylelint/pull/6712)) ([@thewilkybarkid](https://github.com/thewilkybarkid)).

## 15.2.0 - 2023-02-19

### Added

- `messageArgs` to 76 rules ([#6589](https://github.com/stylelint/stylelint/pull/6589)) ([@kizu](https://github.com/kizu)).

### Fixed

- TypeScript error to export `Plugin` and `RuleContext` ([#6664](https://github.com/stylelint/stylelint/pull/6664)) ([@henryruhs](https://github.com/henryruhs)).
- `overrides.extends` order when including same rules ([#6660](https://github.com/stylelint/stylelint/pull/6660)) ([@kuoruan](https://github.com/kuoruan)).
- `annotation-no-unknown` false positives for CSS-in-JS template literals ([#6666](https://github.com/stylelint/stylelint/pull/6666)) ([@hudochenkov](https://github.com/hudochenkov)).
- `declaration-property-value-no-unknown` false positives for at-rule descriptors ([#6669](https://github.com/stylelint/stylelint/pull/6669)) ([@FloEdelmann](https://github.com/FloEdelmann)).
- `declaration-property-value-no-unknown` parse error for `alpha(opacity=n)` to report as violation ([#6650](https://github.com/stylelint/stylelint/pull/6650)) ([@romainmenke](https://github.com/romainmenke)).
- `function-name-case` false positives for CSS-in-JS template literals ([#6666](https://github.com/stylelint/stylelint/pull/6666)) ([@hudochenkov](https://github.com/hudochenkov)).
- `function-no-unknown` false positives for CSS-in-JS template literals ([#6666](https://github.com/stylelint/stylelint/pull/6666)) ([@hudochenkov](https://github.com/hudochenkov)).
- `unit-no-unknown` false positives for CSS-in-JS template literals ([#6666](https://github.com/stylelint/stylelint/pull/6666)) ([@hudochenkov](https://github.com/hudochenkov)).
- `value-keyword-case` false positives for CSS-in-JS template literals ([#6666](https://github.com/stylelint/stylelint/pull/6666)) ([@hudochenkov](https://github.com/hudochenkov)).

## 15.1.0 - 2023-02-11

### Added

- `declaration-block-no-redundant-longhand-properties` autofix ([#6580](https://github.com/stylelint/stylelint/pull/6580)) ([@mattxwang](https://github.com/mattxwang)).

### Fixed

- `declaration-property-value-no-unknown` false positives for `env()` ([#6646](https://github.com/stylelint/stylelint/pull/6646)) ([@romainmenke](https://github.com/romainmenke)).
- `function-calc-no-unspaced-operator` TypeError on empty `calc()` ([#6634](https://github.com/stylelint/stylelint/pull/6634)) ([@romainmenke](https://github.com/romainmenke)).
- inaccurate `customSyntax` inference ([#6645](https://github.com/stylelint/stylelint/pull/6645)) ([@ybiquitous](https://github.com/ybiquitous)).

## 15.0.0 - 2023-02-09

[Migrating to `15.0.0` guide](docs/migration-guide/to-15.md).

### Removed

- Node.js 12 support ([#6477](https://github.com/stylelint/stylelint/pull/6477)) ([@ybiquitous](https://github.com/ybiquitous)). (BREAKING)
- support for processors ([#6479](https://github.com/stylelint/stylelint/pull/6479)) ([@ybiquitous](https://github.com/ybiquitous)). (BREAKING)
- `syntax` option ([#6420](https://github.com/stylelint/stylelint/pull/6420)) ([@fpetrakov](https://github.com/fpetrakov)). (BREAKING)

### Changed

- `extends` in `overrides` to merge to be consistent with `plugins` behaviour ([#6380](https://github.com/stylelint/stylelint/pull/6380)) ([@jasikpark](https://github.com/jasikpark)). (BREAKING)
- type definitions to reorganize ([#6510](https://github.com/stylelint/stylelint/pull/6510)) ([@ybiquitous](https://github.com/ybiquitous)). (BREAKING)
- type names to be more consistent ([#6503](https://github.com/stylelint/stylelint/pull/6503)) ([@ybiquitous](https://github.com/ybiquitous)). (BREAKING)

### Deprecated

- stylistic rules handled by Prettier ([#6504](https://github.com/stylelint/stylelint/pull/6504)) ([@ybiquitous](https://github.com/ybiquitous)).

### Added

- `declaration-property-value-no-unknown` rule ([#6511](https://github.com/stylelint/stylelint/pull/6511)) ([@jeddy3](https://github.com/jeddy3)).
- `media-feature-name-unit-allowed-list` rule ([#6550](https://github.com/stylelint/stylelint/pull/6550)) ([@mattxwang](https://github.com/mattxwang)).
- `function-url-quotes` autofix ([#6558](https://github.com/stylelint/stylelint/pull/6558)) ([@mattxwang](https://github.com/mattxwang)).
- `ignore: ["custom-elements"]` to `selector-max-type` ([#6588](https://github.com/stylelint/stylelint/pull/6588)) ([@muddv](https://github.com/muddv)).
- `ignoreFunctions: []` to `unit-disallowed-list` ([#6592](https://github.com/stylelint/stylelint/pull/6592)) ([@mattxwang](https://github.com/mattxwang)).
- deprecated rule warnings ([#6561](https://github.com/stylelint/stylelint/pull/6561)) ([@ybiquitous](https://github.com/ybiquitous)).
- message arguments to `declaration-property-unit-allowed-list` ([#6570](https://github.com/stylelint/stylelint/pull/6570)) ([@mattxwang](https://github.com/mattxwang)).

### Fixed

- `overrides.files` in config to allow basename glob patterns ([#6547](https://github.com/stylelint/stylelint/pull/6547)) ([@ybiquitous](https://github.com/ybiquitous)).
- `at-rule-no-unknown` false positives for `@scroll-timeline` ([#6554](https://github.com/stylelint/stylelint/pull/6554)) ([@mattxwang](https://github.com/mattxwang)).
- `function-no-unknown` false positives for interpolation and backticks in CSS-in-JS ([#6565](https://github.com/stylelint/stylelint/pull/6565)) ([@hudochenkov](https://github.com/hudochenkov)).
- `keyframe-selector-notation` false positives for named timeline ranges ([#6605](https://github.com/stylelint/stylelint/pull/6605)) ([@kimulaco](https://github.com/kimulaco)).
- `property-no-unknown` false negatives for newer custom syntaxes ([#6553](https://github.com/stylelint/stylelint/pull/6553)) ([@43081j](https://github.com/43081j)).
- `selector-attribute-quotes` false positives for "never" ([#6571](https://github.com/stylelint/stylelint/pull/6571)) ([@mattxwang](https://github.com/mattxwang)).
- `selector-not-notation` autofix for "simple" option ([#6608](https://github.com/stylelint/stylelint/pull/6608)) ([@Mouvedia](https://github.com/Mouvedia)).

## 14.16.1 - 2022-12-29

### Fixed

- `customSyntax` resolution with `configBasedir` ([#6536](https://github.com/stylelint/stylelint/pull/6536)) ([@ybiquitous](https://github.com/ybiquitous)).
- `declaration-block-no-duplicate-properties` autofix for `!important` ([#6528](https://github.com/stylelint/stylelint/pull/6528)) ([@sidx1024](https://github.com/sidx1024)).
- `function-no-unknown` false positives for `scroll`, `-webkit-gradient`, `color-stop`, `from`, and `to` ([#6539](https://github.com/stylelint/stylelint/pull/6539)) ([@Mouvedia](https://github.com/Mouvedia)).
- `value-keyword-case` false positives for mixed case `ignoreFunctions` option ([#6517](https://github.com/stylelint/stylelint/pull/6517)) ([@kimulaco](https://github.com/kimulaco)).
- unexpected `output` in Node.js API lint result when any rule contains `disableFix: true` ([#6543](https://github.com/stylelint/stylelint/pull/6543)) ([@adrianjost](https://github.com/adrianjost)).

## 14.16.0 - 2022-12-03

### Added

- `media-feature-range-notation` rule ([#6497](https://github.com/stylelint/stylelint/pull/6497)) ([@jeddy3](https://github.com/jeddy3)).
- support for plugin objects as config values ([#6481](https://github.com/stylelint/stylelint/pull/6481)) ([@phoenisx](https://github.com/phoenisx)).

### Fixed

- incorrect output by all formatters except for `json` ([#6480](https://github.com/stylelint/stylelint/pull/6480)) ([@ybiquitous](https://github.com/ybiquitous)).

## 14.15.0 - 2022-11-13

### Added

- `--globby-options` flag ([#6437](https://github.com/stylelint/stylelint/pull/6437)) ([@sidverma32](https://github.com/sidverma32)).
- custom message formatting for `at-rule-disallowed-list`, `declaration-property-unit-disallowed-list`, `declaration-property-value-disallowed-list`, `function-disallowed-list`, and `property-disallowed-list` ([#6463](https://github.com/stylelint/stylelint/pull/6463)) ([@chloerice](https://github.com/chloerice)).
- support autofix with `checkAgainstRule` ([#6466](https://github.com/stylelint/stylelint/pull/6466)) ([@aaronccasanova](https://github.com/aaronccasanova)).
- support for reporting with custom severity ([#6444](https://github.com/stylelint/stylelint/pull/6444)) ([@aaronccasanova](https://github.com/aaronccasanova)).
- support to `checkAgainstRule` with custom rules ([#6460](https://github.com/stylelint/stylelint/pull/6460)) ([@aaronccasanova](https://github.com/aaronccasanova)).

### Fixed

- tally output of `string` formatter colorized ([#6443](https://github.com/stylelint/stylelint/pull/6443)) ([@ybiquitous](https://github.com/ybiquitous)).
- usage of the `import-lazy` package to fit bundlers ([#6449](https://github.com/stylelint/stylelint/pull/6449)) ([@phoenisx](https://github.com/phoenisx)).

## 14.14.1 - 2022-11-03

### Fixed

- `declaration-block-no-redundant-longhand-properties` false positives for `inherit` keyword ([#6419](https://github.com/stylelint/stylelint/pull/6419)) ([@kimulaco](https://github.com/kimulaco)).
- `shorthand-property-no-redundant-values` message to be consistent ([#6417](https://github.com/stylelint/stylelint/pull/6417)) ([@fpetrakov](https://github.com/fpetrakov)).
- `unit-no-unknown` false positives for `*vi` & `*vb` viewport units ([#6428](https://github.com/stylelint/stylelint/pull/6428)) ([@sidverma32](https://github.com/sidverma32)).

## 14.14.0 - 2022-10-15

### Added

- `*-pattern` custom message formatting ([#6391](https://github.com/stylelint/stylelint/pull/6391)) ([@ybiquitous](https://github.com/ybiquitous)).

### Fixed

- `block-no-empty` false positives for `reportNeedlessDisables` ([#6381](https://github.com/stylelint/stylelint/pull/6381)) ([@ybiquitous](https://github.com/ybiquitous)).
- `printf`-like formatting for custom messages ([#6389](https://github.com/stylelint/stylelint/pull/6389)) ([@ybiquitous](https://github.com/ybiquitous)).
- `unit-no-unknown` false positives for font-relative length units ([#6374](https://github.com/stylelint/stylelint/pull/6374)) ([@ybiquitous](https://github.com/ybiquitous)).
- false negatives on second run for cache and `severity` option ([#6384](https://github.com/stylelint/stylelint/pull/6384)) ([@kimulaco](https://github.com/kimulaco)).
- TS compilation error due to needless `file-entry-cache` import ([#6393](https://github.com/stylelint/stylelint/pull/6393)) ([@adidahiya](https://github.com/adidahiya)).

## 14.13.0 - 2022-09-28

### Added

- `cacheStrategy` option ([#6357](https://github.com/stylelint/stylelint/pull/6357)) ([@kaorun343](https://github.com/kaorun343)).

### Fixed

- cache refresh when config is changed ([#6356](https://github.com/stylelint/stylelint/pull/6356)) ([@kimulaco](https://github.com/kimulaco)).
- `selector-pseudo-element-no-unknown` false positives for `::highlight` pseudo-element ([#6367](https://github.com/stylelint/stylelint/pull/6367)) ([@jathak](https://github.com/jathak)).

## 14.12.1 - 2022-09-21

### Fixed

- `font-weight-notation` messages ([#6350](https://github.com/stylelint/stylelint/pull/6350)) ([@ybiquitous](https://github.com/ybiquitous)).
- type declarations for custom message arguments ([#6354](https://github.com/stylelint/stylelint/pull/6354)) ([@stof](https://github.com/stof)).

## 14.12.0 - 2022-09-18

### Added

- support for multiple `--ignore-path` flags ([#6345](https://github.com/stylelint/stylelint/pull/6345)) ([@kimulaco](https://github.com/kimulaco)).
- experimental support for custom message arguments ([#6312](https://github.com/stylelint/stylelint/pull/6312)) ([@ybiquitous](https://github.com/ybiquitous)).
- `declaration-block-no-duplicate-properties` autofix ([#6296](https://github.com/stylelint/stylelint/pull/6296)) ([@fpetrakov](https://github.com/fpetrakov)).
- `font-weight-notation` autofix ([#6347](https://github.com/stylelint/stylelint/pull/6347)) ([@ybiquitous](https://github.com/ybiquitous)).
- `ignore: ["inside-block"]` and `splitList` to `selector-disallowed-list` ([#6334](https://github.com/stylelint/stylelint/pull/6334)) ([@mattmanuel90](https://github.com/mattmanuel90)).
- regex support for `ignorePseudoClasses` option of `selector-pseudo-class-no-unknown` ([#6316](https://github.com/stylelint/stylelint/pull/6316)) ([@ybiquitous](https://github.com/ybiquitous)).
- regex support for `ignorePseudoElements` option of `selector-pseudo-element-no-unknown` ([#6317](https://github.com/stylelint/stylelint/pull/6317)) ([@ybiquitous](https://github.com/ybiquitous)).
- regex support for `ignoreSelectors` option of `selector-no-vendor-prefix` ([#6327](https://github.com/stylelint/stylelint/pull/6327)) ([@ybiquitous](https://github.com/ybiquitous)).
- regex support for `ignoreTypes` option of `selector-type-case` ([#6326](https://github.com/stylelint/stylelint/pull/6326)) ([@ybiquitous](https://github.com/ybiquitous)).

### Fixed

- `*-no-unknown` false positives for container queries ([#6318](https://github.com/stylelint/stylelint/pull/6318)) ([@fpetrakov](https://github.com/fpetrakov)).
- `font-family-name-quotes` false positives for interpolation and shorthand ([#6335](https://github.com/stylelint/stylelint/pull/6335)) ([@kimulaco](https://github.com/kimulaco)).
- `time-min-milliseconds` incorrect location for matching violating times ([#6319](https://github.com/stylelint/stylelint/pull/6319)) ([@kawaguchi1102](https://github.com/kawaguchi1102)).

## 14.11.0 - 2022-08-21

### Added

- `ignoreAfterCombinators: []` to `selector-max-universal` ([#6275](https://github.com/stylelint/stylelint/pull/6275)).

### Fixed

- `createPlugin` type definition ([#6264](https://github.com/stylelint/stylelint/pull/6264)).
- `alpha-value-notation` false negatives for SVG properties ([#6284](https://github.com/stylelint/stylelint/pull/6284)).
- `keyframes-name-pattern` false positives for interpolation ([#6265](https://github.com/stylelint/stylelint/pull/6265)).
- `selector-nested-pattern` end positions ([#6259](https://github.com/stylelint/stylelint/pull/6259)).
- `selector-no-qualifying-type` message, positions, and false positives ([#6260](https://github.com/stylelint/stylelint/pull/6260)).
- `selector-no-vendor-prefix` end positions ([#6261](https://github.com/stylelint/stylelint/pull/6261)).
- `selector-pseudo-class-allowed-list` end positions and message ([#6262](https://github.com/stylelint/stylelint/pull/6262)).
- `selector-pseudo-class-disallowed-list` end positions and message ([#6263](https://github.com/stylelint/stylelint/pull/6263)).
- `selector-pseudo-element-allowed-list` end positions and message ([#6270](https://github.com/stylelint/stylelint/pull/6270)).
- `selector-pseudo-element-disallowed-list` end positions and message ([#6270](https://github.com/stylelint/stylelint/pull/6270)).
- `shorthand-property-no-redundant-values` message ([#6272](https://github.com/stylelint/stylelint/pull/6272)).
- `time-min-milliseconds` end positions ([#6273](https://github.com/stylelint/stylelint/pull/6273)).

## 14.10.0 - 2022-08-11

### Added

- rule metadata to public `LinterResult` API ([#6166](https://github.com/stylelint/stylelint/pull/6166)).
- longhand sub-properties of shorthand properties reference data to public API ([#6168](https://github.com/stylelint/stylelint/pull/6168)).
- `meta.fixable` property to each rule ([#6181](https://github.com/stylelint/stylelint/pull/6181)).
- support for loading custom formatter from package ([#6228](https://github.com/stylelint/stylelint/pull/6228)).
- `annotation-no-unknown` rule ([#6155](https://github.com/stylelint/stylelint/pull/6155)).
- `keyframe-selector-notation` rule ([#6164](https://github.com/stylelint/stylelint/pull/6164)).
- `percentage-unless-within-keyword-only-block` primary option to `keyframe-selector-notation` ([#6194](https://github.com/stylelint/stylelint/pull/6194)).
- `github` formatter ([#6150](https://github.com/stylelint/stylelint/pull/6150)).
- tally to `string` and `verbose` formatters ([#6153](https://github.com/stylelint/stylelint/pull/6153)).
- fixable status to `verbose` and `github` formatters ([#6183](https://github.com/stylelint/stylelint/pull/6183)).
- invalid rule primary option message for `false` ([#6250](https://github.com/stylelint/stylelint/pull/6250)).

### Fixed

- exit code when nothing is passed to stylelint command ([#6175](https://github.com/stylelint/stylelint/pull/6175)).
- rule message function type to not require users to handle all kind of arguments ([#6147](https://github.com/stylelint/stylelint/pull/6147)).
- `at-rule-*` end positions ([#6163](https://github.com/stylelint/stylelint/pull/6163)).
- `declaration-block-no-redundant-longhand-properties` end positions ([#6219](https://github.com/stylelint/stylelint/pull/6219)).
- `declaration-property-value-allowed-list` false positives for multiple match ([#6190](https://github.com/stylelint/stylelint/pull/6190)).
- `declaration-property-value-disallowed-list` false negatives for multiple match ([#6188](https://github.com/stylelint/stylelint/pull/6188)).
- `named-grid-areas-no-invalid` end positions ([#6205](https://github.com/stylelint/stylelint/pull/6205)).
- `no-descending-specificity` false positives for pseudo-classes ([#6195](https://github.com/stylelint/stylelint/pull/6195)).
- `no-unknown-animations` end positions ([#6221](https://github.com/stylelint/stylelint/pull/6221)).
- `no-unknown-animations` false positives for SCSS interpolation ([#6185](https://github.com/stylelint/stylelint/pull/6185)).
- `number-max-precision` end positions ([#6184](https://github.com/stylelint/stylelint/pull/6184)).
- `property-*` end positions ([#6174](https://github.com/stylelint/stylelint/pull/6174)).
- `rule-selector-property-disallowed-list` end positions ([#6222](https://github.com/stylelint/stylelint/pull/6222)).
- `selector-attribute-name-disallowed-list` end positions ([#6223](https://github.com/stylelint/stylelint/pull/6223)).
- `selector-attribute-operator-allowed-list` end positions ([#6224](https://github.com/stylelint/stylelint/pull/6224)).
- `selector-attribute-operator-disallowed-list` end positions ([#6225](https://github.com/stylelint/stylelint/pull/6225)).
- `selector-attribute-quotes` end positions ([#6226](https://github.com/stylelint/stylelint/pull/6226)).
- `selector-class-pattern` end positions ([#6227](https://github.com/stylelint/stylelint/pull/6227)).
- `selector-combinator-allowed-list` and `selector-combinator-disallowed-list` end positions ([#6229](https://github.com/stylelint/stylelint/pull/6229)).
- `selector-disallowed-list` end positions ([#6230](https://github.com/stylelint/stylelint/pull/6230)).
- `selector-id-pattern` end positions ([#6231](https://github.com/stylelint/stylelint/pull/6231)).
- `selector-not-notation` end positions ([#6201](https://github.com/stylelint/stylelint/pull/6201)).
- `selector-pseudo-element-colon-notation` end positions ([#6235](https://github.com/stylelint/stylelint/pull/6235)).
- `string-no-newline` end positions ([#6218](https://github.com/stylelint/stylelint/pull/6218)).
- `unit-*` start and end positions ([#6169](https://github.com/stylelint/stylelint/pull/6169)).
- `value-no-vendor-prefix` end positions ([#6173](https://github.com/stylelint/stylelint/pull/6173)).

## 14.9.1 - 2022-06-11

### Fixed

- `selector-max-specificity` false positives for `:nth-child` ([#6140](https://github.com/stylelint/stylelint/pull/6140)).

## 14.9.0 - 2022-06-08

### Added

- `import-notation` rule ([#6102](https://github.com/stylelint/stylelint/pull/6102)).

### Fixed

- `no-duplicate-selectors` false positives for SCSS/Less nested interpolations ([#6118](https://github.com/stylelint/stylelint/pull/6118)).
- `no-descending-specificity` and `selector-max-specificity` false positives for `:is()` and `:where()` ([#6131](https://github.com/stylelint/stylelint/pull/6131)).

## 14.8.5 - 2022-05-25

### Fixed

- `no-duplicate-selectors` false positives with Less syntax ([#6111](https://github.com/stylelint/stylelint/pull/6111)).

## 14.8.4 - 2022-05-24

### Fixed

- `no-duplicate-selectors` error with non-standard selectors ([#6106](https://github.com/stylelint/stylelint/pull/6106)).

## 14.8.3 - 2022-05-21

### Fixed

- `at-rule-no-unknown` false positives for `@layer` ([#6093](https://github.com/stylelint/stylelint/pull/6093)).
- `length-zero-no-unit` autofix for `.0` values ([#6098](https://github.com/stylelint/stylelint/pull/6098)).
- `media-feature-name-no-unknown` false positives for `display-mode` ([#6073](https://github.com/stylelint/stylelint/pull/6073)).
- `no-descending-specificity` end positions ([#6049](https://github.com/stylelint/stylelint/pull/6049)).
- `no-duplicate-*` end positions ([#6047](https://github.com/stylelint/stylelint/pull/6047)).
- `no-invalid-*` end positions ([#6072](https://github.com/stylelint/stylelint/pull/6072)).
- `no-invalid-position-at-import-rule` false positives for `@layer` ([#6094](https://github.com/stylelint/stylelint/pull/6094)).

## 14.8.2 - 2022-05-04

### Fixed

- `function-calc-no-unspaced-operator` false positives for non-standard variables ([#6053](https://github.com/stylelint/stylelint/pull/6053)).
- `selector-*-no-unknown` end positions ([#6046](https://github.com/stylelint/stylelint/pull/6046)).

## 14.8.1 - 2022-04-29

### Fixed

- `declaration-block-no-*` end positions that avoid errors ([#6040](https://github.com/stylelint/stylelint/pull/6040)).
- `function-calc-no-unspaced-operator` false positives and memory leak ([#6045](https://github.com/stylelint/stylelint/pull/6045)).
- `named-grid-areas-no-invalid` false positives for arealess templates ([#6042](https://github.com/stylelint/stylelint/pull/6042)).

## 14.8.0 - 2022-04-26

### Added

- `keyframe-block-no-duplicate-selectors` rule ([#6024](https://github.com/stylelint/stylelint/pull/6024)).
- `property-*-list` support for vendor prefixes ([#6025](https://github.com/stylelint/stylelint/pull/6025)).

### Fixed

- `at-rule-*-list` end positions ([#6032](https://github.com/stylelint/stylelint/pull/6032)).
- `at-rule-no-unknown` end positions ([#6026](https://github.com/stylelint/stylelint/pull/6026)).
- `function-linear-gradient-no-nonstandard-direction` false negative about `-ms-linear-gradient` ([#6031](https://github.com/stylelint/stylelint/pull/6031)).
- `function-no-unknown` end positions ([#6038](https://github.com/stylelint/stylelint/pull/6038)).
- `property-no-unknown` end positions ([#6039](https://github.com/stylelint/stylelint/pull/6039)).

## 14.7.1 - 2022-04-17

### Fixed

- a regression for `/* stylelint-disable */` comments ([#6018](https://github.com/stylelint/stylelint/pull/6018)).
- `font-family-name-quotes` false positives for `ui-*` generic system font keywords ([#6017](https://github.com/stylelint/stylelint/pull/6017)).

## 14.7.0 - 2022-04-15

### Added

- ranges for warnings that can be used by formatters and integrations ([#5725](https://github.com/stylelint/stylelint/pull/5725)).
- `selector-not-notation` rule ([#5975](https://github.com/stylelint/stylelint/pull/5975)).

### Fixed

- `font-weight-notation` false positives for Sass functions and column position ([#6005](https://github.com/stylelint/stylelint/pull/6005)).

## 14.6.1 - 2022-03-25

### Fixed

- `custom-property-pattern` TypeError for "Cannot destructure property..." ([#5982](https://github.com/stylelint/stylelint/pull/5982)).
- `selector-type-case` false positives for SVG elements ([#5973](https://github.com/stylelint/stylelint/pull/5973)).
- `unit-no-unknown` false positives for large/small/dynamic viewport units ([#5970](https://github.com/stylelint/stylelint/pull/5970)).

## 14.6.0 - 2022-03-16

### Added

- `declaration-property-max-values` rule ([#5920](https://github.com/stylelint/stylelint/pull/5920)).

### Fixed

- `*-no-important` column position ([#5957](https://github.com/stylelint/stylelint/pull/5957)).
- `custom-property-pattern` false positives for interpolation in property name ([#5949](https://github.com/stylelint/stylelint/pull/5949)).
- `font-family-name-quotes` column position ([#5955](https://github.com/stylelint/stylelint/pull/5955)).
- `selector-pseudo-*-no-unknown` false positives and negatives ([#5959](https://github.com/stylelint/stylelint/pull/5959)).
- `selector-pseudo-class-no-unknown` false positives and negatives ([#5956](https://github.com/stylelint/stylelint/pull/5956)).

## 14.5.3 - 2022-02-23

### Fixed

- `*-list` invalid option warnings for strings ([#5934](https://github.com/stylelint/stylelint/pull/5934)).

## 14.5.2 - 2022-02-22

### Fixed

- clarity of invalid option warning message for objects ([#5923](https://github.com/stylelint/stylelint/pull/5923)).
- `*-list` false negatives for invalid options ([#5924](https://github.com/stylelint/stylelint/pull/5924)).
- `custom-property-pattern` false positives for interpolation inside `var()` ([#5925](https://github.com/stylelint/stylelint/pull/5925)).
- `declaration-property-value-*-list` column position ([#5926](https://github.com/stylelint/stylelint/pull/5926)).

## 14.5.1 - 2022-02-16

### Fixed

- `function-no-unknown` ENOENT and TypeErrors ([#5916](https://github.com/stylelint/stylelint/pull/5916)).
- `function-no-unknown` false positives for interpolation ([#5914](https://github.com/stylelint/stylelint/pull/5914)).

## 14.5.0 - 2022-02-10

### Added

- `ignoreFunctions: []` to `function-no-unknown` ([#5901](https://github.com/stylelint/stylelint/pull/5901)).

## 14.4.0 - 2022-02-08

### Added

- `function-no-unknown` rule ([#5865](https://github.com/stylelint/stylelint/pull/5865)).
- `font-family-name-quotes` autofix ([#5806](https://github.com/stylelint/stylelint/pull/5806)).

### Fixed

- throwing more informative error when all input files are ignored ([#5709](https://github.com/stylelint/stylelint/pull/5709)).
- `custom-property-pattern` false negatives for custom properties within `var()` ([#5867](https://github.com/stylelint/stylelint/pull/5867)).
- `no-descending-specificity` parseError for double-slash comments within selector lists ([#5891](https://github.com/stylelint/stylelint/pull/5891)).
- `selector-pseudo-element-colon-notation` false positives for escaped colons ([#5879](https://github.com/stylelint/stylelint/pull/5879)).

## 14.3.0 - 2022-01-23

### Added

- support for `meta.url` to rules and plugins ([#5845](https://github.com/stylelint/stylelint/pull/5845)).
- hyperlinks for rules to terminal output ([#5835](https://github.com/stylelint/stylelint/pull/5835)).
- hyperlinks for plugins to terminal output ([#5859](https://github.com/stylelint/stylelint/pull/5859)).
- `ignore: ["rules"] / ["at-rules"]` to `block-opening-brace-*-after` ([#5830](https://github.com/stylelint/stylelint/pull/5830)).
- `ignoreSelectors: []` to `property-case` ([#5822](https://github.com/stylelint/stylelint/pull/5822)).
- `ignoreFunctions: []` to `unit-allowed-list` ([#5857](https://github.com/stylelint/stylelint/pull/5857)).
- `camelCaseSvgKeywords` to `value-keyword-case` - use this option if you want legacy camel case SVG keywords like `currentColor` ([#5849](https://github.com/stylelint/stylelint/pull/5849)).

### Fixed

- `font-family-no-missing-generic-family-keyword` false positives for `revert` and `revert-layer` ([#5852](https://github.com/stylelint/stylelint/pull/5852)).
- `no-descending-specificity` false positives for the `::-moz-focus-inner` pseudo-element ([#5831](https://github.com/stylelint/stylelint/pull/5831)).
- `value-keyword-case` false negatives for SVG keywords like `currentcolor` ([#5849](https://github.com/stylelint/stylelint/pull/5849)).

## 14.2.0 - 2021-12-21

### Added

- `cwd` option to Node.js API ([#5721](https://github.com/stylelint/stylelint/pull/5721)).
- `resolveConfig` option to Node.js API ([#5734](https://github.com/stylelint/stylelint/pull/5734)).

### Fixed

- showing of incorrect missing package in `customSyntax` require handling ([#5763](https://github.com/stylelint/stylelint/pull/5763)).
- `color-function-notation` false positives for variables and color functions ([#5793](https://github.com/stylelint/stylelint/pull/5793))
- `color-named` false positives for hex with alpha-channel and false negatives for modern syntax ([#5718](https://github.com/stylelint/stylelint/pull/5718)).
- `declaration-empty-line-before` support for HTML files ([#5689](https://github.com/stylelint/stylelint/pull/5689)).
- `indentation` TypeError for syntaxes that use Document node type ([#5771](https://github.com/stylelint/stylelint/pull/5771)).

## 14.1.0 - 2021-11-14

### Added

- support for directory creation to `--output-file` flag ([#5672](https://github.com/stylelint/stylelint/pull/5672)).
- `ConfigurationError` type ([#5696](https://github.com/stylelint/stylelint/pull/5696)).
- `rule-selector-property-disallowed-list` rule ([#5679](https://github.com/stylelint/stylelint/pull/5679)).
- `ignore: ["consecutive-duplicates-with-same-prefixless-values"]` to `declaration-block-no-duplicate-properties` ([#5609](https://github.com/stylelint/stylelint/pull/5609)).
- `ignorePseudoClasses: []` to `max-nesting-depth` ([#5620](https://github.com/stylelint/stylelint/pull/5620)).

### Fixed

- extending rules within overrides ([#5683](https://github.com/stylelint/stylelint/pull/5683)).
- `color-function-notation` false positives for hex colours ([#5650](https://github.com/stylelint/stylelint/pull/5650)).
- `declaration-empty-line-before` false positives for values wrapped in parentheses ([#5680](https://github.com/stylelint/stylelint/pull/5680)).
- `indentation` TypeError for `baseIndentLevel: 1` option for Vue files ([#5657](https://github.com/stylelint/stylelint/pull/5657)).
- `property-no-unknown` false positives for maps ([#5690](https://github.com/stylelint/stylelint/pull/5690)).
- `selector-type-case` false positives for SVG type selectors ([#5717](https://github.com/stylelint/stylelint/pull/5717)).

## 14.0.1 - 2021-10-26

### Fixed

- package size by excluding docs ([#5643](https://github.com/stylelint/stylelint/pull/5643)).
- `overrides` property ignoring dot directories ([#5629](https://github.com/stylelint/stylelint/pull/5629)).
- custom syntax require error handling ([#5635](https://github.com/stylelint/stylelint/pull/5635)).
- `function-calc-no-unspaced-operator` false positives for hyphenated functions ([#5636](https://github.com/stylelint/stylelint/pull/5636)).

## 14.0.0 - 2021-10-21

[Migrating to `14.0.0` guide](docs/migration-guide/to-14.md).

### Security

- addressed ReDoS issue with regex in `indentation` ([#5539](https://github.com/stylelint/stylelint/pull/5539)).

### Removed

- Node.js 10 support ([#5303](https://github.com/stylelint/stylelint/pull/5303)).
- `syntax` option ([#5297](https://github.com/stylelint/stylelint/pull/5297)).
- `configOverrides` option ([#5530](https://github.com/stylelint/stylelint/pull/5530)).
- rules deprecated in 13.7.0 ([#5295](https://github.com/stylelint/stylelint/pull/5295)).
- `function-calc-no-invalid` rule ([#5296](https://github.com/stylelint/stylelint/pull/5296)).

### Changed

- `ignoreFiles` to be extendable ([#5596](https://github.com/stylelint/stylelint/pull/5596)).

### Added

- TypeScript type definitions ([#5582](https://github.com/stylelint/stylelint/pull/5582)).
- `customSyntax` option as a property in the configuration object ([#5538](https://github.com/stylelint/stylelint/pull/5538)).
- `overrides` property to configuration object ([#5521](https://github.com/stylelint/stylelint/pull/5521)).
- `disableFix` as secondary option to rules property in the configuration object ([#5460](https://github.com/stylelint/stylelint/pull/5460)).
- `quiet` option to Node.js API ([#5542](https://github.com/stylelint/stylelint/pull/5542)).
- `color-hex-alpha` rule ([#5316](https://github.com/stylelint/stylelint/pull/5316)).
- `custom-property-no-missing-var-function` rule ([#5317](https://github.com/stylelint/stylelint/pull/5317)).
- `function-calc-no-unspaced-operator` autofix ([#5273](https://github.com/stylelint/stylelint/pull/5273)).
- `ignoreFunctions: []` to `length-zero-no-unit` ([#5314](https://github.com/stylelint/stylelint/pull/5314)).
- `ignoreAtRules: []` to `no-invalid-position-at-import` ([#5520](https://github.com/stylelint/stylelint/pull/5520)).
- `ignoreProperties: []` to `number-max-precision` ([#5421](https://github.com/stylelint/stylelint/pull/5421)).

### Fixed

- "No files matching the pattern" when using backslash paths on Windows ([#5386](https://github.com/stylelint/stylelint/pull/5386)).
- `function-url-quotes` problem messages to be consistent with other `*-quotes` rules ([#5488](https://github.com/stylelint/stylelint/pull/5488)).
- `length-zero-no-unit` false positives for `flex` property ([#5315](https://github.com/stylelint/stylelint/pull/5315)).
- `media-feature-name-no-unknown` false positives for `prefers-contrast` ([#5428](https://github.com/stylelint/stylelint/pull/5428)).
- `media-feature-name-no-unknown` false positives for `dynamic-range` & `video-dynamic-range` ([#5613](https://github.com/stylelint/stylelint/pull/5613)).
- `media-feature-name-value-allowed-list` TypeError for spaceless condition ([#5581](https://github.com/stylelint/stylelint/pull/5581)).
- `property-no-unknown` false positives for Less maps ([#5381](https://github.com/stylelint/stylelint/pull/5381)).
- `selector-class-pattern` false positives for Less parametric mixins ([#5378](https://github.com/stylelint/stylelint/pull/5378)).
- `max-empty-lines` autofix for Less comments ([#5507](https://github.com/stylelint/stylelint/pull/5507)).
- `named-grid-areas-no-invalid` false negatives for `grid` and `grid-template` shorthand properties ([#5514](https://github.com/stylelint/stylelint/pull/5514)).
- `unit-no-unknown` false positives for nested property declarations ([#5500](https://github.com/stylelint/stylelint/pull/5500)).

## 13.13.1 - 2021-05-01

### Fixed

- invalid JSON for `max-warnings` option ([#5267](https://github.com/stylelint/stylelint/pull/5267)).
- `no-invalid-position-at-import-rule` false positives for dollar variables ([#5264](https://github.com/stylelint/stylelint/pull/5264)).

## 13.13.0 - 2021-04-24

### Added

- `no-invalid-position-at-import-rule` rule ([#5202](https://github.com/stylelint/stylelint/pull/5202)).
- `no-irregular-whitespace` rule ([#5209](https://github.com/stylelint/stylelint/pull/5209)).
- `selector-disallowed-list` rule ([#5239](https://github.com/stylelint/stylelint/pull/5239)).
- `selector-attribute-quotes` autofix ([#5248](https://github.com/stylelint/stylelint/pull/5248)).
- `ignore: ["inside-function"]` to `declaration-property-unit-allowed-list` ([#5194](https://github.com/stylelint/stylelint/pull/5194)).

### Fixed

- `color-no-hex` false positives for CSS-in-JS objection notation ([#5186](https://github.com/stylelint/stylelint/pull/5186)).
- `font-family-no-missing-generic-family-keyword` false positives for variables ([#5240](https://github.com/stylelint/stylelint/pull/5240)).
- `length-zero-no-unit` autofix removing trailing zeroes and comments ([#5256](https://github.com/stylelint/stylelint/pull/5256)).
- `length-zero-no-unit` false positives for level 4 math functions ([#5203](https://github.com/stylelint/stylelint/pull/5203)).
- `length-zero-no-unit` false positives for functions inside of math functions ([#5245](https://github.com/stylelint/stylelint/pull/5245)).

## 13.12.0 - 2021-03-06

### Added

- `named-grid-areas-no-invalid` rule ([#5167](https://github.com/stylelint/stylelint/pull/5167)).
- `ignore: ["single-declaration"]` to `declaration-block-trailing-semicolon` ([#5165](https://github.com/stylelint/stylelint/pull/5165)).

### Fixed

- `*-no-unknown` false positives ([#5158](https://github.com/stylelint/stylelint/pull/5158)).
- `selector-pseudo-class-no-unknown` false positives for `:autofill` ([#5171](https://github.com/stylelint/stylelint/pull/5171)).

## 13.11.0 - 2021-02-20

### Added

- exceptions and severity options to `report*` configuration object properties ([#5143](https://github.com/stylelint/stylelint/pull/5143)).

## 13.10.0 - 2021-02-11

### Added

- `ignoreDisables`, `reportNeedlessDisables`, `reportInvalidScopeDisables` and `reportDescriptionlessDisables` configuration object properties ([#5126](https://github.com/stylelint/stylelint/pull/5126)).
- `declaration-block-no-duplicate-custom-properties` rule ([#5125](https://github.com/stylelint/stylelint/pull/5125)).

### Fixed

- `alpha-value-notation` false negatives for CSS Variables ([#5130](https://github.com/stylelint/stylelint/pull/5130)).

## 13.9.0 - 2021-01-19

### Added

- TAP formatter ([#5062](https://github.com/stylelint/stylelint/pull/5062)).

### Fixed

- incorrect exit code when using `--report` options ([#5079](https://github.com/stylelint/stylelint/pull/5079)).
- `color-hex-case` false negatives for css-in-js object notation ([#5101](https://github.com/stylelint/stylelint/pull/5101)).
- `color-hex-length` false negatives for css-in-js object notation ([#5106](https://github.com/stylelint/stylelint/pull/5106)).
- `selector-attribute-name-disallowed-list` false positives for valueless attribute selectors ([#5060](https://github.com/stylelint/stylelint/pull/5060)).

## 13.8.0 - 2020-11-17

### Deprecated

- `StylelintStandaloneReturnValue.reportedDisables`, `.descriptionlessDisables`, `.needlessDisables`, and `.invalidScopeDisables`. `.reportedDisables` will always be empty and the other properties will always be undefined, since these errors now show up in `.results` instead ([#4973](https://github.com/stylelint/stylelint/pull/4973)).

### Added

- disable comments that are reported as errors for various reasons are now reported as standard lint errors rather than a separate class of errors that must be handled specially ([#4973](https://github.com/stylelint/stylelint/pull/4973)).
- `comment-pattern` rule ([#4962](https://github.com/stylelint/stylelint/pull/4962)).
- `selector-attribute-name-disallowed-list` rule ([#4992](https://github.com/stylelint/stylelint/pull/4992)).
- `ignoreAtRules[]` to `property-no-unknown` ([#4965](https://github.com/stylelint/stylelint/pull/4965)).

### Fixed

- `*-notation` false negatives for dollar variables ([#5031](https://github.com/stylelint/stylelint/pull/5031)).
- `*-pattern` missing configured pattern in problem messages ([#4975](https://github.com/stylelint/stylelint/pull/4975)).

## 13.7.2 - 2020-09-25

### Fixed

- regression for disable commands and adjacent double-slash comments ([#4950](https://github.com/stylelint/stylelint/pull/4950)).
- use of full file path without converting it to glob ([#4931](https://github.com/stylelint/stylelint/pull/4931)).

## 13.7.1 - 2020-09-11

### Fixed

- double-slash disable comments when followed by another comment ([#4913](https://github.com/stylelint/stylelint/pull/4913)).

## 13.7.0 - 2020-08-31

### Deprecated

- `*-blacklist`, `*-requirelist` and `*-whitelist` rules in favor of the new `*-disallowed-list`, `*-required-list` and `*-allowed-list` ones ([#4845](https://github.com/stylelint/stylelint/pull/4845)):
  - `at-rule-blacklist`. Use `at-rule-disallowed-list` instead.
  - `at-rule-property-requirelist`. Use `at-rule-property-required-list` instead.
  - `at-rule-whitelist`. Use `at-rule-allowed-list` instead.
  - `comment-word-blacklist`. Use `comment-word-disallowed-list` instead.
  - `declaration-property-unit-blacklist`. Use `declaration-property-unit-disallowed-list` instead.
  - `declaration-property-unit-whitelist`. Use `declaration-property-unit-allowed-list` instead.
  - `declaration-property-value-blacklist`. Use `declaration-property-value-disallowed-list` instead.
  - `declaration-property-value-whitelist`. Use `declaration-property-value-allowed-list` instead.
  - `function-blacklist`. Use `function-disallowed-list` instead.
  - `function-url-scheme-blacklist`. Use `function-url-scheme-disallowed-list` instead.
  - `function-url-scheme-whitelist`. Use `function-url-scheme-allowed-list` instead.
  - `function-whitelist`. Use `function-allowed-list` instead.
  - `media-feature-name-blacklist`. Use `media-feature-name-disallowed-list` instead.
  - `media-feature-name-value-whitelist`. Use `media-feature-name-value-allowed-list` instead.
  - `media-feature-name-whitelist`. Use `media-feature-name-allowed-list` instead.
  - `property-blacklist`. Use `property-disallowed-list` instead.
  - `property-whitelist`. Use `property-allowed-list` instead.
  - `selector-attribute-operator-blacklist`. Use `selector-attribute-operator-disallowed-list` instead.
  - `selector-attribute-operator-whitelist`. Use `selector-attribute-operator-allowed-list` instead.
  - `selector-combinator-blacklist`. Use `selector-combinator-disallowed-list` instead.
  - `selector-combinator-whitelist`. Use `selector-combinator-allowed-list` instead.
  - `selector-pseudo-class-blacklist`. Use `selector-pseudo-class-disallowed-list` instead.
  - `selector-pseudo-class-whitelist`. Use `selector-pseudo-class-allowed-list` instead.
  - `selector-pseudo-element-blacklist`. Use `selector-pseudo-element-disallowed-list` instead.
  - `selector-pseudo-element-whitelist`. Use `selector-pseudo-element-allowed-list` instead.
  - `unit-blacklist`. Use `unit-disallowed-list` instead.
  - `unit-whitelist`. Use `unit-allowed-list` instead.

### Added

- syntax object acceptance to `customSyntax` option ([#4839](https://github.com/stylelint/stylelint/pull/4839)).
- support for `*.cjs` config files ([#4905](https://github.com/stylelint/stylelint/pull/4905)).
- support for descriptions in Stylelint command comments ([#4848](https://github.com/stylelint/stylelint/pull/4848)).
- `reportDescriptionlessDisables` flag ([#4907](https://github.com/stylelint/stylelint/pull/4907)).
- `reportDisables` secondary option ([#4897](https://github.com/stylelint/stylelint/pull/4897)).
- `*-no-vendor-prefix` autofix ([#4859](https://github.com/stylelint/stylelint/pull/4859)).
- `ignoreComments[]` to `comment-empty-line-before` ([#4841](https://github.com/stylelint/stylelint/pull/4841)).
- `ignoreContextFunctionalPseudoClasses` to `selector-max-id` ([#4835](https://github.com/stylelint/stylelint/pull/4835)).

### Fixed

- inconsistent trailing newlines in CLI error output ([#4876](https://github.com/stylelint/stylelint/pull/4876)).
- support for multi-line disable descriptions ([#4895](https://github.com/stylelint/stylelint/pull/4895)).
- support for paths with parentheses ([#4867](https://github.com/stylelint/stylelint/pull/4867)).
- `selector-max-*` (except `selector-max-type`) false negatives for `where`, `is`, `nth-child` and `nth-last-child` ([#4842](https://github.com/stylelint/stylelint/pull/4842)).
- `length-zero-no-unit` TypeError for custom properties fallback ([#4860](https://github.com/stylelint/stylelint/pull/4860)).
- `selector-combinator-space-after` false positives for trailing combinator ([#4878](https://github.com/stylelint/stylelint/pull/4878)).

## 13.6.1 - 2020-06-17

### Fixed

- `max-empty-lines` TypeError from inline comment with autofix and sugarss syntax ([#4821](https://github.com/stylelint/stylelint/pull/4821)).
- `property-no-unknown` false positives for namespaced variables ([#4803](https://github.com/stylelint/stylelint/pull/4803)).
- `selector-type-no-unknown` false positives for idents within `::part` pseudo-elements ([#4828](https://github.com/stylelint/stylelint/pull/4828)).

## 13.6.0 - 2020-06-04

### Added

- `ignoreSelectors[]` to `block-opening-brace-space-before` ([#4640](https://github.com/stylelint/stylelint/pull/4640)).

### Fixed

- false positives for all scope disables in `--report-invalid-scope-disables` ([#4784](https://github.com/stylelint/stylelint/pull/4784)).
- TypeError for CSS-in-JS when encountering a call or template expression named 'html' ([#4797](https://github.com/stylelint/stylelint/pull/4797)).
- writing error information to `stderr` ([#4799](https://github.com/stylelint/stylelint/pull/4799)).
- minimum node version in `package.json`'s `engine` field ([#4790](https://github.com/stylelint/stylelint/pull/4790)).
- `alpha-value-notation` number precision errors ([#4802](https://github.com/stylelint/stylelint/pull/4802)).
- `font-family-no-missing-generic-family-keyword` false positives for variables ([#4806](https://github.com/stylelint/stylelint/pull/4806)).
- `no-duplicate-selectors` false positives for universal selector and `disallowInList` ([#4809](https://github.com/stylelint/stylelint/pull/4809)).

## 13.5.0 - 2020-05-19

### Added

- `alpha-value-notation` rule ([#4770](https://github.com/stylelint/stylelint/pull/4770)).
- `color-function-notation` rule ([#4760](https://github.com/stylelint/stylelint/pull/4760)).
- `hue-degree-notation` rule ([#4769](https://github.com/stylelint/stylelint/pull/4769)).

## 13.4.1 - 2020-05-18

### Fixed

- `time-min-milliseconds` TypeError for `ignore: ["delay"]` and shorthand animation ([#4783](https://github.com/stylelint/stylelint/pull/4783)).

## 13.4.0 - 2020-05-17

### Added

- `ignore:["delay"]` to `time-min-milliseconds` ([#4743](https://github.com/stylelint/stylelint/pull/4743)).
- `ignoreFunctions: []` to `value-keyword-case` ([#4733](https://github.com/stylelint/stylelint/pull/4733)).

### Fixed

- improved performance when auto syntax is used ([#4729](https://github.com/stylelint/stylelint/pull/4729)).
- `--report-needless-disables` respects stylelint-disable commands ([#4714](https://github.com/stylelint/stylelint/pull/4714)).
- `at-rule-property-requirelist` TypeError for comments inside of font-face ([#4744](https://github.com/stylelint/stylelint/pull/4744)).
- `declaration-block-trailing-semicolon` false positives for CSS-in-JS object notation ([#4749](https://github.com/stylelint/stylelint/pull/4749)).
- `declaration-empty-line-before` false positives for inlines styles ([#4726](https://github.com/stylelint/stylelint/pull/4726)).
- `media-feature-name-*` false positives for `forced-colors` ([#4775](https://github.com/stylelint/stylelint/pull/4775)).
- `value-keyword-case` false positives WebExtension replacement keywords ([#4778](https://github.com/stylelint/stylelint/pull/4778)).
- `value-keyword-case` false positives regression for mixed-case properties and the `ignoreProperties` option ([#4748](https://github.com/stylelint/stylelint/pull/4748)).

## 13.3.3 - 2020-04-21

### Fixed

- autofix will respect scoped disable comments by turning off autofix for the scoped rules for the entire source; this is a continuation of the workaround added in `13.2.0` ([#4705](https://github.com/stylelint/stylelint/pull/4705)).

## 13.3.2 - 2020-04-11

### Fixed

- update postcss-css-in-js with fix for maximum call stack size exceeded error ([#4701](https://github.com/stylelint/stylelint/pull/4701)).

## 13.3.1 - 2020-04-09

### Fixed

- babel configuration conflict when using TypeScript ([postcss-css-in-js/#2](https://github.com/stylelint/postcss-css-in-js/pull/2)).
- autofix for nested tagged template literals ([#4119](https://github.com/stylelint/stylelint/pull/4119)).

## 13.3.0 - 2020-04-03

### Added

- `ignoreFontFamilies: []` to `font-family-no-missing-generic-family-keyword` ([#4656](https://github.com/stylelint/stylelint/pull/4656)).

### Fixed

- `function-calc-no-invalid` false positives for SCSS and Less variables ([#4659](https://github.com/stylelint/stylelint/pull/4659)).
- `unit-no-unknown` false positives for `x` unit within vendor-prefixed `image-set` ([#4654](https://github.com/stylelint/stylelint/pull/4654)).

## 13.2.1 - 2020-03-09

### Fixed

- `selector-pseudo-element-no-unknown` false positives for `::part` pseudo-element ([#4604](https://github.com/stylelint/stylelint/pull/4604)).
- `value-keyword-case` false positives for longhand `grid-column/row-*` properties ([#4611](https://github.com/stylelint/stylelint/pull/4611)).

## 13.2.0 - 2020-02-14

### Security

- updated to `postcss-selector-parser@6` due to a vulnerability in one of `postcss-selector-parser@3` dependencies ([#4595](https://github.com/stylelint/stylelint/pull/4595)). Due to this update:
  - `selector-descendant-combinator-no-non-space` will ignore selectors containing comments
  - `selector-pseudo-class-parentheses-space-inside` can't autofix pseudo-classes that contain comments

### Added

- `--stdin` CLI flag that accepts stdin input even if it is empty ([#4594](https://github.com/stylelint/stylelint/pull/4594)).

### Fixed

- autofix will ignore sources containing disable comments or nested tagged template literals - this is workaround to make autofix safer to use until we can resolve the [underlying](https://github.com/stylelint/stylelint/issues/4119) [issues](https://github.com/stylelint/stylelint/issues/2643) ([#4573](https://github.com/stylelint/stylelint/pull/4573)).

## 13.1.0 - 2020-02-08

### Fixed

- `media-feature-name-*` false negatives for range context ([#4581](https://github.com/stylelint/stylelint/pull/4581)).
- `indentation` RangeError regression ([#4572](https://github.com/stylelint/stylelint/pull/4572)).
- `string-quotes` attribute selector autofix ([#4576](https://github.com/stylelint/stylelint/pull/4576)).

## 13.0.0 - 2020-01-12

### Removed

- Node.js 8.x support. Node.js 10 is now required. We can guarantee Stylelint works on the latest Node.js 10 release. ([#4500](https://github.com/stylelint/stylelint/pull/4500)).
- types declarations for Flow ([#4451](https://github.com/stylelint/stylelint/pull/4451)).

### Changed

- `globby` was updated to v10. Now only forward-slashes (`/`) should be used as directory separator in globs. Refer to [glob pattern syntax](https://github.com/mrmlnc/fast-glob#pattern-syntax). Most of the users wouldn't need to change anything, but Windows users might need to update their globs. ([#4254](https://github.com/stylelint/stylelint/pull/4254)).

### Added

- `unit-no-unknown` support for `x` unit ([#4427](https://github.com/stylelint/stylelint/pull/4427)).

### Fixed

- `--report-invalid-scope-disables` crash when no rules specified ([#4498](https://github.com/stylelint/stylelint/pull/4498)).
- `media-feature-parentheses-space-inside` false negatives for multiple spaces ([#4513](https://github.com/stylelint/stylelint/pull/4513)).
- `selector-type-no-unknown` false positives for SVG tags ([#4495](https://github.com/stylelint/stylelint/pull/4495)).
- `unit-no-unknown` false positives for Sass map keys ([#4450](https://github.com/stylelint/stylelint/pull/4450)).
- `value-list-comma-newline-after` false positives for shared-line comments ([#4482](https://github.com/stylelint/stylelint/pull/4482)).
- consistently check that selectors are standard before passing to the parser ([#4483](https://github.com/stylelint/stylelint/pull/4483)).
- overlapping disabled ranges edge case ([#4497](https://github.com/stylelint/stylelint/pull/4497)).

## 12.0.1 - 2019-12-25

### Fixed

- `string-no-newline` memory leak for ERB templates ([#4491](https://github.com/stylelint/stylelint/pull/4491)).

## 12.0.0 - 2019-11-16

### Removed

- ignoring `bower_components` folder by default ([#4384](https://github.com/stylelint/stylelint/pull/4384)).
- `createRuleTester` API ([#4385](https://github.com/stylelint/stylelint/pull/4385)).

### Added

- more information for custom formatters ([#4393](https://github.com/stylelint/stylelint/pull/4393)).

### Fixed

- `comment-empty-line-before` false positives for selector lists and shared-line comments ([#4360](https://github.com/stylelint/stylelint/pull/4360)).
- `font-family-no-missing-generic-family-keyword` false positives for Sass-variables with namespaces ([#4378](https://github.com/stylelint/stylelint/pull/4378)).
- `font-weight-notation` false positives for `font-weight` ranges in `@font-face` ([#4372](https://github.com/stylelint/stylelint/pull/4372)).
- `length-zero-no-unit` false positives for `line-height`, and for `fr` units ([#4394](https://github.com/stylelint/stylelint/pull/4394)).
- `length-zero-no-unit` false positives for Less variables ([#4405](https://github.com/stylelint/stylelint/pull/4405)).
- `selector-max-*` false negatives for rules with nested rules ([#4357](https://github.com/stylelint/stylelint/pull/4357)).
- incorrect error message when parsing files with a broken syntax ([#4364](https://github.com/stylelint/stylelint/pull/4364)).

## 11.1.1 - 2019-10-10

### Fixed

- syntax configuration for `--syntax css` ([#4335](https://github.com/stylelint/stylelint/pull/4335)).

## 11.1.0 - 2019-10-10

### Added

- `css` syntax option ([#4315](https://github.com/stylelint/stylelint/pull/4315)).

### Fixed

- `no-eol-whitespace` parsing problems for non-standard syntaxes ([#4313](https://github.com/stylelint/stylelint/pull/4313)).
- `selector-pseudo-class-no-unknown` false positives for `:is` selector ([#4321](https://github.com/stylelint/stylelint/pull/4321)).

## 11.0.0 - 2019-09-15

### Changed

- `--report-needless-disables` CLI flag now reports needless disables and runs linting ([#4151](https://github.com/stylelint/stylelint/pull/4151)).
- display a problem at 1:1 for each file instead of throwing an error on unrecognized rules ([#4237](https://github.com/stylelint/stylelint/pull/4237)).
- always return `stylelintError` as a boolean ([#4174](https://github.com/stylelint/stylelint/pull/4174)).

### Deprecated

- `createRuleTester` API ([#4279](https://github.com/stylelint/stylelint/pull/4279)).

### Added

- `--reportInvalidScopeDisables` CLI flag ([#4181](https://github.com/stylelint/stylelint/pull/4181)).
- `unicode-bom` rule ([#4225](https://github.com/stylelint/stylelint/pull/4225)).
- `max-empty-lines` autofix ([#3667](https://github.com/stylelint/stylelint/pull/3667)).
- `selector-pseudo-element-case` autofix ([#3672](https://github.com/stylelint/stylelint/pull/3672)).
- `selector-*` support for all logical combinations (`:matches`, `:has`) ([#4179](https://github.com/stylelint/stylelint/pull/4179)).
- `ignore: ["selectors-within-list"]` to `no-descending-specificity` ([#4176](https://github.com/stylelint/stylelint/pull/4176)).
- `ignoreSelectors: []` to `property-no-unknown` ([#4275](https://github.com/stylelint/stylelint/pull/4275)).

### Fixed

- Babel user configuration interfering with CSS-in-JS parser ([#4164](https://github.com/stylelint/stylelint/pull/4164)).
- PostCSS plugin ignoring .stylelintignore ([#4186](https://github.com/stylelint/stylelint/pull/4186)).
- `*-max-empty-lines` to only report one problem per function, selector, value list ([#4260](https://github.com/stylelint/stylelint/pull/4260)).
- `block-no-empty` crash for `@import` statements ([#4110](https://github.com/stylelint/stylelint/pull/4110)).
- `indentation` false positives for `<style>` tag with multiline attributes ([#4177](https://github.com/stylelint/stylelint/pull/4177)).
- `length-zero-no-unit` false positives for inside calc function ([#4175](https://github.com/stylelint/stylelint/pull/4175)).
- `max-line-length` false positives for multi-line `url()` ([#4169](https://github.com/stylelint/stylelint/pull/4169)).
- `no-duplicate-selectors` false positives for selectors in the same selector list ([#4173](https://github.com/stylelint/stylelint/pull/4173)).
- `no-unit-unknown` false positives for at-variables (Less) starting with numbers ([#4163](https://github.com/stylelint/stylelint/pull/4163)).
- `property-no-unknown` for `overflowX` for CSS-in-JS ([#4184](https://github.com/stylelint/stylelint/pull/4184)).

## 10.1.0 - 2019-06-07

### Added

- `selector-max-empty-lines` autofix ([#3717](https://github.com/stylelint/stylelint/pull/3717)).
- rule names for `--report-needless-disables` output ([#4071](https://github.com/stylelint/stylelint/pull/4071)).
- `--output-file` CLI flag ([#4085](https://github.com/stylelint/stylelint/pull/4085)).

### Fixed

- `function-calc-no-invalid` false positives for interpolation ([#4046](https://github.com/stylelint/stylelint/pull/4046)).
- `declaration-block-semicolon-space-before` autofix with `!important` annotations ([#4016](https://github.com/stylelint/stylelint/issues/4016)).
- `no-eol-whitespace` autofix for within comments ([#4224](https://github.com/stylelint/stylelint/pull/4224)).
- `no-eol-whitespace` false negatives for last line without trailing EOL ([#4224](https://github.com/stylelint/stylelint/pull/4224)).
- `selector-pseudo-class-no-unknown` false positives for `defined` ([#4081](https://github.com/stylelint/stylelint/pull/4081)).

## 10.0.1 - 2019-04-16

### Fixed

- minimum Node.js engine reduced to 8.7.0 ([#4032](https://github.com/stylelint/stylelint/pull/4032)).
- `--allow-empty-input` CLI flag ([#4029](https://github.com/stylelint/stylelint/pull/4029)).
- `color-no-invalid-hex` false positives for hashes in URLs ([#4035](https://github.com/stylelint/stylelint/pull/4035)).
- `function-linear-gradient-no-nonstandard-direction` false positives for dollar variables ([#4027](https://github.com/stylelint/stylelint/pull/4027)).

## 10.0.0 - 2019-04-13

### Removed

- Node.js 6.x support. Node.js 8.15.1 or greater is now required ([#4006](https://github.com/stylelint/stylelint/pull/4006)).
- `styled` and `jsx` syntax options that were replaced with `css-in-js` in v9.10.0 ([#4007](https://github.com/stylelint/stylelint/pull/4007)).

### Changed

- throws error if glob matches no files, use the `--allow-empty-input` flag for the old behavior ([#3965](https://github.com/stylelint/stylelint/pull/3965)).
- rules are now applied in the order defined in `lib/rules/index.js` ([#3923](https://github.com/stylelint/stylelint/pull/3923)).

### Added

- `at-rule-property-requirelist` rule ([#3997](https://github.com/stylelint/stylelint/pull/3997)).
- `disallowInList` to `no-duplicate-selectors` ([#3936](https://github.com/stylelint/stylelint/pull/3936)).
- `ignore: ["comments"]` to `block-no-empty` ([#4008](https://github.com/stylelint/stylelint/pull/4008)).

### Fixed

- false negatives in declaration-based rules for CSS-in-JS ([#3933](https://github.com/stylelint/stylelint/pull/3933)).
- `color-no-invalid-hex` false negatives for CSS-in-JS ([#3957](https://github.com/stylelint/stylelint/pull/3957)).
- `feature-name-no-unknown` false positives for `prefers-color-scheme` ([#3951](https://github.com/stylelint/stylelint/pull/3951)).
- `function-calc-no-invalid` false positives for negative numbers ([#3921](https://github.com/stylelint/stylelint/pull/3921)).
- `no-descending-specificity` false positives for vendor prefixed pseudo-elements ([#3929](https://github.com/stylelint/stylelint/issues/3929)).
- `selector-max-*` false negatives for nested at-rules ([#3959](https://github.com/stylelint/stylelint/pull/3959)).
- Logical combinations pseudo-classes in `selector-max-universal` are now evaluated separately ([#4263](https://github.com/stylelint/stylelint/pull/4263)).
- `value-keyword-case` autofix for single-line comments within maps ([#4019](https://github.com/stylelint/stylelint/pull/4019)).

## 9.10.1 - 2019-01-19

### Fixed

- "fatal: Not a git repository" error ([#3915](https://github.com/stylelint/stylelint/pull/3915)).
- unintended increase in package size ([#3915](https://github.com/stylelint/stylelint/pull/3915)).

## 9.10.0 - 2019-01-16

### Added

- support for ordinary regular expressions anywhere a regex string is accepted in rule config ([#3799](https://github.com/stylelint/stylelint/pull/3799)).
- `css-in-js` syntax option that will replace the existing `styled` and `jsx` ones ([#3872](https://github.com/stylelint/stylelint/pull/3872)).
- `function-calc-no-invalid` rule ([#3833](https://github.com/stylelint/stylelint/pull/3833)).
- `ignore: ["next-sibling"]` to `selector-max-type` ([#3832](https://github.com/stylelint/stylelint/pull/3832)).
- `declaration-block-semicolon-space-after` autofix ([#3865](https://github.com/stylelint/stylelint/pull/3865)).

### Fixed

- autofix is now disabled when a Stylelint processors is used ([#3873](https://github.com/stylelint/stylelint/pull/3873)).
- `CssSyntaxError` for functions in template literals ([#3869](https://github.com/stylelint/stylelint/pull/3869)).
- `no-descending-specificity` false positives for styled-components ([#3875](https://github.com/stylelint/stylelint/pull/3875)).
- `no-duplicate-selectors` false positives for styled-components ([#3875](https://github.com/stylelint/stylelint/pull/3875)).
- `selector-pseudo-class-no-unknown` false positives for `focus-visible` ([#3887](https://github.com/stylelint/stylelint/pull/3887)).
- `selector-max-universal` false positives for flush comments containing a comma ([#3817](https://github.com/stylelint/stylelint/pull/3817)).
- `shorthand-property-redundant-values` false positives for negative values ([#3888](https://github.com/stylelint/stylelint/pull/3888)).

## 9.9.0 - 2018-11-27

### Added

- `selector-list-comma-newline-after` autofix ([#3815](https://github.com/stylelint/stylelint/pull/3815)).
- `value-list-max-empty-lines` autofix ([#3814](https://github.com/stylelint/stylelint/pull/3814)).
- `ignoreSelectors: []` to `selector-no-vendor-prefix` ([#3748](https://github.com/stylelint/stylelint/pull/3748)).

### Fixed

- ignored files are no longer parsed ([#3801](https://github.com/stylelint/stylelint/pull/3801)).
- ignore `&:extend` for Less syntax ([#3824](https://github.com/stylelint/stylelint/pull/3824)).
- `--report-needless-disables` CLI flag ([#3819](https://github.com/stylelint/stylelint/pull/3819)).
- `font-family-no-missing-generic-family-keyword` false positives for system fonts ([#3794](https://github.com/stylelint/stylelint/pull/3794)).

## 9.8.0 - 2018-11-09

### Added

- `value-keyword-case` autofix ([#3775](https://github.com/stylelint/stylelint/pull/3775)).
- `ignore: ["pseudo-classes"]` to `max-nesting-depth` ([#3724](https://github.com/stylelint/stylelint/pull/3724)).
- `ignoreTypes:[]` to `selector-type-case` ([#3758](https://github.com/stylelint/stylelint/pull/3758)).
- `ignoreFunctions:[]` to `unit-no-unknown` ([#3736](https://github.com/stylelint/stylelint/pull/3736)).

### Fixed

- error for single-line Sass comments ([#3772](https://github.com/stylelint/stylelint/pull/3772)).
- `at-rule-*` false positives for Less variables and mixins ([#3767](https://github.com/stylelint/stylelint/pull/3767)).
- `max-empty-lines` false positives for final newlines ([#3785](https://github.com/stylelint/stylelint/pull/3785)).

## 9.7.1 - 2018-10-30

### Fixed

- `at-rule-*` false positives for Less variables and mixins ([#3759](https://github.com/stylelint/stylelint/pull/3759)).

## 9.7.0 - 2018-10-28

### Added

- allow globally installed configuration ([#3642](https://github.com/stylelint/stylelint/pull/3642)).
- `media-feature-parentheses-space-inside` autofix ([#3720](https://github.com/stylelint/stylelint/pull/3720)).
- `selector-descendant-combinator-no-non-space` autofix ([#3565](https://github.com/stylelint/stylelint/pull/3565)).
- `unit-case` autofix ([#3725](https://github.com/stylelint/stylelint/pull/3725)).

### Fixed

- false negatives for Less at-imports ([#3687](https://github.com/stylelint/stylelint/pull/3687)).
- SyntaxError when an empty string is used for a rule's custom message ([#3743](https://github.com/stylelint/stylelint/pull/3743)).
- `max-empty-lines` false positives for empty lines before `</style>` ([#3708](https://github.com/stylelint/stylelint/pull/3708)).
- `selector-max-specificity` false positives for functional pseudo-classes ([#3711](https://github.com/stylelint/stylelint/pull/3711)).

## 9.6.0 - 2018-09-27

### Added

- suggestions for invalid CLI options ([#3622](https://github.com/stylelint/stylelint/pull/3622)).
- `no-empty-first-line` rule ([#3650](https://github.com/stylelint/stylelint/pull/3650)).
- `at-rule-name-space-after` autofix ([#3653](https://github.com/stylelint/stylelint/pull/3653)).
- `block-closing-brace-empty-line-before` autofix ([#3598](https://github.com/stylelint/stylelint/pull/3617)).
- `block-closing-brace-space-before` autofix ([#3673](https://github.com/stylelint/stylelint/pull/3673)).
- `comment-whitespace-inside` autofix ([#3619](https://github.com/stylelint/stylelint/pull/3619)).
- `declaration-bang-space-after` autofix ([#3598](https://github.com/stylelint/stylelint/pull/3598)).
- `declaration-bang-space-before` autofix ([#3592](https://github.com/stylelint/stylelint/pull/3592)).
- `declaration-colon-newline-after` autofix ([#3588](https://github.com/stylelint/stylelint/pull/3588)).
- `function-comma-space-after` autofix ([#3555](https://github.com/stylelint/stylelint/pull/3555)).
- `function-comma-space-before` autofix ([#3596](https://github.com/stylelint/stylelint/pull/3596)).
- `function-name-case` autofix ([#3674](https://github.com/stylelint/stylelint/pull/3674)).
- `function-max-empty-lines` autofix ([#3645](https://github.com/stylelint/stylelint/pull/3645)).
- `function-parentheses-newline-inside` autofix ([#3601](https://github.com/stylelint/stylelint/pull/3601)).
- `function-whitespace-after` autofix ([#3648](https://github.com/stylelint/stylelint/pull/3648)).
- `media-feature-colon-space-after` autofix ([#3623](https://github.com/stylelint/stylelint/pull/3623)).
- `media-feature-colon-space-before` autofix ([#3637](https://github.com/stylelint/stylelint/pull/3637)).
- `media-feature-name-case` autofix ([#3685](https://github.com/stylelint/stylelint/pull/3685)).
- `media-feature-range-operator-space-after` autofix ([#3639](https://github.com/stylelint/stylelint/pull/3639)).
- `media-feature-range-operator-space-before` autofix ([#3618](https://github.com/stylelint/stylelint/pull/3618)).
- `media-query-list-comma-newline-after` autofix ([#3643](https://github.com/stylelint/stylelint/pull/3643)).
- `media-query-list-comma-space-after` autofix ([#3607](https://github.com/stylelint/stylelint/pull/3607)).
- `media-query-list-comma-space-before` autofix ([#3640](https://github.com/stylelint/stylelint/pull/3640)).
- `function-parentheses-space-inside` autofix ([#3563](https://github.com/stylelint/stylelint/pull/3563)).
- `selector-attribute-brackets-space-inside` autofix ([#3605](https://github.com/stylelint/stylelint/pull/3605)).
- `selector-attribute-operator-space-after` autofix ([#3641](https://github.com/stylelint/stylelint/pull/3641)).
- `selector-attribute-operator-space-before` autofix ([#3603](https://github.com/stylelint/stylelint/pull/3603)).
- `selector-pseudo-class-case` autofix ([#3671](https://github.com/stylelint/stylelint/pull/3671)).
- `selector-pseudo-class-parentheses-space-inside` autofix ([#3646](https://github.com/stylelint/stylelint/pull/3646)).
- `selector-type-case` autofix ([#3668](https://github.com/stylelint/stylelint/pull/3668)).
- `no-eol-whitespace` autofix ([#3615](https://github.com/stylelint/stylelint/pull/3615)).
- `no-extra-semicolons` autofix ([#3574](https://github.com/stylelint/stylelint/pull/3574)).
- `value-list-comma-newline-after` autofix ([#3616](https://github.com/stylelint/stylelint/pull/3616)).
- `value-list-comma-space-after` autofix ([#3558](https://github.com/stylelint/stylelint/pull/3558)).
- `value-list-comma-space-before` autofix ([#3597](https://github.com/stylelint/stylelint/pull/3597)).
- `baseIndentLevel` to `indentation` ([#3557](https://github.com/stylelint/stylelint/pull/3557)).

### Fixed

- autofix for 5 whitespace rules ([#3621](https://github.com/stylelint/stylelint/pull/3621)).
- `linebreaks` TypeError ([#3636](https://github.com/stylelint/stylelint/pull/3636)).
- `max-empty-lines` incorrect line reporting ([#3530](https://github.com/stylelint/stylelint/pull/3530)).
- `media-query-list-comma-newline-after` false positives for trailing comment ([#3657](https://github.com/stylelint/stylelint/pull/3657)).
- `no-descending-specificity` false positives for CSS Modules functional pseudo-classes ([#3623](https://github.com/stylelint/stylelint/pull/3623)).

## 9.5.0 - 2018-08-19

### Added

- bundled support for styles in CSS-in-JS object literals ([#3506](https://github.com/stylelint/stylelint/pull/3506)).
- `--print-config` CLI flag ([#3532](https://github.com/stylelint/stylelint/pull/3532)).
- `block-closing-brace-newline-before` autofix ([#3442](https://github.com/stylelint/stylelint/pull/3442)).
- `block-opening-brace-newline-before` autofix ([#3518](https://github.com/stylelint/stylelint/pull/3518)).
- `block-opening-brace-space-after` autofix ([#3520](https://github.com/stylelint/stylelint/pull/3520)).
- `block-opening-brace-newline-after` autofix ([#3441](https://github.com/stylelint/stylelint/pull/3441)).
- `declaration-block-semicolon-newline-after` autofix ([#3545](https://github.com/stylelint/stylelint/pull/3545)).
- `declaration-block-semicolon-space-before` autofix ([#3554](https://github.com/stylelint/stylelint/pull/3554)).
- `declaration-colon-space-after` autofix ([#3538](https://github.com/stylelint/stylelint/pull/3538)).
- `selector-list-comma-newline-before` autofix ([#3517](https://github.com/stylelint/stylelint/pull/3517)).
- `selector-list-comma-space-after` autofix ([#3490](https://github.com/stylelint/stylelint/pull/3490)).
- `unix` formatter ([#3524](https://github.com/stylelint/stylelint/pull/3524)).

### Fixed

- `selector-descendant-combinator-no-non-space` false positives for calculations with parenthesis ([#3508](https://github.com/stylelint/stylelint/pull/3508)).

## 9.4.0 - 2018-07-25

### Added

- bundled support for styles in CSS-in-JS template literals ([#3405](https://github.com/stylelint/stylelint/pull/3405)).
- `linebreaks` rule ([#3289](https://github.com/stylelint/stylelint/pull/3289)).
- `compact` formatter ([#3488](https://github.com/stylelint/stylelint/pull/3488)).
- `at-rule-semicolon-newline-after` autofix ([#3450](https://github.com/stylelint/stylelint/pull/3450)).
- `block-closing-brace-newline-after` autofix ([#3443](https://github.com/stylelint/stylelint/pull/3443)).
- `block-opening-brace-space-before` autofix ([#3438](https://github.com/stylelint/stylelint/pull/3438)).
- `declaration-block-trailing-semicolon` autofix ([#3382](https://github.com/stylelint/stylelint/pull/3382)).
- `declaration-colon-space-before` autofix ([#3445](https://github.com/stylelint/stylelint/pull/3445)).
- `property-case` autofix ([#3448](https://github.com/stylelint/stylelint/pull/3448)).
- `selector-combinator-space-after` autofix ([#3446](https://github.com/stylelint/stylelint/pull/3446)).
- `selector-combinator-space-before` autofix ([#3457](https://github.com/stylelint/stylelint/pull/3457)).
- `selector-list-comma-space-before` autofix ([#3447](https://github.com/stylelint/stylelint/pull/3447)).

### Fixed

- `block-opening-brace-newline-after` false positives for nested rule-sets prefixed with comments ([#3383](https://github.com/stylelint/stylelint/pull/3383)).
- `declaration-block-trailing-semicolon` report of errors with the `--fix` option ([#3493](https://github.com/stylelint/stylelint/pull/3493)).
- `font-family-name-quotes` false positives for `system-ui` system font ([#3463](https://github.com/stylelint/stylelint/pull/3463)).
- `keyframes-name-pattern` support for raw JS RegExp ([#3437](https://github.com/stylelint/stylelint/pull/3437)).
- `media-feature-name-no-unknown` false positives for level 5 names ([#3397](https://github.com/stylelint/stylelint/pull/3397)).
- `no-descending-specificity` false positives for `#{&}` ([#3420](https://github.com/stylelint/stylelint/pull/3420)).
- `no-missing-end-of-source-newline` false positives for style attributes ([#3485](https://github.com/stylelint/stylelint/pull/3485)).

## 9.3.0 - 2018-06-15

### Added

- support for `<style>` tags and `style=""` attributes in XML and XSLT files ([#3386](https://github.com/stylelint/stylelint/pull/3386)).
- `globbyOptions` option ([#3339](https://github.com/stylelint/stylelint/pull/3339)).
- `keyframes-name-pattern` rule ([#3321](https://github.com/stylelint/stylelint/pull/3321)).
- `media-feature-name-value-whitelist` rule ([#3320](https://github.com/stylelint/stylelint/pull/3320)).
- `selector-pseudo-element-colon-notation` autofix ([#3345](https://github.com/stylelint/stylelint/pull/3345)).

### Fixed

- `.vue` files throwing errors for `<style lang="stylus">` and `<style lang="postcss">` ([#3331](https://github.com/stylelint/stylelint/pull/3331)).
- `declaration-block-no-*` false positives for non-standard syntax ([#3381](https://github.com/stylelint/stylelint/pull/3381)).
- `function-whitespace-after` false positives for "/" ([#3132](https://github.com/stylelint/stylelint/pull/3132)).
- `length-zero-no-unit` incorrect autofix for at-includes ([#3347](https://github.com/stylelint/stylelint/pull/3347)).
- `max-nesting-depth` false positives for nested properties ([#3349](https://github.com/stylelint/stylelint/pull/3349)).
- `no-empty-source` false positives on vue external sources `<style src="*">` tag ([#3331](https://github.com/stylelint/stylelint/pull/3331)).
- `max-line-length` false positives for non-CSS blocks ([#3367](https://github.com/stylelint/stylelint/pull/3367)).
- `no-eol-whitespace` false positives for non-CSS blocks ([#3367](https://github.com/stylelint/stylelint/pull/3367)).
- `no-extra-semicolons` false positives for non-CSS blocks ([#3367](https://github.com/stylelint/stylelint/pull/3367)).
- `no-missing-end-of-source-newline` false positives for non-CSS blocks ([#3367](https://github.com/stylelint/stylelint/pull/3367)).

## 9.2.1 - 2018-05-16

### Fixed

- `cache` option hiding CssSyntaxError outputs ([#3258](https://github.com/stylelint/stylelint/pull/3258)).
- regression with processors (e.g. styled-components) ([#3261](https://github.com/stylelint/stylelint/pull/3261)).
- `no-descending-specificity` false positives for Sass nested properties ([#3283](https://github.com/stylelint/stylelint/pull/3283)).
- `selector-pseudo-class-no-unknown` false positives proprietary webkit pseudo classes when applied to a simple selector ([#3271](https://github.com/stylelint/stylelint/pull/3271)).

## 9.2.0 - 2018-04-01

### Added

- `selector-max-pseudo-class` rule ([#3195](https://github.com/stylelint/stylelint/pull/3195)).

### Fixed

- slow `require('stylelint')` time ([#3242](https://github.com/stylelint/stylelint/pull/3242)).
- autofix erroneously writing to unchanged files ([#3241](https://github.com/stylelint/stylelint/pull/3241)).
- false negatives for template literals within script tags by updating postcss-html dependency ([#3238](https://github.com/stylelint/stylelint/pull/3238)).
- `indentation` false positives for at-root ([#3225](https://github.com/stylelint/stylelint/pull/3225)).
- `max-empty-lines` false positives for non-CSS blocks ([#3229](https://github.com/stylelint/stylelint/pull/3229)).
- `no-empty-source` false positives for non-CSS blocks ([#3240](https://github.com/stylelint/stylelint/pull/3240)).
- `string-no-newline` false positives for non-CSS blocks ([#3228](https://github.com/stylelint/stylelint/pull/3228)).

## 9.1.3 - 2018-03-14

### Fixed

- invalid HTML causing CssSyntaxError by updating postcss-html dependency ([#3214](https://github.com/stylelint/stylelint/pull/3214)).
- empty markdown block causing CssSyntaxError by updating postcss-html dependency ([#3214](https://github.com/stylelint/stylelint/pull/3214)).

## 9.1.2 - 2018-03-13

### Fixed

- parsing of markdown files by updating postcss-html dependency ([#3207](https://github.com/stylelint/stylelint/pull/3207)).

## 9.1.1 - 2018-02-21

### Fixed

- missing `signal-exit` dependency ([#3186](https://github.com/stylelint/stylelint/pull/3186)).

## 9.1.0 - 2018-02-21

### Added

- `ignore: ["first-nested"]` to `at-rule-empty-line-before` ([#3179](https://github.com/stylelint/stylelint/pull/3179)).
- `ignore: ["first-nested"]` to `rule-empty-line-before` ([#3179](https://github.com/stylelint/stylelint/pull/3179)).

### Fixed

- unnecessary Open Collective postinstall message ([#3180](https://github.com/stylelint/stylelint/pull/3180)).

## 9.0.0 - 2018-02-18

### Removed

- Node.js 4.x support. Node.js 6.x or greater is now required ([#3075](https://github.com/stylelint/stylelint/pull/3087)).

### Added

- (experimental) support for [SASS](http://sass-lang.com/) syntax ([#2503](https://github.com/stylelint/stylelint/pull/2503)).
- allow processors to handle PostCSS errors ([#3063](https://github.com/stylelint/stylelint/pull/3063)).
- `--max-warnings` CLI flag ([#2942](https://github.com/stylelint/stylelint/pull/2942)).
- `selector-combinator-*list` rules ([#3088](https://github.com/stylelint/stylelint/pull/3088)).
- `selector-pseudo-element-*list` rules ([#3104](https://github.com/stylelint/stylelint/pull/3087)).
- `ignore: ["first-nested"]` to `custom-property-empty-line-before` ([#3104](https://github.com/stylelint/stylelint/pull/3104)).
- `ignore: ["first-nested"]` to `declaration-empty-line-before` ([#3103](https://github.com/stylelint/stylelint/pull/3103)).
- `ignoreProperties: []` to `property-no-vendor-prefix` ([#3089](https://github.com/stylelint/stylelint/pull/3089)).

### Fixed

- `font-family-name-quotes` unicode range increased ([#2974](https://github.com/stylelint/stylelint/pull/2974)).
- `selector-max-id` in nested at-statements ([#3113](https://github.com/stylelint/stylelint/pull/3113)).

## 8.4.0 - 2017-12-15

### Added

- `except: ["after-closing-brace"]` to `block-closing-brace-empty-line-before` ([#3011](https://github.com/stylelint/stylelint/pull/3011)).

### Fixed

- unmet peer dependency warning for `postcss-sass` ([#3040](https://github.com/stylelint/stylelint/pull/3040)).
- false positives for CSS within comments in `*.pcss` files ([#3064](https://github.com/stylelint/stylelint/pull/3064)).
- `font-family-no-missing-generic-family-keyword` configuration ([#3039](https://github.com/stylelint/stylelint/pull/3039)).
- `indentation` autofix for HTML ([#3044](https://github.com/stylelint/stylelint/pull/3044)).

## 8.3.1 - 2017-11-27

### Fixed

- `font-family-no-missing-generic-family-keyword` false positives for at-font-face ([#3034](https://github.com/stylelint/stylelint/issues/3034)).

## 8.3.0 - 2017-11-26

### Added

- autofix support for stdin input ([#2787](https://github.com/stylelint/stylelint/pull/2787)).
- support for `<style>` tags and markdown fences in `.vue` and `.html` files ([#2975](https://github.com/stylelint/stylelint/pull/2975)).
- `font-family-no-missing-generic-family-keyword` rule ([#2930](https://github.com/stylelint/stylelint/pull/2930)).
- `no-duplicate-at-import-rules` rule ([#2963](https://github.com/stylelint/stylelint/pull/2963)).
- `number-leading-zero` autofix ([#2921](https://github.com/stylelint/stylelint/issues/2921)).
- `number-no-trailing-zeros` autofix ([#2947](https://github.com/stylelint/stylelint/issues/2947)).
- `shorthand-property-no-redundant-values` autofix ([#2956](https://github.com/stylelint/stylelint/issues/2956)).
- `string-quotes` autofix ([#2959](https://github.com/stylelint/stylelint/pull/2959)).
- `ignore: ["custom-properties"]` option to `length-zero-no-unit` ([#2967](https://github.com/stylelint/stylelint/pull/2967)).
- `except: ["inside-block"]` option to `rule-empty-line-before` ([#2982](https://github.com/stylelint/stylelint/pull/2982)).
- `ignoreValues` to `value-no-vendor-prefix` ([#3015](https://github.com/stylelint/stylelint/pull/3015)).
- `ignoreMediaFeatureNames` to `unit-blacklist` ([#3027](https://github.com/stylelint/stylelint/pull/3027)).

### Fixed

- `comment-empty-line-before` false positives for shared-line comments ([#2986](https://github.com/stylelint/stylelint/issues/2986)).
- `unit-*` false positives for spaceless multiplication ([#2948](https://github.com/stylelint/stylelint/issues/2948)).

## 8.2.0 - 2017-10-05

### Added

- autofix of syntax errors in standard CSS e.g. unclosed braces and brackets ([#2886](https://github.com/stylelint/stylelint/issues/2886)).
- `length-zero-no-unit` autofix ([#2861](https://github.com/stylelint/stylelint/issues/2861)).
- `selector-max-specificity` support for level 4 evaluation context pseudo-classes ([#2857](https://github.com/stylelint/stylelint/issues/2857)).
- `ignoreUnits` option to `number-max-precision` ([#2941](https://github.com/stylelint/stylelint/pull/2941)).
- `ignoreSelectors` option to `selector-max-specificity` ([#2857](https://github.com/stylelint/stylelint/pull/2857)).
- `ignoreProperties` option to `value-keyword-case` ([#2937](https://github.com/stylelint/stylelint/pull/2937)).

### Fixed

- `*-empty-line-before` false negatives and positives when two or more `except: [*]` options were triggered ([#2920](https://github.com/stylelint/stylelint/issues/2920)).
- `*-empty-line-before` false positives for CSS in HTML ([#2854](https://github.com/stylelint/stylelint/issues/2854)).
- `rule-empty-line-before` false positives for `ignore: ["inside-block"]` and CSS in HTML ([#2894](https://github.com/stylelint/stylelint/issues/2894)).
- `rule-empty-line-before` false positives for `except: ["after-single-line-comment"]` and preceding shared-line comments ([#2920](https://github.com/stylelint/stylelint/issues/2920)).
- `selector-list-comma-newline-after` false positives for shared-line comments separated by more than once space ([#2915](https://github.com/stylelint/stylelint/issues/2915)).
- `selector-pseudo-class-no-unknown` false positives when using chained pseudo-classes ([#2810](https://github.com/stylelint/stylelint/issues/2810)).
- `string-quotes` false positives for `@charset` and single quotes ([#2902](https://github.com/stylelint/stylelint/issues/2902)).
- `unit-no-unknown` false positives for spaceless multiplication and division in `calc()` functions ([#2848](https://github.com/stylelint/stylelint/issues/2848)).

## 8.1.1 - 2017-09-05

### Fixed

- `--ignore-pattern` in CLI ([#2851](https://github.com/stylelint/stylelint/issues/2851)).

## 8.1.0 - 2017-09-04

### Added

- Allow specifying `codeFilename` to `createStylelintResult` for raw code linting standalone API ([#2450](https://github.com/stylelint/stylelint/issues/2450)).
- `ignorePattern` option (`--ignore-pattern` in CLI), to allow patterns of files to ignored ([#2834](https://github.com/stylelint/stylelint/issues/2834)).
- More rules now support experimental autofixing. Use `--fix` CLI parameter or `fix: true` Node.js API options property. Newly supported rules:
  - `color-hex-length` ([#2781](https://github.com/stylelint/stylelint/pull/2781)).
  - `no-missing-end-of-source-newline` ([#2772](https://github.com/stylelint/stylelint/pull/2772)).

### Fixed

- `*-empty-line-before` false positives shared-line comments and `"first-nested"` option ([#2827](https://github.com/stylelint/stylelint/issues/2827)).
- `color-hex-length` false positives for ID references in `url` functions ([#2806](https://github.com/stylelint/stylelint/issues/2806)).
- `indentation` false positives for Less parametric mixins with rule block/snippet ([#2744](https://github.com/stylelint/stylelint/pull/2744)).
- `no-empty-source` compatibility with `postcss-html` custom syntax ([#2798](https://github.com/stylelint/stylelint/issues/2798)).
- `no-extra-semicolons` false negatives where instances were not detected when followed by multiple comments ([#2678](https://github.com/stylelint/stylelint/issues/2678)).
- `selector-max-specificity` cannot parse selector problem for Less mixins ([#2677](https://github.com/stylelint/stylelint/pull/2677)).

## 8.0.0 - 2017-07-16

This release is accompanied by:

- A new [semantic version policy](docs/about/semantic-versioning.md). The use of the tilde (`~`) in `package.json` is now recommended, e.g. `"stylelint": "~8.0.0"`, to guarantee the results of your builds ([#1865](https://github.com/stylelint/stylelint/issues/1865)).
- A new [VISION document](docs/about/vision.md), complemented by ([#2704](https://github.com/stylelint/stylelint/pull/2704)):
  - The restructuring of the [list of rules](docs/user-guide/rules.md) into three groups:
    - Possible errors
    - Limit language features
    - Stylistic issues
  - The release of a new sharable config, [`stylelint-config-recommended`](https://github.com/stylelint/stylelint-config-recommended). This config only turns on the possible error rules. [`stylelint-config-standard`](https://github.com/stylelint/stylelint-config-standard) now builds on top of the recommended config by turning on over 60 additional stylistic rules.

### Removed

- the 21 rules deprecated in [`7.8.0`](https://github.com/stylelint/stylelint/releases/tag/7.8.0) & [`7.12.0`](https://github.com/stylelint/stylelint/releases/tag/7.12.0) ([#2422](https://github.com/stylelint/stylelint/issues/2422) & [#2693](https://github.com/stylelint/stylelint/issues/2693)).
  - `block-no-single-line`.
  - `custom-property-no-outside-root`
  - `declaration-block-no-ignored-properties`.
  - `declaration-block-properties-order`.
  - `function-url-data-uris`.
  - `media-feature-no-missing-punctuation`.
  - `no-browser-hacks`.
  - `no-indistinguishable-colors`.
  - `no-unsupported-browser-features`.
  - `root-no-standard-properties`
  - `rule-nested-empty-line-before`.
  - `rule-non-nested-empty-line-before`.
  - `selector-no-attribute`.
  - `selector-no-combinator`.
  - `selector-no-empty`.
  - `selector-no-id`.
  - `selector-no-type`.
  - `selector-no-universal`.
  - `selector-root-no-composition`.
  - `stylelint-disable-reason`.
  - `time-no-imperceptible`.
- the 4 options deprecated in [`7.8.0`](https://github.com/stylelint/stylelint/releases/tag/7.8.0) ([#2433](https://github.com/stylelint/stylelint/issues/2433)).
  - `"all-nested"` option for `at-rule-empty-line-before`.
  - `"blockless-group"` option for `at-rule-empty-line-before`.
  - `"between-comments"` option for `comment-empty-line-before`.
  - `"at-rules-without-declaration-blocks"` option for `max-nesting-depth`.

### Changed

- compatibility with `postcss` from `@5` to `@6` ([#2561](https://github.com/stylelint/stylelint/issues/2561)).
- parse errors now trigger exit with non-zero code ([#2713](https://github.com/stylelint/stylelint/issues/2713)).
- `report-needless-disables` now exits with non-zero code ([#2341](https://github.com/stylelint/stylelint/issues/2341)).
- `*-blacklist` and `*-whitelist` (and `ignore* []` secondary options) are now case sensitive. Use regular expressions with the `i` flag for case insensitivity ([#2709](https://github.com/stylelint/stylelint/issues/2709)).
- `*-empty-line-before` now correctly handle shared-line comments ([#2262](https://github.com/stylelint/stylelint/issues/2262)).
- `*-empty-line-before` now consider line as empty if it contains whitespace only ([#2440](https://github.com/stylelint/stylelint/pull/2440)).
- `function-linear-gradient-no-nonstandard-direction` now checks all linear-gradients in a value list ([#2496](https://github.com/stylelint/stylelint/pull/2496)).
- `selector-max-compound-selectors` now checks all resolved selectors, rather than just the deepest ([#2350](https://github.com/stylelint/stylelint/issues/2350)).

### Added

- `disableDefaultIgnores` option (`--disable-default-ignores` in CLI), to allow linting of `node_modules` and `bower_components` directories ([#2464](https://github.com/stylelint/stylelint/pull/2464)).
- more efficient file ignoring with `.stylelintignore` ([#2464](https://github.com/stylelint/stylelint/pull/2464)).
- `ignore: ["child"]` option to `selector-max-type` ([#2701](https://github.com/stylelint/stylelint/pull/2701)).

### Fixed

- `declaration-block-no-redundant-longhand-properties` and `declaration-block-no-shorthand-property-overrides` understand more shorthand properties ([#2354](https://github.com/stylelint/stylelint/pull/2354)).
- `selector-max-type` no longer produces false negatives for when child, next-sibling and following-sibling combinators are used with `ignore: ["descendant"]` ([#2701](https://github.com/stylelint/stylelint/pull/2701)).

## 7.13.0 - 2017-07-10

### Added

- `ignoreAttributes` option to `selector-max-attribute` ([#2722](https://github.com/stylelint/stylelint/pull/2722)).

### Fixed

- `selector-combinator-space-*` false positives for CSS namespaced type selectors ([#2715](https://github.com/stylelint/stylelint/pull/2715)).
- `selector-max-specificity` now ignores nested non-standard selectors ([#2685](https://github.com/stylelint/stylelint/pull/2685)).

## 7.12.0 - 2017-06-26

### Deprecated

- 6 rules, each has been replaced by a more configurable alternative ([#2679](https://github.com/stylelint/stylelint/pull/2679)).
  - `function-url-data-uris` rule. Use either `function-url-scheme-blacklist` or `function-url-scheme-whitelist`.
  - `selector-no-attribute` rule. Use `selector-max-attribute` with `0` as its primary option.
  - `selector-no-combinator` rule. Use `selector-max-combinators` with `0` as its primary option.
  - `selector-no-id` rule. Use `selector-max-id` with `0` as its primary option.
  - `selector-no-type` rule. Use `selector-max-type` with `0` as its primary option.
  - `selector-no-universal` rule. Use `selector-max-universal` with `0` as its primary option.

### Added

- `function-url-scheme-blacklist` rule ([#2626](https://github.com/stylelint/stylelint/pull/2626)).
- `function-url-scheme-whitelist` regex support ([#2662](https://github.com/stylelint/stylelint/pull/2662)).
- `selector-max-attribute` rule ([#2628](https://github.com/stylelint/stylelint/pull/2628)).
- `selector-max-combinators` rule ([#2658](https://github.com/stylelint/stylelint/pull/2658)).
- `selector-max-id` rule ([#2654](https://github.com/stylelint/stylelint/pull/2654)).
- `selector-max-type` rule ([#2665](https://github.com/stylelint/stylelint/pull/2665)).
- `selector-max-universal` rule ([#2653](https://github.com/stylelint/stylelint/pull/2653)).

### Fixed

- `--fix` no longer crashes when used with ignored files ([#2652](https://github.com/stylelint/stylelint/pull/2652)).
- `max-*` rules now use singular and plural nouns in their messages ([#2663](https://github.com/stylelint/stylelint/pull/2663)).

## 7.11.1 - 2017-06-15

### Fixed

- `media-feature-name-*list` now accept arrays for their primary options ([#2632](https://github.com/stylelint/stylelint/pull/2632)).
- `selector-*` now ignore custom property sets ([#2634](https://github.com/stylelint/stylelint/pull/2634)).
- `selector-pseudo-class-no-unknown` now ignores Less `:extend` ([#2625](https://github.com/stylelint/stylelint/pull/2625)).

## 7.11.0 - 2017-06-09

### Added

- experimental autofixing ([#2467](https://github.com/stylelint/stylelint/pull/2467), [#2500](https://github.com/stylelint/stylelint/pull/2500), [#2529](https://github.com/stylelint/stylelint/pull/2529) and [#2577](https://github.com/stylelint/stylelint/pull/2577)). Use `--fix` CLI parameter or `fix: true` Node.js API options property. Supported rules:
  - `at-rule-empty-line-before`
  - `at-rule-name-case`
  - `color-hex-case`
  - `comment-empty-line-before`
  - `custom-property-empty-line-before`
  - `declaration-empty-line-before`
  - `indentation`
  - `rule-empty-line-before`
- `selector-max-class` rule.
- `ignore: ["custom-elements"]` option to `selector-type-no-unknown` ([#2366](https://github.com/stylelint/stylelint/pull/2366)).

### Fixed

- "Cannot find module 'pify'" regression in `node@4` with `npm@2` ([#2614](https://github.com/stylelint/stylelint/pull/2614)).
- no error is thrown when linting a string with `cache` enabled ([#2494](https://github.com/stylelint/stylelint/pull/2494)).
- Less `:extend` is now ignored ([#2571](https://github.com/stylelint/stylelint/pull/2571)).
- `function-parentheses-space-inside` now ignores functions without parameters ([#2587](https://github.com/stylelint/stylelint/pull/2587)).
- `length-zero-no-unit` now correctly handles newlines and no spaces after colon ([#2477](https://github.com/stylelint/stylelint/pull/2477)).
- `selector-descendant-combinator-no-non-space` and `selector-combinator-space-before/after` now understand and check `>>>` shadow-piercing combinator ([#2509](https://github.com/stylelint/stylelint/pull/2509)).
- `selector-descendant-combinator-no-non-space` now ignores Less guards ([#2557](https://github.com/stylelint/stylelint/pull/2557)).
- `selector-pseudo-class-no-unknown` now checks `@page` at-rules and supports `@page` pseudo-classes ([#2445](https://github.com/stylelint/stylelint/pull/2445)).
- `selector-pseudo-class-no-unknown` now considers `focus-ring`, `playing` and `paused` to be known ([#2507](https://github.com/stylelint/stylelint/pull/2507)).
- `selector-type-no-unknown` now ignores MathML tags ([#2478](https://github.com/stylelint/stylelint/pull/2478)).
- `selector-type-no-unknown` now ignores the `/deep/` shadow-piercing combinator ([#2508](https://github.com/stylelint/stylelint/pull/2508)).
- `value-keyword-case` now ignores variables with signs ([#2558](https://github.com/stylelint/stylelint/pull/2558)).

## 7.10.1 - 2017-04-02

### Fixed

- scope is kept when using `schema.preceedingPlugins` ([#2455](https://github.com/stylelint/stylelint/pull/2455)).

## 7.10.0 - 2017-04-01

### Added

- support for asynchronous plugin rules ([#2351](https://github.com/stylelint/stylelint/pull/2351)).
- `cache` option to store the info about processed files in order to only operate on the changed ones the next time you run Stylelint ([#2293](https://github.com/stylelint/stylelint/pull/2293)).
- `at-rule-semicolon-space-before` rule ([#2388](https://github.com/stylelint/stylelint/pull/2388)).
- `ignore: ["comments"]` to `max-empty-lines` ([#2401](https://github.com/stylelint/stylelint/pull/2401)).
- `ignore: ["default-namespace"]` to `selector-type-no-unknown` ([#2461](https://github.com/stylelint/stylelint/pull/2461)).
- `ignoreDefaultNamespaces` option to `selector-type-no-unknown` ([#2461](https://github.com/stylelint/stylelint/pull/2461)).

### Fixed

- more helpful messages when file globs do not match any files ([#2328](https://github.com/stylelint/stylelint/pull/2328)).
- `decl/` folder of Flow types is shipped with the package, for consumers that use Flow ([#2322](https://github.com/stylelint/stylelint/issues/2322)).
- `function-url-scheme-whitelist` was working incorrectly if more than one URL scheme were specified ([#2447](https://github.com/stylelint/stylelint/pull/2447)).
- `no-duplicate-selector` now includes the duplicate selector's first usage line in message ([#2415](https://github.com/stylelint/stylelint/pull/2415)).
- `no-extra-semicolons` false positives for comments after custom property sets ([#2396](https://github.com/stylelint/stylelint/pull/2396)).
- `value-keyword-case` false positives for `attr`, `counter`, `counters` functions and `counter-reset` property ([#2407](https://github.com/stylelint/stylelint/pull/2407)).
- Less mergeable properties are now ignored ([#2570](https://github.com/stylelint/stylelint/pull/2570)).

## 7.9.0 - 2017-02-19

### Added

- `ignoreFontFamilyName` option to `font-family-no-duplicate` ([#2314](https://github.com/stylelint/stylelint/pull/2314)).
- `ignorePattern` option to `max-line-length` ([#2333](https://github.com/stylelint/stylelint/pull/2333)).

### Fixed

- update version of `lodash` dependency to match feature usage, fixing a conflict with Modernizr ([#2353](https://github.com/stylelint/stylelint/pull/2353)).
- `color-hex-case` false positives for ID references in `url` functions ([#2338](https://github.com/stylelint/stylelint/pull/2338)).
- `max-line-length` now reports correct column for SCSS comments ([#2340](https://github.com/stylelint/stylelint/pull/2340)).
- `selector-class-pattern` false positive in SCSS when combining interpolated and nested selectors ([#2344](https://github.com/stylelint/stylelint/pull/2344)).
- `selector-type-case` false positive for placeholder selectors ([#2360](https://github.com/stylelint/stylelint/pull/2360)).

## 7.8.0 - 2017-02-02

### Deprecated

- 15 rules ([#2197](https://github.com/stylelint/stylelint/pull/2197), [#2285](https://github.com/stylelint/stylelint/pull/2285) & [#2309](https://github.com/stylelint/stylelint/pull/2309)).
  - `block-no-single-line`. Use `block-opening-brace-newline-after` and `block-closing-brace-newline-before` rules with the option `"always"` instead.
  - `declaration-block-properties-order`. Use the [`stylelint-order`](https://github.com/hudochenkov/stylelint-order) plugin pack instead.
  - `rule-nested-empty-line-before` and `rule-non-nested-empty-line-before`. Use the new `rule-empty-line-before` rule instead.
  - `time-no-imperceptible`. Use the new `time-min-milliseconds` rule with `100` as its primary option.
  - It is beyond the scope of Stylelint's core package to effectively validate against the CSS spec. Please investigate [csstree](https://github.com/csstree/csstree) and [css-values](https://github.com/ben-eb/css-values) for this functionality, and contribute to those projects and to Stylelint plugins wrapping them. csstree already has a [Stylelint plugin](https://github.com/csstree/stylelint-validator), and css-values needs one to be developed. The following rules are deprecated for this reason.
    - `media-feature-no-missing-punctuation`.
    - `selector-no-empty`.
  - A plugin is a better package for a rule that wraps a third-party library. The following rules are deprecated for this reason. We encourage users to create and help maintain plugins for these rules.
    - `no-browser-hacks`
    - `no-indistinguishable-colors`
    - `no-unsupported-browser-features`
  - The following rules did not seem useful. If you liked these rules, please create plugins for them.
    - `custom-property-no-outside-root`
    - `root-no-standard-properties`
    - `selector-root-no-composition`.
  - The following rules did not work well.
    - `stylelint-disable-reason` could not enforce providing a reason.
    - `declaration-block-no-ignored-properties` could not reliably account for _replaced elements_.
- 4 options ([#2213](https://github.com/stylelint/stylelint/pull/2213)).
  - `"all-nested"` option for `at-rule-empty-line-before`. Use the `"inside-block"` option instead.
  - `"blockless-group"` option for `at-rule-empty-line-before`. Use the `"blockless-after-blockless"` option instead.
  - `"between-comments"` option for `comment-empty-line-before`. Use the `"after-comment"` option instead.
  - `"at-rules-without-declaration-blocks"` option for `max-nesting-depth`. Use the `"blockless-at-rules"` option instead.

### Added

- `time-min-milliseconds` rule, to replace `time-no-imperceptible` ([#2289](https://github.com/stylelint/stylelint/pull/2289)).
- `except: ["after-same-name"]` option to `at-rule-empty-line-before` ([#2225](https://github.com/stylelint/stylelint/pull/2225)).

### Fixed

- `configOverrides` now works with `extends` ([#2295](https://github.com/stylelint/stylelint/pull/2295)).
- `max-line-length` no longer reports incorrect column positions for lines with `url()` or `import` ([#2287](https://github.com/stylelint/stylelint/pull/2287)).
- `selector-pseudo-class-no-unknown` no longer warns for proprietary webkit pseudo-classes ([#2264](https://github.com/stylelint/stylelint/pull/2264)).
- `unit-no-unknown` accepts `fr` units ([#2308](https://github.com/stylelint/stylelint/pull/2308)).

## 7.7.1 - 2016-12-31

### Fixed

- ensure only absolute filepaths are passed to processors ([#2207](https://github.com/stylelint/stylelint/pull/2207)).

## 7.7.0 - 2016-12-18

### Added

- `stylelint.formatters` exposed in public Node.js API ([#2190](https://github.com/stylelint/stylelint/pull/2190)).
- `stylelint.utils.checkAgainstRule` for checking CSS against a standard Stylelint rule _within your own rule_ ([#2173](https://github.com/stylelint/stylelint/pull/2173)).
- `allow-empty-input` flag to CLI ([#2117](https://github.com/stylelint/stylelint/pull/2117)).
- `except: ["after-rule"]` option to `rule-nested-empty-line-before` ([#2188](https://github.com/stylelint/stylelint/pull/2188)).

### Fixed

- regression causing `--stdin-filename` in CLI and `codeFilename` in Node.js API to error if a nonexistent filename is provided ([#2128](https://github.com/stylelint/stylelint/pull/2128)).
- a boolean CLI flag (e.g. `--quiet`) placed before an input glob no longer causes the input to be ignored ([#2186](https://github.com/stylelint/stylelint/pull/2186)).
- the `node_modules` and `bower_components` directories are correctly ignored by default when Stylelint is used as a PostCSS plugin ([#2171](https://github.com/stylelint/stylelint/pull/2171)).
- bug where some Node.js errors in special cases did not cause the CLI to exit with a non-zero code ([#2140](https://github.com/stylelint/stylelint/pull/2140)).
- false positives related to LESS detached rulesets ([#2089](https://github.com/stylelint/stylelint/pull/2089)).
- `color-named` now ignores SCSS maps, so map property names can be color names ([#2182](https://github.com/stylelint/stylelint/pull/2182)).
- `comment-whitespace-inside` no longer complains about `/*!` comments with non-space whitespace (e.g. newlines) ([#2121](https://github.com/stylelint/stylelint/pull/2121)).
- `media-feature-name-no-vendor-prefix` no longer throws syntax errors on unknown unprefixed variants ([#2152](https://github.com/stylelint/stylelint/pull/2152)).
- `selector-max-compound-selectors` ignores SCSS nested declarations ([#2102](https://github.com/stylelint/stylelint/pull/2102)).
- `selector-pseudo-class-no-unknown` no longer reports false positives for custom selectors ([#2147](https://github.com/stylelint/stylelint/pull/2147)).

## 7.6.0 - 2016-11-19

### Added

- option `customSyntax` (for Node.js API) and `--custom-syntax` (for CLI).
- `font-family-no-duplicate-names` rule.

### Fixed

- CLI now understands absolute paths for the `--custom-formatter` option.
- the `string` and `verbose` formatters now use `dim` instead of `gray` for greater compatibility with different terminal color schemes.
- `media-feature-parentheses-space-inside` handles comments within the parentheses.
- `selector-no-qualifying-type` now ignores SCSS `%placeholders`.

## 7.5.0 - 2016-10-19

### Added

- `selector-no-empty` rule.

### Fixed

- if no config is found relative to the stylesheet, look for one relative to `process.cwd()`.
- lookup `ignoreFiles` globs relative to `process.cwd()` if config is directly passed as a JS object and no `configBasedir` is provided.
- SugarSS no longer reports wrong column number in `block-no-empty`.
- `configOverrides` work with `plugins`, `extends`, and `processors`.
- a bug causing inaccuracy in nested `stylelint-disable` and `stylelint-enable` comments.
- `function-calc-no-unspaced-operator` false positives for SCSS interpolation.
- `no-descending-specificity` now ignores custom property sets.
- `value-keyword-case` false positives for some camel-case SVG keywords.

## 7.4.2 - 2016-10-10

### Fixed

- regression where using `null` to turn off a rule caused errors.

## 7.4.1 - 2016-10-09

### Fixed

- regression where using `null` for rules that take an array for their primary option would trigger a validation warning.

## 7.4.0 - 2016-10-08

### Added

- each stylesheet looks up configuration from its own path. Different files can now use different configurations during the same linting process.
- relative path extends, plugins, and processors try to load from `process.cwd()` if they aren't found relative to the invoking configuration.
- `/* stylelint-disable-next-line */` comments.
- `media-feature-name-blacklist` rule.
- `media-feature-name-whitelist` rule.
- `ignore: ["after-declaration"]` option to `declaration-empty-line-before`.
- `except: ["empty"]` option to `function-url-quotes`.

### Fixed

- `function-linear-gradient-no-nonstandard-direction` no longer warns when vendor-prefixed linear-gradient properties are used correctly.
- `no-extra-semicolons` now ignores the semicolon that comes after the closing brace of a custom property set.
- `no-unknown-animations` no longer delivers false positives when there are multiple animation names.
- `number-*` rules now ignore numbers in comments and strings.
- `value-keyword-case` now ignores system color keywords.

## 7.3.1 - 2016-09-20

### Fixed

- regression in 7.3.0 which caused a "Cannot read property 'length' of undefined" error on a certain selector.

## 7.3.0 - 2016-09-19

### Added

- `processors` can accept options objects.
- `ignore: ["inside-function"]` option to `color-named`.

### Fixed

- `--ignore-path` and `--report-needless-disables` no longer fails when used together.
- `block-closing-brace-newline-after` and `block-closing-brace-space-after` now allow a trailing semicolon after the closing brace of a block.
- `block-no-single-line` now ignores empty blocks.
- `declaration-block-no-ignored-properties` now uses the value of the last occurrence of a triggering property.
- `indentation` now correctly handles `_` hacks on property names.
- `property-no-unknown` now ignores SCSS nested properties.

## 7.2.0 - 2016-08-28

### Added

- `--report-needless-disables` and `reportNeedlessDisables` option.
- `--ignore-disables` and `ignoreDisables` option.
- `--config-basedir` option to CLI.
- `declaration-block-no-redundant-longhand-properties` rule.
- `function-url-scheme-whitelist` rule.
- `media-feature-name-no-unknown` rule.
- `selector-descendant-combinator-no-non-space` rule.
- `value-list-max-empty-lines` rule.
- `ignoreProperties` option to `color-named`.
- `ignore: ["consecutive-duplicates-with-different-values"]` option to `declaration-block-no-duplicate-properties`.
- `ignore: ["comments"]` option to `max-line-length`.
- `ignoreAtRules` option to `max-nesting-depth`.
- `ignoreProperties` option to `unit-blacklist` and `unit-whitelist`.

### Fixed

- no longer parsing ignored files before ignoring them.
- `configFile` and `configBasedir` can now be used together.
- `max-line-length` now correctly handles Windows line endings.
- `no-descending-specificity` treats selectors with pseudo-elements as distinct from their counterparts without pseudo-classes, because they actually target different elements.
- `no-unknown-animations` and `unit-blacklist` now handle numbers without leading zeros.
- `root-no-standard-properties` now handles custom property sets.
- `selector-no-type` `ignore: ["descendant"]` option now correctly handles descendants within a selector list.
- `selector-pseudo-class-no-unknown` now understands the Shadow DOM selectors of `host` and `host-context`.
- `selector-pseudo-element-no-unknown` now understands the Shadow DOM selector of `slotted`.

## 7.1.0 - 2016-08-02

### Added

- `block-closing-brace-empty-line-before` rule.
- `comment-no-empty` rule.
- `custom-property-empty-line-before` rule.
- `declaration-empty-line-before` rule.
- `media-feature-name-case` rule.
- `selector-nested-pattern` rule.
- `selector-pseudo-class-blacklist` rule.
- `selector-pseudo-class-whitelist` rule.
- regex support to the `ignore*` secondary options of the `*-no-unknown` rules.
- `ignore: ["blockless-after-same-name-blockless"]` option to `at-rule-empty-line-before`.
- `except: ["blockless-after-same-name-blockless"]` option to `at-rule-empty-line-before`.
- `ignore: ["empty-lines"]` option to `no-eol-whitespace`.
- `ignoreTypes` option to `selector-no-type` to whitelist allowed types for selectors.

### Fixed

- `color-named` now ignores declarations that accept _custom idents_.
- `font-family-name-quotes` correctly handles numerical font weights for the `font` shorthand property.
- `indentation` now correctly handles Windows line endings within parentheticals.
- `media-feature-no-missing-punctuation` now ignores media features containing complex values e.g. `(min-width: ($var - 20px))` and `(min-width: calc(100% - 20px))`.
- `no-descending-specificity` message to correctly show which selector should come first.
- `selector-combinator-space-after` and `selector-combinator-space-before` now ignore operators within parenthetical non-standard constructs.

## 7.0.3 - 2016-07-18

### Fixed

- bug causing rules in extended configs to be merged with, rather than replaced by, the extending config.
- `selector-class-pattern` now ignores fractional keyframes selectors.
- `selector-max-specificity` now ignores selectors containing the `matches()` pseudo-class, and warns if the underlying `specificity` module cannot parse the selector.
- `selector-no-type` with secondary option `ignore: ["descendant"]` will now resolve nested selectors.

## 7.0.2 - 2016-07-14

### Fixed

- `at-rule-blacklist`, `at-rule-whitelist`, `comment-word-blacklist`, `selector-attribute-operator-blacklist`, `selector-attribute-operator-whitelist` now accept array as first option.
- `unit-*` rules now ignore CSS hacks.

## 7.0.1 - 2016-07-13

### Fixed

- missing `known-css-properties` dependency.

## 7.0.0 - 2016-07-13

### Removed

- `--extract` and `extractStyleTagsFromHtml` options. Instead, build and use processors.
- support for plugin rule names that aren't namespaced, i.e. only `your-namespace/your-rule-name` rule names are supported. (If your plugin provides only a single rule or you can't think of a good namespace, you can simply use `plugin/my-rule`.)
- `--verbose` CLI flag. Use `--formatter verbose` instead.
- NodeJS `0.12.x` support. `4.2.1 LTS` or greater is now required.
- `media-query-parentheses-space-inside` rule. Use the new `media-feature-parentheses-space-inside` rule instead.
- `no-missing-eof-newline` rule. Use the new rule `no-missing-end-of-source-newline` instead.
- `number-zero-length-no-unit` rule. Use the `length-zero-no-unit` rule instead.
- `property-unit-blacklist` rule. Use the `declaration-property-unit-blacklist` rule instead.
- `property-unit-whitelist` rule. Use the `declaration-property-unit-whitelist` rule instead.
- `property-value-blacklist` rule. Use the `declaration-property-value-blacklist` rule instead.
- `property-value-whitelist` rule. Use the `declaration-property-value-whitelist` rule instead.
- `"emptyLineBefore"` option for `declaration-block-properties-order`. If you use this option, please consider creating a plugin for the community.
- `"single-where-required"`, `"single-where-recommended"`, `"single-unless-keyword"`, `"double-where-required"`, `"double-where-recommended"` and `"double-unless-keyword"` options for `font-family-name-quotes`. Instead, use the `"always-unless-keyword"`, `always-where-recommended` or `always-where-required` options together with the `string-quotes` rule.
- `"single"`, `"double"` and `"none"` options for `function-url-quotes`. Instead, use the `"always"` or `"never"` options together with the `string-quotes` rule.
- `"hierarchicalSelectors"` option for `indentation`. If you use this option, please consider creating a plugin for the community.
- `stylelint.utils.cssWordIsVariable()`.
- `stylelint.utils.styleSearch()`. Use the external [style-search](https://github.com/davidtheclark/style-search) module instead.

### Changed

- invalid configuration sets result's `stylelintError` to `true`, which in turn causes CLI to exit with a non-zero code.
- non-standard syntaxes are automatically inferred from file extensions `.scss`, `.less`, and `.sss`.
- `.stylelintignore` now uses `.gitignore` syntax, and Stylelint looks for it in `process.cwd()`.
- files matching ignore patterns no longer receive an "info"-severity message, which was always printed by the string formatter. Instead, the file's Stylelint result object receives an `ignored: true` property, which various formatters can use as needed. The standard `string` formatter prints nothing for ignored files; but when the `verbose` formatter is used, ignored files are included in the filelist.
- plugin arrays in extended configs are now concatenated with the main config's plugin array, instead of being overwritten by it. So plugins from the main config and from extended configs will all be loaded.
- `-v` flag to display version number.
- `comment-word-blacklist` no longer ignores words within copyright comments.
- `comment-word-blacklist` will now identify strings within comments, rather than just at the beginning of, when the string option is used.
- `declaration-block-no-ignored-properties` now detects use of `min-width` and `max-width` with `inline`, `table-row`, `table-row-group`, `table-column` and `table-column-group` elements.
- `declaration-block-no-ignored-properties` now detects use of `overflow`, `overflow-x` and `overflow-y` with `inline` elements.
- `declaration-block-no-ignored-properties` now ignores the combination of `float` and `display: inline-block | inline`.
- `font-family-name-quotes` now checks the `font` property in addition to the `font-family` property.
- `font-family-name-quotes` treats `-apple-*` and `BlinkMacSystemFont` system fonts as keywords that should never be wrapped in quotes.
- `indentation` now checks inside of parentheses by default. If you use the `indentInsideParens: "once"` secondary option, simply remove it from your config. If you do not want to check inside of parentheses, use the new `ignore: ["inside-parens"]` secondary option. The `indentInsideParens: "twice"` and `indentInsideParens: "once-at-root-twice-in-block"` secondary options are unchanged.
- `keyframe-declaration-no-important` now checks vendor prefixed `@keyframes` at-rules.
- `selector-attribute-quotes` now checks attribute selectors with whitespace around the operator or inside the brackets.
- `time-no-imperceptible` now checks vendor prefixed properties.
- `unit-*` rules now check `@media` values too.

### Added

- plugins can allow primary option arrays by setting `ruleFunction.primaryOptionArray = true`.
- processors.
- `media-feature-parentheses-space-inside` rule.
- `no-missing-end-of-source-newline` rule.
- `property-no-unknown` rule.

### Fixed

- Better handling quotes in selector attribute with multiple attributes.
- `no-unknown-animations` now classifies vendor prefixed `@keyframes` at-rules as known.

## 6.9.0 - 2016-07-07

### Added

- `defaultSeverity` configuration option.
- invoking the CLI with no arguments and no stdin (i.e. just `stylelint`) is equivalent to `stylelint --help`.
- `function-url-no-scheme-relative` rule.
- `selector-attribute-quotes` rule.

### Fixed

- the CLI now uses `process.exitCode` with `stdOut` to allow the process to exit naturally and avoid truncating output.
- `function-calc-no-unspaced-operator` correctly interprets negative fractional numbers without leading zeros and those wrapped in parentheses.
- `no-extra-semicolons` now ignores semicolons after Less mixins.
- `number-max-precision` now ignores uppercase and mixed case `@import` at-rules.
- `selector-max-specificity` no longer crashes on selectors containing `:not()` pseudo-classes.
- `time-no-imperceptible` correctly handles negative time.

## 6.8.0 - 2016-06-30

### Deprecated

- `-e` and `--extract` CLI flags, and the `extractStyleTagsFromHtml` Node.js API option. If you use these flags or option, please consider creating a processor for the community.

### Added

- `at-rule-no-unknown` rule.
- `no-empty-source` rule.
- `except: ["after-single-line-comment"]` option for `rule-non-nested-empty-line-before`.
- `ignoreProperties: []` option for `declaration-block-no-duplicate-properties`.

### Fixed

- accuracy of warning positions for empty blocks when using SugarSS parser.

## 6.7.1 - 2016-06-23

### Fixed

- `block-*-brace-*-before` CRLF (`\r\n`) warning positioning.
- `no-descending-specificity` now does comparison of specificity using ints, rather than strings.
- `selector-no-type` and `selector-type-case` now ignore non-standard keyframe selectors (e.g. within an SCSS mixin).
- `selector-type-no-unknown` no longer reports fractional keyframe selectors.

## 6.7.0 - 2016-06-20

### Added

- `ignoreFunctions: []` option for `function-name-case`.

### Fixed

- rules using `findFontFamily` util correctly interpret `<font-size>/<line-height>` values with unitless line-heights.
- `indentation` better understands nested parentheticals that aren't just Sass maps and lists.
- `no-unsupported-browser-features` message now clearly states that only _fully_ supported features are allowed.
- `selector-max-specificity` no longer reports that a selector with 11 elements or more has a higher specificity than a selector with a single classname.
- `selector-type-no-unknown` no longer warns for complex keyframe selectors.

## 6.6.0 - 2016-06-13

### Deprecated

- `number-zero-length-no-unit`. Use `length-zero-no-unit` instead.
- `property-*-blacklist` and `property-*-whitelist`. Use `declaration-property-*-blacklist` and `declaration-property-*-whitelist` instead.
- `-v` and `--verbose` CLI flags. Use `-f verbose` or `--formatter verbose` instead.
- `stylelint.util.styleSearch()`. Use the external module [style-search](https://github.com/davidtheclark/style-search) instead.

### Added

- option `ignorePath` (for JS) and `--ignore-path` (for CLI).
- `-h` alias for `--help` CLI flag.
- `at-rule-blacklist` rule.
- `at-rule-name-newline-after` rule.
- `at-rule-whitelist` rule.
- `ignore: "blockless-group"` option for `at-rule-empty-line-before`.
- `ignoreAtRules: []` option for `at-rule-empty-line-before`.
- `function-blacklist` now accepts regular expressions.
- `function-whitelist` now accepts regular expressions.

### Fixed

- crash when tty columns is reported as zero, which happened when running Stylelint on Travis CI in OSX.
- selector-targeting rules ignore Less mixins and extends.
- `at-rule-name-newline-after` now correctly accepts one _or more_ newlines.
- `declaration-block-semicolon-newline-before` now correctly accepts one _or more_ newlines.
- `function-url-quotes` ignores values containing `$sass` and `@less` variables.
- `function-whitespace-after` ignores `postcss-simple-vars`-style interpolation.
- `indentation` better understands nested parentheticals, like nested Sass maps.
- `no-extra-semicolons` reports errors on the correct line.
- `selector-combinator-space-*` rules now ignore escaped combinator-like characters.
- `selector-type-no-unknown` ignores non-standard usage of percentage keyframe selectors (e.g. within an SCSS mixin).
- `value-keyword-case` now ignores custom idents of properties `animation`, `font`, `list-style`.

## 6.5.1 - 2016-05-22

### Deprecated

- `"emptyLineBefore"` option for `declaration-block-properties-order`. If you use this option, please consider creating a plugin for the community.
- `"single-where-required"`, `"single-where-recommended"`, `"single-unless-keyword"`, `"double-where-required"`, `"double-where-recommended"` and `"double-unless-keyword"` options for `font-family-name-quotes`. Instead, use the `"always-unless-keyword"`, `always-where-recommended` or `always-where-required` options together with the `string-quotes` rule.
- `"single"`, `"double"` and `"none"` options for `function-url-quotes`. Instead, use the `"always"` or `"never"` options together with the `string-quotes` rule.
- `"hierarchicalSelectors"` option for `indentation`. If you use this option, please consider creating a plugin for the community.

### Fixed

- the string formatter no longer errors on non-rule errors.
- `selector-list-comma-*` rules now ignore Less mixins.
- `selector-max-compound-selectors` no longer errors on Less mixins.
- `selector-type-no-unknown` now ignores all _An+B notation_ and linguistic pseudo-classes.
- `selector-type-no-unknown` now ignores obsolete HTML tags and `<hgroup>`.

## 6.5.0 - 2016-05-20

### Added

- `selector-max-compound-selectors` rule.

### Fixed

- `babel-polyfill` removed so it doesn't clash with other processes using `babel-polyfill`.
- `selector-type-case` and `selector-type-no-unknown` rules now ignore SCSS placeholder selectors.

## 6.4.2 - 2016-05-19

### Fixed

- `selector-pseudo-class-case`, `selector-pseudo-class-no-unknown`, `selector-pseudo-element-case`, `selector-pseudo-element-no-unknown` rules now ignore SCSS variable interpolation.
- `selector-type-no-unknown` now ignores nested selectors and keyframe selectors.

## 6.4.1 - 2016-05-18

### Fixed

- `shorthand-property-no-redundant-values` now ignores `background`, `font`, `border`, `border-top`, `border-bottom`, `border-left`, `border-right`, `list-style`, `transition` properties.
- `unit-no-unknown` now ignores hex colors.

## 6.4.0 - 2016-05-18

### Added

- `keyframe-declaration-no-important` rule.
- `selector-attribute-operator-blacklist` rule.
- `selector-attribute-operator-whitelist` rule.
- `selector-pseudo-class-no-unknown` rule.
- `selector-type-no-unknown` rule.

### Fixed

- string formatter no longer errors on multi-byte `message`.
- catch errors thrown by `postcss-selector-parser` and register them as PostCSS warnings, providing a better UX for editor plugins.
- some rules now better handle case insensitive CSS identifiers.
- `font-family-name-quotes`, `media-feature-no-missing-punctuation`, `media-query-list-comma-newline-after`, `media-query-list-comma-newline-before`, `media-query-list-comma-space-after` and `media-query-list-comma-space-before` rules now better ignore SCSS, Less variables and nonstandard at-rules.
- `no-unknown-animations` now ignores `ease` value.
- `unit-blacklist`, `unit-case`, `unit-no-unknown`, `unit-whitelist` now better accounts interpolation.
- `unit-no-unknown` no longer breaks Node.js 0.12 (because we've included the Babel polyfill).
- `value-keyword-case` now ignores custom idents of properties `animation-name`, `counter-increment`, `font-family`, `grid-row`, `grid-column`, `grid-area`, `list-style-type`.
- wrong example for `always-multi-line` in rule `block-opening-brace-newline-before` documentation.

## 6.3.3 - 2016-05-08

### Fixed

- `block-closing-brace-newline-before` no longer delivers false positives for extra semicolon.
- `declaration-block-no-ignored-properties` now detects use of `vertical-align` with block-level elements.
- `font-family-name-quotes` is now case insensitive when hunting for font-family properties.
- `number-zero-length-no-unit` now ignores `deg`, `grad`, `turn` and `rad` units.
- `selector-no-type` does a better job when ignoring descendant and compound selectors.

## 6.3.2 - 2016-05-08

### Fixed

- `shorthand-property-no-redundant-values` now handles uppercase values properly.

## 6.3.1 - 2016-05-07

### Fixed

- `declaration-block-no-ignored-properties` now longer crashes on nested rules.

## 6.3.0 - 2016-05-07

### Deprecated

- support for plugin rule names that aren't namespaced i.e. only `your-namespace/your-rule-name` rule names are supported. If your plugin provides only a single rule or you can't think of a good namespace, you can simply use `plugin/my-rule`).

### Added

- support for plugins that provides an array of rules.
- support for extracting and linting CSS from within HTML sources.
- `--stdin-filename` option to CLI.
- `at-rule-name-space-after` rule.
- `no-extra-semicolons` rule.
- `selector-attribute-operator-space-after` rule.
- `selector-attribute-operator-space-before` rule.
- `selector-max-empty-lines` rule.
- `selector-pseudo-element-no-unknown` rule.
- flexible support for end-of-line comments in `at-rule-semicolon-newline-after`, `block-opening-brace-newline-after`, and `declaration-block-semicolon-newline-after`.

### Fixed

- string and verbose formatters no longer use an ambiguous color schemes.
- string formatter no longer outputs an empty line if there are no problems.
- all rules now handle case insensitive CSS identifiers.
- `function-comma-newline-after` now allows end-of-line comments.
- `function-url-quotes` now ignores spaces within `url()`.
- `no-descending-specificity` now ignores trailing colons within selectors.
- `no-indistinguishable-colors` now ignores keyword color names within `url()`.
- `number-max-precision` now ignores `@import` at-rules and `url()` functions.
- `selector-class-pattern` and `selector-id-pattern` rules now ignore SCSS variable interpolation.
- `value-list-comma-*` rules now ignore SCSS maps.

## 6.2.2 - 2016-04-26

### Deprecated

- `stylelint.utils.cssWordIsVariable()` as non-standard syntax utils are now defensive.

### Fixed

- `declaration-colon-*` rules now ignore SCSS lists.
- `font-weight-notation` now ignores SCSS interpolation.
- `rule-nested-empty-line-before` now ignores Less blockless rules (mixin and extend calls).

## 6.2.1 - 2016-04-25

### Fixed

- more problems with exposed `stylelint.createRuleTester`.

## 6.2.0 - 2016-04-25

### Added

- `selector-no-qualifying-type` rule.

### Fixed

- `number-leading-zero` will not check `@import` at-rules.
- `selector-class-pattern` now ignores non-outputting Less mixin definitions and called Less mixins.
- `value-keyword-case` now accounts for camelCase keywords (e.g. `optimizeSpeed`, `optimizeLegibility` and `geometricPrecision`) when the `lower` option is used.
- `testUtils` and `stylelint.createRuleTester` module mistakes.

## 6.1.1 - 2016-04-23

### Fixed

- documentation links to `selector-pseudo-class-parentheses-space-inside` and `selector-attribute-brackets-space-inside`.

## 6.1.0 - 2016-04-22

### Added

- support for `.stylelintignore` file.
- warning message in output when a file is ignored.
- `comment-word-blacklist` rule.
- `selector-attribute-brackets-space-inside` rule.
- `selector-pseudo-class-parentheses-space-inside` rule.
- `shorthand-property-no-redundant-values` rule.
- `ignoreKeywords` option for `value-keyword-case`.

### Fixed

- CRLF (`\r\n`) warning positioning in `string-no-newline`.
- parsing problems when using `///`-SassDoc-style comments.
- `max-empty-lines` places warning at the end of the violating newlines to avoid positioning confusions.

## 6.0.3 - 2016-04-21

### Fixed

- CRLF (`\r\n`) warning positioning in `max-empty-lines` and `function-max-empty-lines`.

## 6.0.2 - 2016-04-20

### Fixed

- `CssSyntaxError` sets `errored` on output to `true`.

## 6.0.1 - 2016-04-19

### Fixed

- `function-name-case` now accounts for camelCase function names (e.g. `translateX`, `scaleX`, etc.) when the `lower` option is used.

## 6.0.0 - 2016-04-19

### Changed

- `CssSyntaxError` is no longer thrown but reported alongside warnings.

### Added

- new look for standard formatter and support for arbitrary severity names.
- exposed `stylelint.utils.cssWordIsVariable()`.
- `at-rule-name-case` rule.
- `function-name-case` rule.
- `property-case` rule.
- `selector-pseudo-class-case` rule.
- `selector-pseudo-element-case` rule.
- `unit-case` rule.
- `value-keyword-case` rule.
- `indentClosingBrace` option to `indentation`.
- `indentInsideParens` option to `indentation`.
- `consecutive-duplicates` option for `declaration-block-no-duplicate-properties` rule.

### Fixed

- `block-no-empty` no longer delivers false positives for less syntax.
- `declaration-block-trailing-semicolon` better understands nested at-rules.
- `number-zero-length-no-unit` now works with `q` unit and ignores `s`, `ms`, `kHz`, `Hz`, `dpcm`, `dppx`, `dpi` units.

## 5.4.0 - 2016-04-09

### Added

- `unit-no-unknown` rule.

### Fixed

- `no-descending-specificity` no longer gets confused when the last part of a selector is a compound selector.
- regression causing `indentation` to complain about Sass maps.
- `declaration-block-no-ignored-properties` now ignore `clear` for `position: absolute` and `position: relative` and does not ignore `float` on `display: table-*`.

## 5.3.0 - 2016-04-07

### Added

- (experimental) support for [Less](http://lesscss.org/) syntax.
- support for [SugarSS](https://github.com/postcss/sugarss) syntax.
- exposed `stylelint.createRuleTester()`.
- `declaration-block-no-ignored-properties` rule.
- `function-max-empty-lines` rule.
- `function-url-data-uris` rule.

### Fixed

- `block-closing-brace-newline-after` accepts single-line comments immediately after the closing brace.
- `block-closing-brace-newline-after` use of "single space", rather than "newline", in its messages.
- `font-weight-notation` now ignores `initial` value.
- `function-*` rules should all now ignore all Sass maps and lists.
- `function-calc-no-unspaced-operator` accepts newlines.
- `function-comma-space-after`, `function-comma-space-before`, `function-parentheses-newline-inside` and `function-parentheses-space-inside` now ignore SCSS maps.
- `max-line-length` options validation.
- `no-unknown-animations` now ignores `none`, `initial`, `inherit`, `unset` values.
- `property-value-blacklist` and `-whitelist` no longer error on properties without a corresponding list entry.
- `selector-class-pattern` now ignores selectors with Sass interpolation.
- `selector-id-pattern` now ignores selectors with Sass interpolation.
- `selector-no-id` now ignores keyframe selectors.
- `unit-blacklist` and `unit-whitelist` now ignores `url` functions.

## 5.2.1 - 2016-03-25

### Fixed

- `function-calc-no-unspaced-operator` now better ignores non-`calc` functions.
- `no-descending-specificity` no longer delivers false positives after second run in Atom linter.
- `stylelint-disable-rule` imported correctly.

## 5.2.0 - 2016-03-25

### Added

- `at-rule-semicolon-newline-after` rule.
- `no-indistinguishable-colors` rule.
- `stylelint-disable-reason` rule.

### Fixed

- `declaration-bang-space-*` understands arbitrary bang declarations (e.g. `!default`).
- `font-weight-notation` now ignore `inherit` value.
- `indentation` treats `@nest` at-rules like regular rules with selectors.
- `no-duplicate-selectors` contextualizes selectors by all at-rules, not just media queries.
- `no-duplicate-selectors` no longer delivers false positives after second run in Atom linter.
- `no-duplicate-selectors` no longer delivers false positives with descendant combinators.
- `number-no-trailing-zeros` no longer delivers false positives in `url()` arguments.
- `root-no-standard-properties` no longer delivers false positives inside the `:not()` pseudo-selector.
- `selector-list-comma-*` rules no longer deliver false positives inside functional notation.

## 5.1.0 - 2016-03-18

### Added

- `selector-type-case` rule.

### Fixed

- no more subtle configuration bug when using extends and plugins together in tangled ways.

## 5.0.1 - 2016-03-12

### Fixed

- `string-no-newline` no longer stumbles when there are comment-starting characters inside strings.

## 5.0.0 - 2016-03-11

### Removed

- `no-indistinguishable-colors` because its dependencies were unusable in Atom. (To be re-evaluated and re-added later.)
- `"warn": true` secondary option. Use `"severity": "warning"`, instead.
- `color-no-named` rule. Use the new `color-named` rule, with the `"never"` option instead.
- `declaration-block-no-single-line` rule. Use the new `block-no-single-line` rule instead.
- `rule-no-duplicate-properties` rule. Use the new `declaration-block-no-duplicate-properties` rule instead.
- `rule-no-shorthand-property-overrides` rule. Use the new `declaration-block-no-shorthand-property-overrides` rule instead.
- `rule-properties-order` rule. Use the new `declaration-block-properties-order` rule instead.
- `rule-trailing-semicolon` rule. Use the new `declaration-block-trailing-semicolon` rule instead.
- `true` option for `emptyLineBefore` when using property groups in `rule-properties-order`. Use the new `"always"` or `"never"` options instead.
- `"always"` option for `font-weight-notation`. Use the new `always-where-possible` option instead.

### Added

- support for overlapping `stylelint-disable` commands.

### Fixed

- `max-nesting-depth` does not warn about blockless at-rules.
- `function-comma-newline-after` and related rules consider input to be multi-line (applying to "always-multi-line", etc.) when the newlines are at the beginning or end of the input.
- `no-indistinguishable-colors` no longer errors on color functions containing spaces, e.g. `rgb(0, 0, 0)`—but also removed the rule (see above).
- `declaration-block-properties-order` no longer fails when an unspecified property comes before or after a specified property in a group with `emptyLineBefore: true`.
- `indentation` no longer has false positives when there are empty lines within multi-line values.
- `declaration-colon-*-after` no longer fail to do their job when you want a space or newline after the colon and instead there is no space at all.

## 4.5.1 - 2016-03-08

### Fixed

- `no-unsupported-browser-features` options now optional.
- `no-duplicate-selectors` now ignores keyframe selectors.

## 4.5.0 - 2016-03-07

### Deprecated

- `"warn": true` secondary option. Use `"severity": "warning"`, instead.
- `color-no-named` rule. Use the new `color-named` rule, with the `"never"` option instead.
- `declaration-block-no-single-line` rule. Use the new `block-no-single-line` rule instead.
- `rule-no-duplicate-properties` rule. Use the new `declaration-block-no-duplicate-properties` rule instead.
- `rule-no-shorthand-property-overrides` rule. Use the new `declaration-block-no-shorthand-property-overrides` rule instead.
- `rule-properties-order` rule. Use the new `declaration-block-properties-order` rule instead.
- `rule-trailing-semicolon` rule. Use the new `declaration-block-trailing-semicolon` rule instead.
- `true` option for `emptyLineBefore` when using property groups in `rule-properties-order`. Use the new `"always"` or `"never"` options instead.
- `"always"` option for `font-weight-notation`. Use the new `always-where-possible` option instead.

### Added

- universal `severity` secondary option as a replacement for `"warn": true` to alter a rule's severity.
- `block-no-single-line` rule.
- `color-named` rule.
- `declaration-block-no-duplicate-properties` rule.
- `declaration-block-no-shorthand-property-overrides` rule.
- `declaration-block-properties-order` rule.
- `declaration-block-trailing-semicolon` rule.
- `max-nesting-depth` rule.
- `no-browser-hacks` rule.
- `no-descending-specificity` rule.
- `no-indistinguishable-colors` rule.
- `no-unsupported-browser-features` rule.
- `selector-max-specificity` rule.
- `string-no-newline` rule.
- `"always"` and `"never"` options to `rule-properties-order`'s `emptyLineBefore` when using property groups.
- `named-where-possible` option to `font-weight-notation`.
- `unspecified: "bottomAlphabetical"` option to the `rule-properties-order` rule.
- `ignoreAtRules: []` option to the `block-opening-brace-space-before` and `block-closing-brace-newline-after` rules.
- support for using the nesting selector (`&`) as a prefix in `selector-no-type`.
- `stylelint-disable-line` feature.
- `withinComments`, `withinStrings`, and `checkStrings` options to `styleSearch`, and `insideString` property to the `styleSearch` match object.
- `resolveNestedSelectors` option to the `selector-class-pattern` rule.

### Fixed

- informative errors are thrown when `stylelint-disable` is misused.
- `selector-no-vendor-prefix` no longer delivers two warnings on vendor-prefixed pseudo-elements with two colons, e.g. `::-moz-placeholder`.
- `no-duplicate-selectors` rule now resolves nested selectors.
- `font-weight-notation` does not throw false warnings when `normal` is used in certain ways.
- `selector-no-*` and `selector-*-pattern` rules now ignore custom property sets.
- nested selector handling for `no-duplicate-selectors`.
- `selector-no-id` does not warn about Sass interpolation inside an `:nth-child()` argument.
- handling of mixed line endings in `rule-nested-empty-line-before`, `rule-non-nested-empty-line-before`, `comment-empty-line-before` and `at-rule-empty-line-before`.
- `number-leading-zero`, `function-comma-space-*`, and `declaration-colon-*` do not throw false positives in `url()` arguments.

## 4.4.0 - 2016-02-20

### Added

- `ignore: "relative"` option for `font-weight-notation`.

### Fixed

- `declaration-colon-space/newline-before/after` rules now ignore scss maps.
- `selector-list-comma-newline-after` allows `//` comments after the comma.

## 4.3.6 - 2016-02-18

### Fixed

- removed `console.log()`s in `property-unit-whitelist`.

## 4.3.5 - 2016-02-17

### Fixed

- removed `console.log()`s in `rule-properties-order`.

## 4.3.4 - 2016-02-17

### Fixed

- option normalization for rules with primary options that are arrays of objects, like `rule-properties-order`.
- accuracy of warning positions are `//` comments when using SCSS parser.
- `no-unknown-animations` ignores variables.
- `no-unknown-animations` does not erroneously flag functions like `steps()` and `cubic-bezier()`.
- clarified error message in `time-no-imperceptible`.
- `font-family-name-quotes` and `font-weight-notation` ignore variables.
- `media-feature-no-missing-punctuation` handles space-padded media features.
- regression causing CLI `--config` relatives paths that don't start with `./` to be rejected.

## 4.3.3 - 2016-02-14

### Fixed

- again removed `stylelint.utils.ruleTester` because its dependencies broke things.

## 4.3.2 - 2016-02-13

### Fixed

- move `tape` to dependencies to support `testUtils`.

## 4.3.1 - 2016-02-13

### Fixed

- include `testUtils` in npm package whitelist.

## 4.3.0 - 2016-02-13

### Added

- `font-family-name-quotes` rule.
- `font-weight-notation` rule.
- `media-feature-no-missing-punctuation` rule.
- `no-duplicate-selectors` rule.
- `no-invalid-double-slash-comments` rule.
- `no-unknown-animations` rule.
- `property-value-blacklist` rule.
- `property-value-whitelist` rule.
- `time-no-imperceptible` rule.
- `ignore: "descendant"` and `ignore: "compounded"` options for `selector-no-type`.
- support for regular expression property identification in `property-blacklist`, `property-unit-blacklist`, `property-unit-whitelist`, `property-value-blacklist`, and `property-whitelist`.
- better handling of vendor prefixes in `property-unit-blacklist` and `property-unit-whitelist`, e.g. if you enter `animation` it now also checks `-webkit-animation`.
- support for using names of modules for the CLI's `--config` argument, not just paths.
- `codeFilename` option to Node.js API.
- exposed rules at `stylelint.rules` to make Stylelint even more extensible.
- brought `stylelint-rule-tester` into this repo, and exposed it at `stylelint.utils.ruleTester`.

### Fixed

- bug in `rule-properties-order` empty line detection when the two newlines were separated by some other whitespace.
- option parsing bug that caused problems when using the `"alphabetical"` primary option with `rule-properties-order`.
- regard an empty string as a valid CSS code.
- `ignoreFiles` handling of absolute paths.
- `ignoreFiles` uses the `configBasedir` option to interpret relative paths.

## 4.2.0 - 2016-02-01

### Added

- support for custom messages with a `message` secondary property on any rule.

### Fixed

- CLI always ignores contents of `node_modules` and `bower_components` directories.
- bug preventing CLI from understanding absolute paths in `--config` argument.
- bug causing `indentation` to stumble over declarations with semicolons on their own lines.

## 4.1.0 - 2016-01-22

### Added

- helpful option validation message when object is expected but non-object provided.

### Fixed

- `selector-no-id` no longer warns about Sass interpolation when multiple interpolations are used in a selector.

## 4.0.0 - 2016-01-20

### Removed

- support for legacy numbered severities.

### Added

- support for extensions on `.stylelintrc` files (by upgrading cosmiconfig).
- `ignore: "non-comments"` option to `max-line-length`.

### Fixed

- `function-whitespace-after` does not expect space between `)` and `}`, so it handles Sass interpolation better.

## 3.2.3 - 2016-01-15

### Fixed

- `selector-no-vendor-prefix` now handles custom-property-sets.

## 3.2.2 - 2016-01-10

### Fixed

- `selector-no-type` ignores `nth-child` pseudo-classes and `@keyframes` selectors.

## 3.2.1 - 2016-01-07

### Fixed

- `max-line-length` handles `url()` functions better.
- `block-opening-brace-newline-after` and `declaration-block-semicolon-newline-after` handle end-of-line comments better.

## 3.2.0 - 2015-12-31

### Added

- `legacyNumberedSeverities` config property to force the legacy severity system.
- `selector-no-id` ignores Sass-style interpolation.

### Fixed

- bug causing extended config to override the config that extends it.

## 3.1.4 - 2015-12-20

### Fixed

- stopped hijacking `--config` property in PostCSS and Node.js APIs. Still using it in the CLI.

## 3.1.3 - 2015-12-17

### Fixed

- bug preventing the disabling of rules analyzing the `root` node, including: `max-line-length`, `max-empty-lines`, `no-eol-whitespace`, `no-missing-eof-newline`, and `string-quotes`.
- bug causing `rule-properties-order` to get confused by properties with an unspecified order.

## 3.1.2 - 2015-12-13

### Fixed

- bug causing an error when `null` was used on rules whose primary options are arrays.

## 3.1.1 - 2015-12-13

### Fixed

- Documentation improvements.

## 3.1.0 - 2015-12-12

### Added

- `stylelint-commands` `ignore` option to `comment-empty-line-before`.

### Fixed

- v3 regression causing bug in `rule-properties-order` and potentially other rules that accept arrays as primary options.
- `no-missing-eof-newline` no longer complains about completely empty files.

## 3.0.3 - 2015-12-11

### Fixed

- list of rules within documentation.

## 3.0.0-3.0.2 - 2015-12-10

### Removed

- `nesting-block-opening-brace-space-before` and `nesting-block-opening-brace-newline-before` rules.

### Changed

- renamed `rule-single-line-max-declarations` to `declaration-block-single-line-max-declarations` and changed scope of the single-line to the declaration block.
- renamed `rule-no-single-line` to `declaration-block-no-single-line` and changed scope of the single-line to the declaration block.
- renamed the `function-space-after` rule to `function-whitespace-after`.
- renamed the `comment-space-inside` rule to `comment-whitespace-inside`.
- renamed the `no-multiple-empty-lines` rule to `max-empty-lines` (takes an `int` as option).
- `plugins` is now an array instead of an object. And plugins should be created with `stylelint.createPlugin()`.

### Deprecated

- numbered severities (0, 1, 2) and will be disabled in `4.0`.

### Added

- cosmiconfig, which means the following:
  - support for YAML `.stylelintrc`
  - support for `stylelint.config.js`
  - support for `stylelint` property in `package.json`
  - alternate config loading system, which stops at the first config found
- asynchronicity to the PostCSS plugin.
- `ignoreFiles` option to config.
- `configFile` option to Node.js API.

### Fixed

- `comment-whitespace-inside` now ignores copyright (`/*!`) and sourcemap (`/*#`) comments.
- `rule-no-duplicate-properties` now ignores the `src` property.

## 2.3.7 - 2015-12-10

### Fixed

- `function-calc-no-unspaced-operator` ignores characters in `$sass` and `@less` variables.
- `rule-properties-order` allows comments at the top of groups that expect newlines before them.
- `styleSearch()` and the rules it powers will not trip up on single-line (`//`) comments.
- `selector-combinator-space-before` now better handles nested selectors starting with combinators.
- `rule-properties-order` now deals property with `-moz-osx-font-smoothing`.

## 2.3.6 - 2015-12-07

### Fixed

- improved documentation of CLI globbing possibilities.
- `rule-properties-order` now accounts for property names containing multiple hyphens.
- `rule-properties-order` grouping bug.

## 2.3.5 - 2015-11-30

### Added

- error about undefined severities blaming Stylelint for the bug.

### Fixed

- `selector-pseudo-element-colon-notation` typo in rule name resulting in undefined severity.

## 2.3.4 - 2015-11-22

### Fixed

- `dist/` build.

## 2.3.3 - 2015-11-22

### Fixed

- `property-whitelist`, `rule-no-duplicate-properties`, and `rule-properties-order` ignore variables (`$sass`, `@less`, and `--custom-property`).
- `root-no-standard-properties` ignores `$sass` and `@less` variables.
- `comment-empty-line-before` and `comment-space-inside` no longer complain about `//` comments.

## 2.3.2 - 2015-11-18

### Fixed

- `number-no-trailing-zeros` no longer flags at-import at-rules.

## 2.3.1 - 2015-11-12

### Fixed

- `selector-no-type` no longer flags the _nesting selector_ (`&`).

## 2.3.0 - 2015-11-10

### Added

- `configFile` option to PostCSS plugin.

### Fixed

- `function-parentheses-newline-inside` and `function-parentheses-space-inside` bug with nested functions.

## 2.2.0 - 2015-11-09

### Added

- `selector-class-pattern` rule.
- `selector-id-pattern` rule.
- `function-parentheses-newline-inside` rule.
- `"always-single-line"` and `"never-single-line"` options to `function-parentheses-space-inside`.

### Fixed

- CLI `syntax` argument bug.

## 2.1.0 - 2015-11-04

### Added

- `color-no-hex` rule.
- `color-no-named` rule.
- `function-blacklist` rule.
- `function-whitelist` rule.
- `unit-blacklist` rule.
- `unit-whitelist` rule.
- `property-unit-blacklist` rule.
- `property-unit-whitelist` rule.
- `rule-single-line-max-declarations` rule.
- `max-line-length` rule.
- `first-nested` exception to `comment-empty-line-before`.
- single value options to `*-blacklist` & `-*whitelist` rules, e.g. `{ "function-blacklist": "calc"}`.
- support for flexible groups to `rule-properties-order`.
- support for an optional empty line between each group to `rule-properties-order`.
- support for mathematical signs in front of Sass and Less variables in `function-calc-no-unspaced-operator`.
- support for arbitrary whitespace after function in `function-space-after`.
- support for arbitrary whitespace at the edge of comments in `comment-space-inside`.

### Fixed

- `comment-space-inside` allows any number of asterisks at the beginning and end of comments.
- bug causing `{ unspecified: "bottom }"` option not to be applied within `rule-properties-order`.
- bug causing `function-comma-*` whitespace rules to improperly judge whether to enforce single- or multi-line options.
- bug when loading plugins from an extended config.
- indentation for function arguments, by ignoring them.

## 2.0.0 - 2015-10-16

### Changed

- plugins are now included and configured via a "locator", rather than either being `required` or being inserted directly into the configuration object as a function.

### Added

- CLI.
- standalone Node.js API.
- quiet mode to CLI and Node.js API.
- support for formatters, including custom ones, to CLI and Node.js API.
- `string` and `json` formatters.
- support for using `.stylelintrc` JSON file.
- support for extending existing configs using the `extends` property.
- support for SCSS syntax parsing to CLI and Node.js API.
- `function-comma-newline-after` rule.
- `function-comma-newline-before` rule.
- `"always-single-line"` and `"never-single-line"` options to `function-comma-space-after` rule.
- `"always-single-line"` and `"never-single-line"` options to `function-comma-space-before` rule.

## 1.2.1 - 2015-10-08

### Fixed

- the `media-query-list-comma-*` rules now only apply to `@media` statements.

## 1.2.0 - 2015-10-06

### Added

- `function-linear-gradient-no-nonstandard-direction` rule.
- `rule-properties-order` now by default ignores the order of properties left out of your specified array; and the options `"top"`, `"bottom"`, and `"ignore"` are provided to change that behavior.
- `rule-properties-order` now looks for roots of hyphenated properties in custom arrays so each extension (e.g. `padding-top` as an extension of `padding`) does not need to be specified individually.
- `"always-single-line"` option to `declaration-colon-space-after`.
- support for declarations directly on root (e.g. Sass variable declarations).

### Fixed

- `declaration-colon-newline-after` `"always-multi-line"` warning message.

## 1.1.0 - 2015-09-19

### Added

- `declaration-colon-newline-after` rule.
- the `indentation` rule now checks indentation of multi-line at-rule params, unless there's the `except` option of `param`.
- support for end-of-line comments in `selector-list-comma-newline-after`.
- protection against `#${sass-interpolation}` in rules checking for hex colors.
- support for strings (translated to RegExps) in `custom-property-pattern` and `custom-media-pattern`.

### Fixed

- bug preventing various rules from registering the correct rule names in their warnings, and therefore also preventing them from being disabled with comments.
- the `color-no-invalid-hex` rule no longer flags hashes in `url()` arguments.
- rules using `node.raw()` instead of `node.raws` to avoid expected errors.

## 1.0.1 - 2015-09-06

### Fixed

- `postcss-selector-parser` updated to improve location accuracy for `selector-no-*` rules.

## 1.0.0 - 2015-09-05

### Removed

- compatibility with PostCSS `4.x`.

### Added

- compatibility with PostCSS `5.0.2+`.

### Fixed

- the accuracy of reported line numbers and columns.

## 0.8.0 - 2015-09-02

### Added

- `after-comment` `ignore` option to the `at-rule-empty-line-before` rule.

### Fixed

- the `indentation` rule now correctly handles `*` hacks on property names.
- the `media-feature-colon-space-after` and `media-feature-colon-space-before` rules now only apply to `@media` statements.
- the `rule-no-shorthand-property-overrides` rule message is now consistent with the other messages.

## 0.7.0 - 2015-08-09

### Added

- invalid options cause the rule to abort instead of performing meaningless checks.
- special warning for missing required options from `validateOptions()`.

## 0.6.2 - 2015-08-04

### Fixed

- npm package no longer includes test files (reducing package size by 500KB).

## 0.6.1 - 2015-08-04

### Fixed

- the `rule-properties-order` and `rule-no-duplicate-properties` rules now correctly check inside @rules.

## 0.6.0 - 2015-07-31

### Added

- `validateOptions` to `stylelint.utils` for use by authors of custom rules.
- `custom-media-pattern` rule.
- `number-max-precision` rule.

## 0.5.0 - 2015-07-30

### Added

- validation of all rule options.

## 0.4.1 - 2015-07-24

### Removed

- `ruleTester` from `stylelint.utils` because of the additional dependencies it forces.

## 0.4.0 - 2015-07-24

### Removed

- `jsesc` devDependency.

### Added

- `rule-no-shorthand-property-overrides` rule.
- `ruleTester` to `stylelint.utils` for use by authors of custom rules.

## 0.3.2 - 2015-07-23

### Fixed

- `hierarchicalSelectors` bug in `indentation` rule.

## 0.3.1 - 2015-07-23

### Fixed

- `~=` is no longer mistaken for combinator in `selector-combinator-space-*`.

## 0.3.0 - 2015-07-22

### Added

- exposure of `report`, `ruleMessages`, and `styleSearch` in `stylelint.utils` for use by external plugin rules.
- plugin rule support.
- `hierarchicalSelectors` option to `indentation` rule.
- `nesting-block-opening-brace-space-before` rule.
- `nesting-block-opening-brace-newline-before` rule.

### Fixed

- the `color-hex-case` rule message is now consistent with the `color-hex-length` rule.
- the `property-blacklist` rule message is now consistent with the `property-whitelist` rule.
- a typo in the `comment-space-inside` rule message.

## 0.2.0 - 2015-07-17

### Added

- `color-hex-case` rule.
- `color-hex-length` rule.

### Fixed

- formalized selector-indentation-checking within the `indentation` rule.
- allow for arbitrary whitespace after the newline in the `selector-list-comma-newline-*` rules.
- `selector-combinator-space-*` no longer checks `:nth-child()` arguments.

## 0.1.2 - 2015-07-15

### Fixed

- nesting support for the `block-opening-brace-newline-before` rule.
- nesting support for the `block-opening-brace-space-before` rule.
- nesting support for the `rule-trailing-semicolon` rule.

## 0.1.1 - 2015-07-12

### Fixed

- nesting support for the `rule-no-duplicate-properties` rule.
- nesting support for the `rule-properties-order` rule.
- whitespace rules accommodate Windows CR-LF line endings.

## 0.1.0 - 2015-07-08

### Added

- ability to disable rules via comments in the CSS.
- `at-rule-empty-line-before` rule.
- `at-rule-no-vendor-prefix` rule.
- `block-closing-brace-newline-after` rule.
- `block-closing-brace-newline-before` rule.
- `block-closing-brace-space-after` rule.
- `block-closing-brace-space-before` rule.
- `block-no-empty` rule.
- `block-opening-brace-newline-after` rule.
- `block-opening-brace-newline-before` rule.
- `block-opening-brace-space-after` rule.
- `block-opening-brace-space-before` rule.
- `color-no-invalid-hex` rule.
- `comment-empty-line-before` rule.
- `comment-space-inside` rule.
- `custom-property-no-outside-root` rule.
- `custom-property-pattern` rule.
- `declaration-bang-space-after` rule.
- `declaration-bang-space-before` rule.
- `declaration-block-semicolon-newline-after` rule.
- `declaration-block-semicolon-newline-before` rule.
- `declaration-block-semicolon-space-after` rule.
- `declaration-block-semicolon-space-before` rule.
- `declaration-colon-space-after` rule.
- `declaration-colon-space-before` rule.
- `declaration-no-important` rule.
- `function-calc-no-unspaced-operator` rule.
- `function-comma-space-after` rule.
- `function-comma-space-before` rule.
- `function-parentheses-space-inside` rule.
- `function-space-after` rule.
- `function-url-quotes` rule.
- `indentation` rule.
- `media-feature-colon-space-after` rule.
- `media-feature-colon-space-before` rule.
- `media-feature-name-no-vendor-prefix` rule.
- `media-feature-range-operator-space-after` rule.
- `media-feature-range-operator-space-before` rule.
- `media-query-list-comma-newline-after` rule.
- `media-query-list-comma-newline-before` rule.
- `media-query-list-comma-space-after` rule.
- `media-query-list-comma-space-before` rule.
- `media-query-parentheses-space-inside` rule.
- `no-eol-whitespace` rule.
- `no-missing-eof-newline` rule.
- `no-multiple-empty-lines` rule.
- `number-leading-zero` rule.
- `number-no-trailing-zeros` rule.
- `number-zero-length-no-unit` rule.
- `property-blacklist` rule.
- `property-no-vendor-prefix` rule.
- `property-whitelist` rule.
- `root-no-standard-properties` rule.
- `rule-nested-empty-line-before` rule.
- `rule-no-duplicate-properties` rule.
- `rule-no-single-line` rule.
- `rule-non-nested-empty-line-before` rule.
- `rule-properties-order` rule.
- `rule-trailing-semicolon` rule.
- `selector-combinator-space-after` rule.
- `selector-combinator-space-before` rule.
- `selector-list-comma-newline-after` rule.
- `selector-list-comma-newline-before` rule.
- `selector-list-comma-space-after` rule.
- `selector-list-comma-space-before` rule.
- `selector-no-attribute` rule.
- `selector-no-combinator` rule.
- `selector-no-id` rule.
- `selector-no-type` rule.
- `selector-no-universal` rule.
- `selector-no-vendor-prefix` rule.
- `selector-pseudo-element-colon-notation` rule.
- `selector-root-no-composition` rule.
- `string-quotes` rule.
- `value-list-comma-newline-after` rule.
- `value-list-comma-newline-before` rule.
- `value-list-comma-space-after` rule.
- `value-list-comma-space-before` rule.
- `value-no-vendor-prefix` rule.
