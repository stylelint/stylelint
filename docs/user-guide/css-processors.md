# CSS 处理器

代码检查工具支持当前和未来的CSS语法。这包括所有标准 CSS，也包括使用标准 CSS 语法结构的特殊功能，例如特殊的 @规则，特殊属性和特殊功能。一些*类*CSS语言扩展 -- 使用非标准语法结构的特性 -- 因此受到支持；然而，由于存在无限的处理可能性，因此代码检查工具不能支持所有内容。

您可以在 CSS 处理器之前或之后运行代码检查工具。根据您使用的处理器，每种方法都有警告：

1.  *之前*：某些插件/处理器可能启用与代码检查工具不兼容的语法。
2.  *之后*：某些插件/处理器可能会生成对您的代码检查工具配置不符的 CSS，从而导致与原始样式表不对应的违规。

*在这两种情况下，您可以关闭不兼容的代码检查工具规则，或者停止使用不兼容的插件/处理器。* 您还可以请求插件/处理器作者提供替代的格式化选项以便与 stylelint 兼容。

## 解析非标准语法

stylelint 将根据以下信息自动推断出以下语法：

-   文件扩展名
-   `<style>` 标签上的 `lang` 或 `type` 属性的值
-   Markdown 代码栏上的标记

但是，您可以强制使用特定语法。[命令行界面](cli.md)和 [Node.js 应用程序接口](node-api.md)都暴露了 `syntax` 选项。

-   如果您正在使用命令行界面，请使用 `syntax` 标志，如下所示：`stylelint ... --syntax scss`。
-   如果您正在使用Node.js 应用程序接口，请传递 `syntax` 选项，如下所示：`stylelint.lint({ syntax: "sugarss", ... })`。

使用命令行界面或 Node.js 应用程序接口时，stylelint 还可以接受自定义 [PostCSS 兼容语法](https://github.com/postcss/postcss#syntaxes)。对于自定义语法，分别使用 `custom-syntax` 和 `customSyntax` 选项。

-   如果您正在使用命令行界面，请使用 `custom-syntax` 标志，如下所示：`stylelint ... --custom-syntax custom-syntax-module` 或 `stylelint ... --custom-syntax ./path/to/custom-syntax-module`。
-   如果您正在使用Node.js 应用程序接口，请传递 `customSyntax` 选项，如下所示：`stylelint.lint({ customSyntax: path.join(process.cwd(), './path/to/custom-syntax-module') , ... })`。

如果您将代码检查工具作为[PostCSS插件](postcss-plugin.md)使用，您应该将特殊的 `postcss-syntax` 直接用于 PostCSS 的 `syntax` 选项，如下所示：

```js
var postcss = require("postcss")
var syntax = require("postcss-syntax")

postcss([
  require("stylelint"),
  require("reporter")
])
  .process(css, {
    from: "lib/app.css",
    syntax: syntax
  })
})
```
