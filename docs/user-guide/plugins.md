# 插件

插件是社区构建的规则和规则集，支持方法论、工具集、*非标准* CSS 功能或非常具体的用例。他们的*包*名称以“stylelint”为前缀。他们的*规则*名称在命名空间中，因此它们不会与 stylelint 的核心规则冲突。

-   [`stylelint-8-point-grid`](https://github.com/dcrtantuco/stylelint-8-point-grid)：使用8点网格指南验证 CSS
-   [`stylelint-a11y`](https://github.com/YozhikM/stylelint-a11y)：可访问性规则（插件包）。
-   [`stylelint-at-rule-no-children`](https://github.com/adityavm/stylelint-at-rule-no-children)：禁止在 @规则内部声明块规则（除少数例外）。
-   [`stylelint-color-format`](https://github.com/filipekiss/stylelint-color-format)：将 HEX 颜色转换为 RGB 或 HSL。
-   [`stylelint-csstree-validator`](https://github.com/csstree/stylelint-validator):验证 CSS 值以匹配 W3C 规范和浏览器扩展。
-   [`stylelint-declaration-block-no-ignored-properties`](https://github.com/kristerkari/stylelint-declaration-block-no-ignored-properties)：禁止由于同一规则中的另一个属性值而被忽略的属性值。
-   [`stylelint-declaration-strict-value`](https://github.com/AndyOGo/stylelint-declaration-strict-value)：指定必须取值为使用变量（$sass、@less、var(--cssnext)）、函数或自定义 CSS 关键字（inherit、none 等）的属性。
-   [`stylelint-declaration-use-variable`](https://github.com/sh-waqar/stylelint-declaration-use-variable)：指定必须为其值使用变量的属性。
-   [`stylelint-group-selectors`](https://github.com/ssivanatarajan/stylelint-group-selectors)：标识可以分组的选择器，因为它们具有相同的属性和值集。
-   [`stylelint-high-performance-animation`](https://github.com/kristerkari/stylelint-high-performance-animation)：用于防止使用低性能动画和过渡属性的 Stylelint 规则。
-   [`stylelint-images`](https://github.com/ramasilveyra/stylelint-images)：检查 CSS 图像以提高性能并避免常见错误（插件包）。
-   [`stylelint-media-use-custom-media`](https://github.com/csstools/stylelint-media-use-custom-media)：在 CSS 中强制使用自定义媒体查询
-   [`stylelint-no-browser-hacks`](https://github.com/Slamdunk/stylelint-no-browser-hacks)：禁止与您所指定的浏览器无关的CSS hack；使用 [stylehacks](https://github.com/ben-eb/stylehacks)。
-   [`stylelint-no-indistinguishable-colors`](https://github.com/ierhyna/stylelint-no-indistinguishable-colors)：禁止可疑近乎相同的颜色。
-   [`stylelint-no-unsupported-browser-features`](https://github.com/ismay/stylelint-no-unsupported-browser-features)：禁止您所指定的浏览器不支持的功能。
-   [`stylelint-order`](https://github.com/hudochenkov/stylelint-order)：指定事物的排序，例如声明块中的属性（插件包）。
-   [`stylelint-prettier`](https://github.com/prettier/stylelint-prettier)：将 [Prettier](https://prettier.io/) 作为 stylelint 规则运行。
-   [`stylelint-react-native`](https://github.com/kristerkari/stylelint-react-native)：强制执行为 React Native 定制的检查规则（插件包）。
-   [`stylelint-rscss`](https://github.com/rstacruz/stylelint-rscss)：验证 [RSCSS](http://rscss.io) 约定。
-   [`stylelint-scss`](https://github.com/kristerkari/stylelint-scss)：强制执行为 SCSS 语法定制的检查规则（插件包）。
-   [`stylelint-selector-bem-pattern`](https://github.com/davidtheclark/stylelint-selector-bem-pattern)：为选择器指定BEM模式（包含 [postcss-bem-linter](https://github.com/postcss/postcss-bem-linter)）。
-   [`stylelint-selector-no-empty`](https://github.com/ssivanatarajan/stylelint-selector-no-empty)：禁止空选择器。
-   [`stylelint-selector-tag-no-without-class`](https://github.com/Moxio/stylelint-selector-tag-no-without-class)：禁止在选择器中没有类限定符的某些标记。
-   [`stylelint-suitcss`](https://github.com/suitcss/stylelint-suitcss)：SUIT CSS的stylelint插件集合，包括不推荐使用的 `:root` 规则（插件包）。
-   [`stylelint-value-no-unknown-custom-properties`](https://github.com/csstools/stylelint-value-no-unknown-custom-properties)：禁止未知的自定义属性。
-   [`stylelint-z-index-value-constraint`](https://github.com/kristerkari/stylelint-z-index-value-constraint)：指定z-index的最小和最大约束值。
