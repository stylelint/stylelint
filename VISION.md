# 蓝图

强大、现代的代码检查和修复工具，适用于 CSS 和类 CSS 语言。

特性：

-   完整 - 覆盖所有标准CSS语法。
-   可扩展 - 具有多个扩展点。
-   可配置 - 没有默认设置和丰富的选项来定制代码检查工具。
-   强大 - 具有全面的测试覆盖范围和各种功能点。
-   一致 - 与行为，命名和文档的约定。
-   高性能 - 使用工具来测试和提高性能。

## 完备

为以下三个方面提供内置规则：

-   [可能错误](docs/user-guide/rules.md#可能错误).
-   [限制语言功能](docs/user-guide/rules.md#限制语言功能).
-   [风格问题](docs/user-guide/rules.md#风格问题).

### 可能错误

提供规则以捕获两种可能的错误：

-   无效代码，例如无效的十六进制颜色和未知的语言功能。
-   有效但可能产生意外后果的代码，例如重复和覆盖。

无效代码最好由新兴的专用工具处理，例如 [csstree](https://github.com/csstree/csstree) - 具有语法验证的语言解析器。 作为一种权宜之计，当这些工具成熟时，为最简单的情况提供无效的代码规则。

（将来，这些工具可以作为插件包装，以利用 `/* stylelint-* */` 命令注释，严重性级别和选项验证器等功能。）

### 限制语言功能

提供规则以限制可以使用的语言功能，包括：

-   强制执行最大特异性，通过限制特异性本身或者不同选择器，例如类，ID，属性等类型的出现
-   强制执行 _在配置级别_ 的最佳实践。例如不允许过渡的 `all` 关键字，因为它不是高效的。
-   强制执行使用特征子集来提高代码库的一致性，例如限制允许的单位（`px` 或 `rem` 等）
-   强制执行选择器和名称（例如那些自定义属性）的模式匹配。

### 风格问题

提供规则以强制执行各种风格约定，包括：

-   空白
-   大小写
-   引号

有两种方法可以实施样式约定：

-   通过机器算法美化打印代码（通常基于最大行长度）。
-   人工格式化代码，然后机器修复/警告任何错误。

前者由美化打印工具处理，如 [prettier](https://github.com/prettier/prettier)，而后者则由内置的风格规则来满足。

此外，内置的风格规则和插件可配置为支持各种风格约定。这与美化打印工具形成对比，后者往往是倾向性的。声明块中属性的排序是一个争议性话题的例子，它缺乏一两个主导性的约定。[`stylelint-order`](https://www.npmjs.com/package/stylelint-order) 插件遵循 stylelint 的哲学，可用于检查和修复各种排序约定。

另一个例子是对一组 _相关_ 规则使用单行风格，例如

```css
/* 单行相关类 */
.class-1 { top: 0; bottom: 0; }
.class-2 { top: 5px; right: 0; }
.class-3 { top: 8px; left: 0; }
```

内置风格规则可以配置为允许多行或单行风格，选择风格的权力属于用户，用户可以确定哪些规则是相关的。

## 可扩展

提供多个扩展点，包括：

-   [插件](docs/developer-guide/plugins.md) - 构建社区规则以支持方法，工具集，非标准CSS功能或非常具体的用例。
-   [Processors](docs/user-guide/processors.md) - lint the CSS within non-stylesheet files.
-   [可继承配置](docs/user-guide/configuration.md#extends) - 继承和共享配置。
-   [格式化工具](docs/developer-guide/formatters.md) - 格式化 stylelint 结果对象。
-   [自定义语法](docs/user-guide/node-api.md#customsyntax) - 使用任何与 PostCSS 兼容的语法模块。

## 强大

提供强大的[综合测试套件](docs/developer-guide/rules.md#write-tests)工具，包括：

-   高覆盖率，目前超过95％。
-   各种规则的功能点固定装置，目前超过10000个。

## 一致

始终保持一致性，包括：

-   一致的[命名](docs/developer-guide/rules.md#naming-a-rule)、[选项](docs/developer-guide/rules.md#determining-options)、[违规消息](docs/developer-guide/rules.md#determine-violation-messages)、[文档](docs/developer-guide/rules.md#write-the-readme) 和规则内的非标准语法[处理](docs/developer-guide/rules.md#write-the-rule).
-   一致的[收录标准](docs/developer-guide/rules.md#criteria-for-inclusion).

## 执行

提供快速工具，以及测试和改进性能的方法，包括：

-   单个规则的性能[基准测试](docs/developer-guide/rules.md#improving-the-performance-of-a-new-or-an-existing-rule)。
