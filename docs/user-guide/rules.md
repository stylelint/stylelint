# 规则

规则确定了代码检查工具寻找和报告的内容。默认情况下，所有规则都处于关闭状态，并且没有任何规则的默认值。规则遵循一致的命名约定，并且设计为彼此协同工作，您可以在[“关于规则”](about-rules.md)部分中阅读更多相关信息。

内置规则适用于标准 CSS 语法，除了 `indentation` 规则之外，所有规则都将忽略包含非标准语法的结构，例如变量插值和混合。

除了这些规则之外，还有[插件](plugins.md)，它们是社区构建的规则，支持方法论、工具集、*非标准* CSS 功能或非常具体的用例。不要忘记查看[插件](plugins.md)列表以获取更多检查方法。

## 规则列表

以下是 stylelint 中的所有内置规则，首先[按类别](../../VISION.md)，然后按[*事物*](http://apps.workflower.fi/vocabs/css/en)分组。

-   [可能错误](#可能错误).
-   [限制语言功能](#限制语言功能).
-   [风格问题](#风格问题).

### 可能错误

#### 颜色

-   [`color-no-invalid-hex`](../../lib/rules/color-no-invalid-hex/README.md)：禁止使用无效的十六进制颜色。

#### 字体族

-   [`font-family-no-duplicate-names`](../../lib/rules/font-family-no-duplicate-names/README.md)：禁止使用重复的字体族名称。
-   [`font-family-no-missing-generic-family-keyword`](../../lib/rules/font-family-no-missing-generic-family-keyword/README.md): Disallow missing generic families in lists of font family names.

#### 函数

-   [`function-calc-no-invalid`](../../lib/rules/function-calc-no-invalid/README.md): Disallow an invalid expression within `calc` functions.
-   [`function-calc-no-unspaced-operator`](../../lib/rules/function-calc-no-unspaced-operator/README.md): Disallow an unspaced operator within `calc` functions.
-   [`function-linear-gradient-no-nonstandard-direction`](../../lib/rules/function-linear-gradient-no-nonstandard-direction/README.md): Disallow direction values in `linear-gradient()` calls that are not valid according to the [standard syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient#Syntax).

#### 字符串

-   [`string-no-newline`](../../lib/rules/string-no-newline/README.md): Disallow (unescaped) newlines in strings.

#### 单位

-   [`unit-no-unknown`](../../lib/rules/unit-no-unknown/README.md): Disallow unknown units.

#### 属性

-   [`property-no-unknown`](../../lib/rules/property-no-unknown/README.md): Disallow unknown properties.

#### 关键帧声明

-   [`keyframe-declaration-no-important`](../../lib/rules/keyframe-declaration-no-important/README.md): Disallow `!important` within keyframe declarations.

#### 声明块

-   [`declaration-block-no-duplicate-properties`](../../lib/rules/declaration-block-no-duplicate-properties/README.md): Disallow duplicate properties within declaration blocks.
-   [`declaration-block-no-shorthand-property-overrides`](../../lib/rules/declaration-block-no-shorthand-property-overrides/README.md): Disallow shorthand properties that override related longhand properties within declaration blocks.

#### 块

-   [`block-no-empty`](../../lib/rules/block-no-empty/README.md): Disallow empty blocks.

#### 选择器

-   [`selector-pseudo-class-no-unknown`](../../lib/rules/selector-pseudo-class-no-unknown/README.md): Disallow unknown pseudo-class selectors.
-   [`selector-pseudo-element-no-unknown`](../../lib/rules/selector-pseudo-element-no-unknown/README.md): Disallow unknown pseudo-element selectors.
-   [`selector-type-no-unknown`](../../lib/rules/selector-type-no-unknown/README.md): Disallow unknown type selectors.

#### 媒体功能

-   [`media-feature-name-no-unknown`](../../lib/rules/media-feature-name-no-unknown/README.md): Disallow unknown media feature names.

#### @规则

-   [`at-rule-no-unknown`](../../lib/rules/at-rule-no-unknown/README.md): Disallow unknown at-rules.

#### 注释

-   [`comment-no-empty`](../../lib/rules/comment-no-empty/README.md): Disallow empty comments.

#### 一般/表

-   [`no-descending-specificity`](../../lib/rules/no-descending-specificity/README.md): 禁止在具有较高特异性的选择器后出现被其覆盖的较低特异性的选择器。
-   [`no-duplicate-at-import-rules`](../../lib/rules/no-duplicate-at-import-rules/README.md)：禁止在样式表中使用重复的 `@import` 规则。
-   [`no-duplicate-selectors`](../../lib/rules/no-duplicate-selectors/README.md)：禁止样式表中的重复选择器。
-   [`no-empty-source`](../../lib/rules/no-empty-source/README.md)：禁止空源码。
-   [`no-extra-semicolons`](../../lib/rules/no-extra-semicolons/README.md)：不允许额外的分号（可自动修复）。
-   [`no-invalid-double-slash-comments`](../../lib/rules/no-invalid-double-slash-comments/README.md)：禁止 CSS 不支持的双斜杠注释（`//...`）。

### 限制语言功能

#### 颜色

-   [`color-named`](../../lib/rules/color-named/README.md): Require (where possible) or disallow named colors.
-   [`color-no-hex`](../../lib/rules/color-no-hex/README.md): Disallow hex colors.

#### 函数

-   [`function-blacklist`](../../lib/rules/function-blacklist/README.md): Specify a blacklist of disallowed functions.
-   [`function-url-no-scheme-relative`](../../lib/rules/function-url-no-scheme-relative/README.md): Disallow scheme-relative urls.
-   [`function-url-scheme-blacklist`](../../lib/rules/function-url-scheme-blacklist/README.md): Specify a blacklist of disallowed url schemes.
-   [`function-url-scheme-whitelist`](../../lib/rules/function-url-scheme-whitelist/README.md): Specify a whitelist of allowed url schemes.
-   [`function-whitelist`](../../lib/rules/function-whitelist/README.md): Specify a whitelist of allowed functions.

#### 关键帧

-   [`keyframes-name-pattern`](../../lib/rules/keyframes-name-pattern/README.md): Specify a pattern for keyframe names.

#### 数字

-   [`number-max-precision`](../../lib/rules/number-max-precision/README.md): Limit the number of decimal places allowed in numbers.

#### 时间

-   [`time-min-milliseconds`](../../lib/rules/time-min-milliseconds/README.md): Specify the minimum number of milliseconds for time values.

#### 单位

-   [`unit-blacklist`](../../lib/rules/unit-blacklist/README.md): Specify a blacklist of disallowed units.
-   [`unit-whitelist`](../../lib/rules/unit-whitelist/README.md): Specify a whitelist of allowed units.

#### 简写属性

-   [`shorthand-property-no-redundant-values`](../../lib/rules/shorthand-property-no-redundant-values/README.md): Disallow redundant values in shorthand properties (Autofixable).

#### 值

-   [`value-no-vendor-prefix`](../../lib/rules/value-no-vendor-prefix/README.md): Disallow vendor prefixes for values.

#### 自定义属性

-   [`custom-property-pattern`](../../lib/rules/custom-property-pattern/README.md): Specify a pattern for custom properties.

#### 属性

-   [`property-blacklist`](../../lib/rules/property-blacklist/README.md): Specify a blacklist of disallowed properties.
-   [`property-no-vendor-prefix`](../../lib/rules/property-no-vendor-prefix/README.md): Disallow vendor prefixes for properties.
-   [`property-whitelist`](../../lib/rules/property-whitelist/README.md): Specify a whitelist of allowed properties.

#### 声明

-   [`declaration-block-no-redundant-longhand-properties`](../../lib/rules/declaration-block-no-redundant-longhand-properties/README.md): Disallow longhand properties that can be combined into one shorthand property.
-   [`declaration-no-important`](../../lib/rules/declaration-no-important/README.md): Disallow `!important` within declarations.
-   [`declaration-property-unit-blacklist`](../../lib/rules/declaration-property-unit-blacklist/README.md): Specify a blacklist of disallowed property and unit pairs within declarations.
-   [`declaration-property-unit-whitelist`](../../lib/rules/declaration-property-unit-whitelist/README.md): Specify a whitelist of allowed property and unit pairs within declarations.
-   [`declaration-property-value-blacklist`](../../lib/rules/declaration-property-value-blacklist/README.md): Specify a blacklist of disallowed property and value pairs within declarations.
-   [`declaration-property-value-whitelist`](../../lib/rules/declaration-property-value-whitelist/README.md): Specify a whitelist of allowed property and value pairs within declarations.

#### 声明块

-   [`declaration-block-single-line-max-declarations`](../../lib/rules/declaration-block-single-line-max-declarations/README.md): Limit the number of declarations within single line declaration blocks.

#### 选择器

-   [`selector-attribute-operator-blacklist`](../../lib/rules/selector-attribute-operator-blacklist/README.md): Specify a blacklist of disallowed attribute operators.
-   [`selector-attribute-operator-whitelist`](../../lib/rules/selector-attribute-operator-whitelist/README.md): Specify a whitelist of allowed attribute operators.
-   [`selector-class-pattern`](../../lib/rules/selector-class-pattern/README.md): Specify a pattern for class selectors.
-   [`selector-combinator-blacklist`](../../lib/rules/selector-combinator-blacklist/README.md): Specify a blacklist of disallowed combinators.
-   [`selector-combinator-whitelist`](../../lib/rules/selector-combinator-whitelist/README.md): Specify a whitelist of allowed combinators.
-   [`selector-id-pattern`](../../lib/rules/selector-id-pattern/README.md): Specify a pattern for ID selectors.
-   [`selector-max-attribute`](../../lib/rules/selector-max-attribute/README.md): Limit the number of attribute selectors in a selector.
-   [`selector-max-class`](../../lib/rules/selector-max-class/README.md): Limit the number of classes in a selector.
-   [`selector-max-combinators`](../../lib/rules/selector-max-combinators/README.md): Limit the number of combinators in a selector.
-   [`selector-max-compound-selectors`](../../lib/rules/selector-max-compound-selectors/README.md): Limit the number of compound selectors in a selector.
-   [`selector-max-empty-lines`](../../lib/rules/selector-max-empty-lines/README.md): Limit the number of adjacent empty lines within selectors.
-   [`selector-max-id`](../../lib/rules/selector-max-id/README.md): Limit the number of ID selectors in a selector.
-   [`selector-max-pseudo-class`](../../lib/rules/selector-max-pseudo-class/README.md): Limit the number of pseudo-classes in a selector.
-   [`selector-max-specificity`](../../lib/rules/selector-max-specificity/README.md): Limit the specificity of selectors.
-   [`selector-max-type`](../../lib/rules/selector-max-type/README.md): Limit the number of type in a selector.
-   [`selector-max-universal`](../../lib/rules/selector-max-universal/README.md): Limit the number of universal selectors in a selector.
-   [`selector-nested-pattern`](../../lib/rules/selector-nested-pattern/README.md): Specify a pattern for the selectors of rules nested within rules.
-   [`selector-no-qualifying-type`](../../lib/rules/selector-no-qualifying-type/README.md): Disallow qualifying a selector by type.
-   [`selector-no-vendor-prefix`](../../lib/rules/selector-no-vendor-prefix/README.md): Disallow vendor prefixes for selectors.
-   [`selector-pseudo-class-blacklist`](../../lib/rules/selector-pseudo-class-blacklist/README.md): Specify a blacklist of disallowed pseudo-class selectors.
-   [`selector-pseudo-class-whitelist`](../../lib/rules/selector-pseudo-class-whitelist/README.md): Specify a whitelist of allowed pseudo-class selectors.
-   [`selector-pseudo-element-blacklist`](../../lib/rules/selector-pseudo-element-blacklist/README.md): Specify a blacklist of disallowed pseudo-element selectors.
-   [`selector-pseudo-element-whitelist`](../../lib/rules/selector-pseudo-element-whitelist/README.md): Specify a whitelist of allowed pseudo-element selectors.

#### 媒体功能

-   [`media-feature-name-blacklist`](../../lib/rules/media-feature-name-blacklist/README.md): Specify a blacklist of disallowed media feature names.
-   [`media-feature-name-no-vendor-prefix`](../../lib/rules/media-feature-name-no-vendor-prefix/README.md): Disallow vendor prefixes for media feature names.
-   [`media-feature-name-value-whitelist`](../../lib/rules/media-feature-name-value-whitelist/README.md): Specify a whitelist of allowed media feature name and value pairs.
-   [`media-feature-name-whitelist`](../../lib/rules/media-feature-name-whitelist/README.md): Specify a whitelist of allowed media feature names.

#### 自定义媒体

-   [`custom-media-pattern`](../../lib/rules/custom-media-pattern/README.md): Specify a pattern for custom media query names.

#### @规则

-   [`at-rule-blacklist`](../../lib/rules/at-rule-blacklist/README.md): Specify a blacklist of disallowed at-rules.
-   [`at-rule-no-vendor-prefix`](../../lib/rules/at-rule-no-vendor-prefix/README.md): Disallow vendor prefixes for at-rules.
-   [`at-rule-whitelist`](../../lib/rules/at-rule-whitelist/README.md): Specify a whitelist of allowed at-rules.

#### 注释

-   [`comment-word-blacklist`](../../lib/rules/comment-word-blacklist/README.md): Specify a blacklist of disallowed words within comments.

#### 一般/表

-   [`max-nesting-depth`](../../lib/rules/max-nesting-depth/README.md): Limit the depth of nesting.
-   [`no-unknown-animations`](../../lib/rules/no-unknown-animations/README.md): Disallow unknown animations.

### 风格问题

#### 颜色

-   [`color-hex-case`](../../lib/rules/color-hex-case/README.md): Specify lowercase or uppercase for hex colors (Autofixable).
-   [`color-hex-length`](../../lib/rules/color-hex-length/README.md): Specify short or long notation for hex colors (Autofixable).

#### 字体族

-   [`font-family-name-quotes`](../../lib/rules/font-family-name-quotes/README.md): Specify whether or not quotation marks should be used around font family names.

#### 字体粗细

-   [`font-weight-notation`](../../lib/rules/font-weight-notation/README.md): Require numeric or named (where possible) `font-weight` values.

#### 函数

-   [`function-comma-newline-after`](../../lib/rules/function-comma-newline-after/README.md): Require a newline or disallow whitespace after the commas of functions (Autofixable).
-   [`function-comma-newline-before`](../../lib/rules/function-comma-newline-before/README.md): Require a newline or disallow whitespace before the commas of functions (Autofixable).
-   [`function-comma-space-after`](../../lib/rules/function-comma-space-after/README.md): Require a single space or disallow whitespace after the commas of functions (Autofixable).
-   [`function-comma-space-before`](../../lib/rules/function-comma-space-before/README.md): Require a single space or disallow whitespace before the commas of functions (Autofixable).
-   [`function-max-empty-lines`](../../lib/rules/function-max-empty-lines/README.md): Limit the number of adjacent empty lines within functions (Autofixable).
-   [`function-name-case`](../../lib/rules/function-name-case/README.md): Specify lowercase or uppercase for function names (Autofixable).
-   [`function-parentheses-newline-inside`](../../lib/rules/function-parentheses-newline-inside/README.md): Require a newline or disallow whitespace on the inside of the parentheses of functions (Autofixable).
-   [`function-parentheses-space-inside`](../../lib/rules/function-parentheses-space-inside/README.md): Require a single space or disallow whitespace on the inside of the parentheses of functions (Autofixable).
-   [`function-url-quotes`](../../lib/rules/function-url-quotes/README.md): Require or disallow quotes for urls.
-   [`function-whitespace-after`](../../lib/rules/function-whitespace-after/README.md): Require or disallow whitespace after functions (Autofixable).

#### 数字

-   [`number-leading-zero`](../../lib/rules/number-leading-zero/README.md): Require or disallow a leading zero for fractional numbers less than 1 (Autofixable).
-   [`number-no-trailing-zeros`](../../lib/rules/number-no-trailing-zeros/README.md): Disallow trailing zeros in numbers (Autofixable).

#### 字符串

-   [`string-quotes`](../../lib/rules/string-quotes/README.md): Specify single or double quotes around strings (Autofixable).

#### 长度

-   [`length-zero-no-unit`](../../lib/rules/length-zero-no-unit/README.md): Disallow units for zero lengths (Autofixable).

#### 单位

-   [`unit-case`](../../lib/rules/unit-case/README.md): Specify lowercase or uppercase for units (Autofixable).

#### 值

-   [`value-keyword-case`](../../lib/rules/value-keyword-case/README.md): Specify lowercase or uppercase for keywords values (Autofixable).

#### 值列表

-   [`value-list-comma-newline-after`](../../lib/rules/value-list-comma-newline-after/README.md): Require a newline or disallow whitespace after the commas of value lists (Autofixable).
-   [`value-list-comma-newline-before`](../../lib/rules/value-list-comma-newline-before/README.md): Require a newline or disallow whitespace before the commas of value lists.
-   [`value-list-comma-space-after`](../../lib/rules/value-list-comma-space-after/README.md): Require a single space or disallow whitespace after the commas of value lists (Autofixable).
-   [`value-list-comma-space-before`](../../lib/rules/value-list-comma-space-before/README.md): Require a single space or disallow whitespace before the commas of value lists (Autofixable).
-   [`value-list-max-empty-lines`](../../lib/rules/value-list-max-empty-lines/README.md): Limit the number of adjacent empty lines within value lists (Autofixable).

#### 自定义属性

-   [`custom-property-empty-line-before`](../../lib/rules/custom-property-empty-line-before/README.md): Require or disallow an empty line before custom properties (Autofixable).

#### 属性

-   [`property-case`](../../lib/rules/property-case/README.md): Specify lowercase or uppercase for properties (Autofixable).

#### 声明

-   [`declaration-bang-space-after`](../../lib/rules/declaration-bang-space-after/README.md): Require a single space or disallow whitespace after the bang of declarations (Autofixable).
-   [`declaration-bang-space-before`](../../lib/rules/declaration-bang-space-before/README.md): Require a single space or disallow whitespace before the bang of declarations (Autofixable).
-   [`declaration-colon-newline-after`](../../lib/rules/declaration-colon-newline-after/README.md): Require a newline or disallow whitespace after the colon of declarations (Autofixable).
-   [`declaration-colon-space-after`](../../lib/rules/declaration-colon-space-after/README.md): Require a single space or disallow whitespace after the colon of declarations (Autofixable).
-   [`declaration-colon-space-before`](../../lib/rules/declaration-colon-space-before/README.md): Require a single space or disallow whitespace before the colon of declarations (Autofixable).
-   [`declaration-empty-line-before`](../../lib/rules/declaration-empty-line-before/README.md): Require or disallow an empty line before declarations (Autofixable).

#### 声明块

-   [`declaration-block-semicolon-newline-after`](../../lib/rules/declaration-block-semicolon-newline-after/README.md): Require a newline or disallow whitespace after the semicolons of declaration blocks (Autofixable).
-   [`declaration-block-semicolon-newline-before`](../../lib/rules/declaration-block-semicolon-newline-before/README.md): Require a newline or disallow whitespace before the semicolons of declaration blocks.
-   [`declaration-block-semicolon-space-after`](../../lib/rules/declaration-block-semicolon-space-after/README.md): Require a single space or disallow whitespace after the semicolons of declaration blocks (Autofixable).
-   [`declaration-block-semicolon-space-before`](../../lib/rules/declaration-block-semicolon-space-before/README.md): Require a single space or disallow whitespace before the semicolons of declaration blocks (Autofixable).
-   [`declaration-block-trailing-semicolon`](../../lib/rules/declaration-block-trailing-semicolon/README.md): Require or disallow a trailing semicolon within declaration blocks (Autofixable).

#### 块

-   [`block-closing-brace-empty-line-before`](../../lib/rules/block-closing-brace-empty-line-before/README.md): Require or disallow an empty line before the closing brace of blocks (Autofixable).
-   [`block-closing-brace-newline-after`](../../lib/rules/block-closing-brace-newline-after/README.md): Require a newline or disallow whitespace after the closing brace of blocks (Autofixable).
-   [`block-closing-brace-newline-before`](../../lib/rules/block-closing-brace-newline-before/README.md): Require a newline or disallow whitespace before the closing brace of blocks (Autofixable).
-   [`block-closing-brace-space-after`](../../lib/rules/block-closing-brace-space-after/README.md): Require a single space or disallow whitespace after the closing brace of blocks.
-   [`block-closing-brace-space-before`](../../lib/rules/block-closing-brace-space-before/README.md): Require a single space or disallow whitespace before the closing brace of blocks (Autofixable).
-   [`block-opening-brace-newline-after`](../../lib/rules/block-opening-brace-newline-after/README.md): Require a newline after the opening brace of blocks (Autofixable).
-   [`block-opening-brace-newline-before`](../../lib/rules/block-opening-brace-newline-before/README.md): Require a newline or disallow whitespace before the opening brace of blocks (Autofixable).
-   [`block-opening-brace-space-after`](../../lib/rules/block-opening-brace-space-after/README.md): Require a single space or disallow whitespace after the opening brace of blocks (Autofixable).
-   [`block-opening-brace-space-before`](../../lib/rules/block-opening-brace-space-before/README.md): Require a single space or disallow whitespace before the opening brace of blocks (Autofixable).

#### 选择器

-   [`selector-attribute-brackets-space-inside`](../../lib/rules/selector-attribute-brackets-space-inside/README.md): Require a single space or disallow whitespace on the inside of the brackets within attribute selectors (Autofixable).
-   [`selector-attribute-operator-space-after`](../../lib/rules/selector-attribute-operator-space-after/README.md): Require a single space or disallow whitespace after operators within attribute selectors (Autofixable).
-   [`selector-attribute-operator-space-before`](../../lib/rules/selector-attribute-operator-space-before/README.md): Require a single space or disallow whitespace before operators within attribute selectors (Autofixable).
-   [`selector-attribute-quotes`](../../lib/rules/selector-attribute-quotes/README.md): Require or disallow quotes for attribute values.
-   [`selector-combinator-space-after`](../../lib/rules/selector-combinator-space-after/README.md): Require a single space or disallow whitespace after the combinators of selectors (Autofixable).
-   [`selector-combinator-space-before`](../../lib/rules/selector-combinator-space-before/README.md): Require a single space or disallow whitespace before the combinators of selectors (Autofixable).
-   [`selector-descendant-combinator-no-non-space`](../../lib/rules/selector-descendant-combinator-no-non-space/README.md): Disallow non-space characters for descendant combinators of selectors (Autofixable).
-   [`selector-pseudo-class-case`](../../lib/rules/selector-pseudo-class-case/README.md): Specify lowercase or uppercase for pseudo-class selectors (Autofixable).
-   [`selector-pseudo-class-parentheses-space-inside`](../../lib/rules/selector-pseudo-class-parentheses-space-inside/README.md): Require a single space or disallow whitespace on the inside of the parentheses within pseudo-class selectors (Autofixable).
-   [`selector-pseudo-element-case`](../../lib/rules/selector-pseudo-element-case/README.md): Specify lowercase or uppercase for pseudo-element selectors.
-   [`selector-pseudo-element-colon-notation`](../../lib/rules/selector-pseudo-element-colon-notation/README.md): Specify single or double colon notation for applicable pseudo-elements (Autofixable).
-   [`selector-type-case`](../../lib/rules/selector-type-case/README.md): Specify lowercase or uppercase for type selector (Autofixable).

#### 选择器列表

-   [`selector-list-comma-newline-after`](../../lib/rules/selector-list-comma-newline-after/README.md): Require a newline or disallow whitespace after the commas of selector lists (Autofixable).
-   [`selector-list-comma-newline-before`](../../lib/rules/selector-list-comma-newline-before/README.md): Require a newline or disallow whitespace before the commas of selector lists (Autofixable).
-   [`selector-list-comma-space-after`](../../lib/rules/selector-list-comma-space-after/README.md): Require a single space or disallow whitespace after the commas of selector lists (Autofixable).
-   [`selector-list-comma-space-before`](../../lib/rules/selector-list-comma-space-before/README.md): Require a single space or disallow whitespace before the commas of selector lists (Autofixable).

#### 规则

-   [`rule-empty-line-before`](../../lib/rules/rule-empty-line-before/README.md): Require or disallow an empty line before rules (Autofixable).

#### 媒体功能

-   [`media-feature-colon-space-after`](../../lib/rules/media-feature-colon-space-after/README.md): Require a single space or disallow whitespace after the colon in media features (Autofixable).
-   [`media-feature-colon-space-before`](../../lib/rules/media-feature-colon-space-before/README.md): Require a single space or disallow whitespace before the colon in media features (Autofixable).
-   [`media-feature-name-case`](../../lib/rules/media-feature-name-case/README.md): Specify lowercase or uppercase for media feature names (Autofixable).
-   [`media-feature-parentheses-space-inside`](../../lib/rules/media-feature-parentheses-space-inside/README.md): Require a single space or disallow whitespace on the inside of the parentheses within media features (Autofixable).
-   [`media-feature-range-operator-space-after`](../../lib/rules/media-feature-range-operator-space-after/README.md): Require a single space or disallow whitespace after the range operator in media features (Autofixable).
-   [`media-feature-range-operator-space-before`](../../lib/rules/media-feature-range-operator-space-before/README.md): Require a single space or disallow whitespace before the range operator in media features (Autofixable).

#### 媒体查询列表

-   [`media-query-list-comma-newline-after`](../../lib/rules/media-query-list-comma-newline-after/README.md): Require a newline or disallow whitespace after the commas of media query lists (Autofixable).
-   [`media-query-list-comma-newline-before`](../../lib/rules/media-query-list-comma-newline-before/README.md): Require a newline or disallow whitespace before the commas of media query lists.
-   [`media-query-list-comma-space-after`](../../lib/rules/media-query-list-comma-space-after/README.md): Require a single space or disallow whitespace after the commas of media query lists (Autofixable).
-   [`media-query-list-comma-space-before`](../../lib/rules/media-query-list-comma-space-before/README.md): Require a single space or disallow whitespace before the commas of media query lists (Autofixable).

#### @规则

-   [`at-rule-empty-line-before`](../../lib/rules/at-rule-empty-line-before/README.md): Require or disallow an empty line before at-rules (Autofixable).
-   [`at-rule-name-case`](../../lib/rules/at-rule-name-case/README.md): Specify lowercase or uppercase for at-rules names (Autofixable).
-   [`at-rule-name-newline-after`](../../lib/rules/at-rule-name-newline-after/README.md): Require a newline after at-rule names.
-   [`at-rule-name-space-after`](../../lib/rules/at-rule-name-space-after/README.md): Require a single space after at-rule names (Autofixable).
-   [`at-rule-semicolon-newline-after`](../../lib/rules/at-rule-semicolon-newline-after/README.md): Require a newline after the semicolon of at-rules (Autofixable).
-   [`at-rule-semicolon-space-before`](../../lib/rules/at-rule-semicolon-space-before/README.md): Require a single space or disallow whitespace before the semicolons of at rules.

#### 注释

-   [`comment-empty-line-before`](../../lib/rules/comment-empty-line-before/README.md): Require or disallow an empty line before comments (Autofixable).
-   [`comment-whitespace-inside`](../../lib/rules/comment-whitespace-inside/README.md): Require or disallow whitespace on the inside of comment markers (Autofixable).

#### 一般/表

-   [`indentation`](../../lib/rules/indentation/README.md)：指定缩进（可自动修复）。
-   [`linebreaks`](../../lib/rules/linebreaks/README.md)：指定 unix 或 windows 换行符（可自动修复）。
-   [`max-empty-lines`](../../lib/rules/max-empty-lines/README.md)：限制相邻空行的数量。
-   [`max-line-length`](../../lib/rules/max-line-length/README.md)：限制行的长度。
-   [`no-eol-whitespace`](../../lib/rules/no-eol-whitespace/README.md)：禁止行尾空白（可自动修复）。
-   [`no-missing-end-of-source-newline`](../../lib/rules/no-missing-end-of-source-newline/README.md)：禁止缺少源代码结尾换行符（可自动修复）。
-   [`no-empty-first-line`](../../lib/rules/no-empty-first-line/README.md)：禁止空第一行（可自动修复）。

