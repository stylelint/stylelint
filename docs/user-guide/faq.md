# 常见问题

<!-- TOC -->

## 如何关闭、禁用或者忽略一个规则？

您可以在配置文件中将配置值设置为 `null`。

比如说，我想使用 `stylelint-config-standard` 配置却又想禁用 `at-rule-empty-line-before` 规则，我可以这样设置：

```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "at-rule-empty-line-before": null
  }
}
```

您也可以在 CSS 文件的某个特定区域内禁用一个规则。想了解更多可以参考[配置指南](configuration.md#rules)的规则部分。

## 如何通过命令行检查代码？

参考文档的[命令行界面部分](cli.md)。

命令行界面也可以在 [npm run scripts](https://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/) 中使用以使用非全局安装的 stylelint。

## 怎样通过 Git 预提交钩子检查代码？

[lint-staged](https://github.com/okonet/lint-staged) 是一个 Node.js 脚本，可以在每次 Git 暂存文件时运行 stylelint.

## 如何在任务运行器中检查代码？

stylelint 社区为热门任务运行者维护[相应插件](complementary-tools.md#构建工具插件)，包括 gulp、webpack、Broccoli 和 Grunt。请参阅他们的自述文档以开始使用。

如果您使用的任务运行器没有对应的 stylelint 插件，您可以将 stylelint 作为 PostCSS 插件使用，从而利用 PostCSS 提供的[大量的](https://github.com/postcss/postcss#runners) 任务运行器插件。

这里还有一些通过 PostCSS JS 应用程序接口使用 PostCSS 插件的示例在[文档](postcss-plugin.md)中的。

但是，使用 stylelint 作为 PostCSS 插件会限制您可用的报告选项，只能使用[postcss-reporter](https://github.com/postcss/postcss-reporter/) 所提供的选项。为了有更好的报告选项，我们推荐通过 stylelint Node.js 应用程序接口来使用 stylelint。

## 如何在文本编辑器中检查代码？

stylelint 社区也为流行的文本编辑器提供了很多[相应的插件](complementary-tools.md#编辑器插件)。请参阅他们的自述文档以开始使用。

## 如何检查 SCSS、Less 或者其他非标准语法代码？

stylelint 默认地能*解析*如下的非标准语法，包括Sass、Less 和 SugarSS，非标准语法可以从以下文件扩展名 `.sass`、`.scss`、`.less` 和 `.sss` 中自动推断出来。或者您也可以自己指定语法。

此外，在使用命令行界面或 Node.js 应用程序接口时，stylelint 可以接受任何[PostCSS兼容语法](https://github.com/postcss/postcss#syntaxes)。但请注意，stylelint 无法保证核心规则可以在上面列出的默认值以外的语法中正常工作。

可以参考[文档](css-processors.md#解析非标准语法)来了解如何配置 stylelint 来解析非标准语法。

## 我应该在通过 PostCSS 插件或其他处理器处理样式表之前还是之后进行代码检查？

我们[推荐](css-processors.md)在源文件进行任何转换之前检查您的源文件。

## 如何自动修复风格违规？

使用命令行界面标志 `--fix` 或 Node.js 应用程序接口选项 `fix`，通过这个*实验性*功能来修复许多风格违规。

## 如何管理规则之间的冲突？

由于每条规则都是独立的，所以有时配置规则时可能会与其他规则产生冲突。比如说，您可以同时启用两个冲突的黑名单和白名单规则，如 `unit-blacklist` 和 `unit-whitelist`。

而您作为配置文件的作者，要责无旁贷地处理这些规则冲突。

## 插件和规则有什么区别？

一条规则必须符合开发人员指南中列出的[标准](../developer-guide/rules.md)，其中包括仅规则仅适用于标准 CSS 语法，是否具有一个明确的完成状态。而插件是由社区构建的规则或规则集，不必遵循标准。它可能支持特定的方法论、工具集、*非标准*的构造和功能、特定用例。

例如，我们发现强制规定属性顺序，属性分组等的规则更适合作为插件，因为大家对于要执行什么，以及如何执行有很多不同的看法。当您在编写或使用一个插件时，您可以确保强制执行您自己的特定偏好；但一个规则如果试图满足太多的不同用例会变得一团糟糕。

插件是很容易合并到您的配置中的。

## 我可以自定义 stylelint 的消息吗？

是的，您可以使用 [`message` 辅助选项](configuration.md#自定义消息)或[编写您自己的格式化程序](../developer-guide/formatters.md)。

## 如何用 stylelint 来处理遵循类 BEM 模式的 CSS 文件？

您可以使用 [stylelint-selector-bem-pattern](https://github.com/davidtheclark/stylelint-selector-bem-pattern) 插件确保您的选择器符合所选的 BEM 风格模式。

您还可以利用 `selector- *` 规则来禁止某些类型的选择器（例如ID选择器）和控制特异性。

如果您正在使用 SUITCSS，则可能需要使用[他们的可共享配置](https://github.com/suitcss/stylelint-config-suitcss)。

## 如何禁用单行代码块？

```css
  a { color: red; }
/** ↑
 * Declaration blocks like this */
```

可以一起使用 `block-opening-brace-newline-after` 和 `block-opening-brace-newline-before` 规则，比如如下配置：

```json
{
  "block-opening-brace-newline-after": ["always"],
  "block-closing-brace-newline-before": ["always"]
}
```

如下样式表可以通过上述规则：

```css
a {
  color: red;
}
```

但是如下样式表却不能通过：

```css
a { color: red;
}

a {
color: red; }

a { color: red; }
```

如果想允许单行代码块同时在多行代码块中强制使用换行符，可以设置上述两条规则选项为 `"always-multi-line"`。

## 如何用短横线隔开 (kebab-case) 等常见 CSS 命名约定配置 `*-pattern` 规则？

使用与您选择的约定相对应的正则表达式：

-   短横线命名(kebab-case): `^([a-z][a-z0-9]*)(-[a-z0-9]+)*$`
-   小驼峰命名(lowerCamelCase): `^[a-z][a-zA-Z0-9]+$`
-   蛇形命名(snake\_case): `^([a-z][a-z0-9]*)(_[a-z0-9]+)*$`
-   大驼峰命名(UpperCamelCase): `^[A-Z][a-zA-Z0-9]+$`

比如，对于遵循小驼峰拼写式的类选择器，使用 `"selector-class-pattern": "^[a-z][a-zA-Z0-9]+$"`。

所有这些模式都不允许以数字，两个连字符或后跟数字的连字符开头的CSS标识符。

## 如何将默认严重性级别更改为“警告”，以便 stylelint 不会破坏我的构建？

使用[`defaultSeverity`](configuration.md#defaultseverity)配置选项。

## 我可以在一个 npm 包中捆绑多个可共享配置吗？

用户可能 `require()` 您 npm 包中的任何文件，所以您需要做的就是记录哪些路径指向配置（例如 `require('my-package/config-2')`）`）。

## 如何控制块的开括号后的空白？

请参阅文档中的[这个部分](about-rules.md#-empty-line-before-和--max-empty-lines-规则)部分，该部分解释了 `* -empty-line-before` 规则如何工作。

## 如果我在配置对象中使用 `extends`，那每个规则的选项是会被合并还是覆盖？

它们将会被覆盖。

`extends` 机制在[配置文件中](configuration.md#extends)有更详细的介绍：

> 当一个配置继承另一个配置时，它从另一个配置的属性开始，然后添加并覆盖其中的内容。

这种设计的原因记录在[#1646](https://github.com/stylelint/stylelint/issues/1646#issuecomment-232779957)中。
