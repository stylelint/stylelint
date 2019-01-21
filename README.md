# stylelint

[![NPM version](https://img.shields.io/npm/v/stylelint.svg)](https://www.npmjs.org/package/stylelint) [![Build Status](https://travis-ci.org/stylelint/stylelint.svg?branch=master)](https://travis-ci.org/stylelint/stylelint) [![Build status](https://ci.appveyor.com/api/projects/status/o60hlhki49t2333i/branch/master?svg=true)](https://ci.appveyor.com/project/stylelint/stylelint/branch/master) [![NPM Downloads](https://img.shields.io/npm/dm/stylelint.svg)](https://npmcharts.com/compare/stylelint?minimal=true) [![Backers on Open Collective](https://opencollective.com/stylelint/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/stylelint/sponsors/badge.svg)](#sponsors)

一个强大的，现代的代码检查工具，可以帮助您避免错误并在您的样式中强制执行约定。

## 特性

它很强大，因为它：

-   有超过**160条内置规则**来捕捉错误，采取限制和执行风格约定
-   懂得**最新的CSS语法**，包括自定义属性和4级选择器
-   从 HTML、markdown、CSS-in-JS 的对象/模板字符串中提取**内嵌样式**
-   解析**类CSS语法**，如SCSS、Sass、Less 和 SugarSS
-   支持**插件**，这样您就可以创建自己的规则或使用社区编写的插件
-   自动**修复**一些违规（*实验性功能*）
-   经10000多个单元测试**充分测试**
-   支持**可共享的配置**，您可以扩展或创建自己的配置
-   是**非倾向性的**，所以您可以根据您的确切需要定制代码检查工具
-   有一个**不断发展的社区**，被用于 [Facebook](https://code.facebook.com/posts/879890885467584/improving-css-quality-at-facebook-and-beyond/), [GitHub](https://github.com/primer/stylelint-config-primer) 和 [WordPress](https://github.com/ntwb/stylelint-config-wordpress/)

## 示例输出

![Example](https://github.com/stylelint/stylelint/raw/master/example.png?raw=true)

## 入门

它很容易上手。

首先，决定如何使用stylelint：

-   [在命令行中](docs/user-guide/cli.md)
-   [在您的文本编辑器中](docs/user-guide/complementary-tools.md#编辑器插件), 例如在 VS Code 中
-   [在您的构建工具中](docs/user-guide/complementary-tools.md#构建工具插件), 例如在 webpack 中
-   [通过 Node.js API](docs/user-guide/node-api.md)
-   [作为 PostCSS 插件](docs/user-guide/postcss-plugin.md)

然后创建您的[配置对象](docs/user-guide/configuration.md)。您可以扩展共享配置或制作自己的配置。

### 扩展共享配置

这是最快捷的入门方式。我们建议您扩展：

-   [`stylelint-config-recommended`](https://github.com/stylelint/stylelint-config-recommended)
-   [`stylelint-config-standard`](https://github.com/stylelint/stylelint-config-standard)

建议(recommended)配置仅打开[可能错误](docs/user-guide/rules.md#可能错误)的规则。标准(standard)配置通过打开60个[风格规则](docs/user-guide/rules.md#风格问题)来扩展它。我们建议您扩展：

-   建议(recommended)配置，如果您使用 [prettier](https://prettier.io/) 之类的美化排版工具
-   标准(standard)配置，如果您希望 stylelint 强制执行风格约定

您可能希望在配置中添加[限制语言功能](docs/user-guide/rules.md#限制语言功能)的规则，作为您的团队/项目特殊规则。

*如果您使用语言扩展, 例如 `@if` 和 `@extends`, 您可以使用像 [`stylelint-config-recommended-scss`](https://github.com/kristerkari/stylelint-config-recommended-scss) 这样的社区配置代替。*

### 制作您自己的配置

或者，您可以[了解规则](docs/user-guide/about-rules.md)，然后：

-   从小处开始，只添加您要打开的[规则](docs/user-guide/rules.md)
-   复制，粘贴和调整[示例配置](docs/user-guide/example-config.md)中列出的所有规则及其主要选项

## 指南

您可以在我们的指南中找到有关自定义 stylelint 的详细信息：

-   [用户指南](docs/user-guide.md) - 如何使用和配置 stylelint
-   [开发者指南](docs/developer-guide.md) - 如何开发 stylelint

## 需要帮助？

首先阅读我们的[常问问题](docs/user-guide/faq.md)。

如果没有您问题的答案，那么请将问题发布到 [stackoverflow](https://stackoverflow.com/questions/tagged/stylelint)

如果出现以下情况，请创建[新问题](https://github.com/stylelint/stylelint/issues/new/choose)

-   您觉得发现了一个 bug
-   您有功能请求

如果您正在升级，请阅读我们的[更改日志](CHANGELOG.md)以了解最新版本中的更改。

## 协助我们

要协助我们，您可以：

-   参与任何公开[问题](https://github.com/stylelint/stylelint/issues)或[拉取请求](https://github.com/stylelint/stylelint/pulls)
-   使用我们的[制定规则](docs/developer-guide/rules.md)指南来创建、增强和调试规则
-   改进[文档](docs/)
-   为*任何一切*添加新测试
-   改善[规则的表现](docs/developer-guide/rules.md#improving-the-performance-of-a-new-or-an-existing-rule)
-   开创[新问题](https://github.com/stylelint/stylelint/issues/new/choose)来表述您让 stylelint 变得更好的主意
-   开创[拉取请求](https://github.com/stylelint/stylelint/compare)来展示您的主意是如何工作的
-   创建或贡献[生态系统工具](docs/user-guide/complementary-tools.md)，例如 [VS Code 插件](https://github.com/shinnn/vscode-stylelint)

我们在[蓝图文档](VISION.md)的指导下工作。

## 语义版本控制策略

我们有一个[语义版本控制策略](docs/user-guide/semantic-versioning-policy.md)。任何次要更新都可能报告比以前版本更多的错误。因此，我们建议在 `package.json` 中使用波浪号 (`~`)，例如 `"stylelint": "~7.2.0"` 以保证构建的结果。

## 许可证

[MIT许可证](https://raw.githubusercontent.com/stylelint/stylelint/master/LICENSE).

## 贡献者

这个项目归功于所有这些人。[贡献](CONTRIBUTING.md)。
<a href="https://github.com/stylelint/stylelint/graphs/contributors"><img src="https://opencollective.com/stylelint/contributors.svg?width=890" /></a>

## 支持者

谢谢所有支持者！[成为支持者](https://opencollective.com/stylelint#backer)。

<a href="https://opencollective.com/stylelint#backers" target="_blank"><img src="https://opencollective.com/stylelint/backers.svg?width=890"></a>


## 赞助商

成为赞助商支持这个项目。您的商标将显示在此处，并带有指向您网站的链接。[成为赞助商](https://opencollective.com/stylelint#sponsor)。

<a href="https://opencollective.com/stylelint/sponsor/0/website" target="_blank"><img src="https://opencollective.com/stylelint/sponsor/0/avatar.svg"></a>
