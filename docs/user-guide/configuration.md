# 配置

代码检查工具*需要一个配置对象*。您可以制作自己的配置或继承现有配置。

<!-- TOC -->

## 加载配置对象

查找和加载配置对象由 [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) 完成。从当前工作目录开始，它将按以下顺序查找以下可能的源：

-   `package.json` 中的 `stylelint` 属性
-   `.stylelintrc` 文件
-   导出JS对象的 `stylelint.config.js` 文件

`.stylelintrc` 文件（没有扩展名）可以是 JSON 或 YAML 格式。或者您可以添加文件扩展名以指定 JSON、YAML 或 JS 格式：`.stylelintrc.json`、`.stylelintrc.yaml`、`.stylelintrc.yml`，`.stylelintrc.js`。您可能希望使用扩展名，以便文本编辑器可以更好地解释文件，并帮助进行语法检查和高亮显示。

找到并解析其中一个后，搜索将停止并将使用该对象。

可以使用 `config` 或 `configFile` 选项绕过配置搜索。

## 配置对象

配置对象可以具有以下属性。

### `rules`

规则确定了代码检查工具寻找和控诉的内容。在 stylelint 中有[超过160条规则](rules.md)。*默认情况下没有打开任何规则*，因此您可以在此处打开所有要检查的内容。必须将所有规则明确配置为*没有默认值*。

`rules`属性是*一个键作为规则名称，值作为规则配置的对象*。每条规则配置都符合以下格式之一：

-   单个值（主选项）
-   包含两个值的数组（`[主选项, 辅助选项]`）
-   `null`（关闭规则）

```json
{
  "rules": {
    "block-no-empty": null,
    "color-no-invalid-hex": true,
    "comment-empty-line-before": [ "always", {
      "ignore": ["stylelint-commands", "after-comment"]
    } ],
    "declaration-colon-space-after": "always",
    "indentation": ["tab", {
      "except": ["value"]
    }],
    "max-empty-lines": 2,
    "rule-empty-line-before": [ "always", {
      "except": ["first-nested"],
      "ignore": ["after-comment"]
    } ],
    "unit-whitelist": ["em", "rem", "%", "s"]
  }
}
```

指定主选项将启用规则。您可以在[示例配置](example-config.md)中找到主要规则选项的完整列表。

要关闭规则（继承配置时），可以将规则的值设置为 `null`：

```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "at-rule-empty-line-before": null
  }
}
```

许多规则都有辅助选项作为进一步配置。要设置辅助选项，请使用两个成员的数组：

```js
"selector-pseudo-class-no-unknown": [true, {
  "ignorePseudoClasses": ["global"]
}]
```

#### 在您的CSS中关闭规则

可以通过在CSS中使用特殊注释暂时关闭规则。例如，您可以关闭所有规则：

```css
/* stylelint-disable */
a {}
/* stylelint-enable */
```

或者您可以关闭个别规则：

```css
/* stylelint-disable selector-no-id, declaration-no-important  */
#id {
  color: pink !important;
}
/* stylelint-enable */
```

您可以使用 `/* stylelint-disable-line */` 注释关闭个别行的规则，之后您无需显式重新启用它们：

```css
#id { /* stylelint-disable-line */
  color: pink !important; /* stylelint-disable-line declaration-no-important */
}
```

您还可以使用 `/* stylelint-disable-next-line */` 注释关闭*下一行*的规则，之后您不需要显式重新启用它们：

```css
#id {
  /* stylelint-disable-next-line declaration-no-important */
  color: pink !important;
}
```

支持复杂，重叠的禁用和启用模式：

```css
/* stylelint-disable */
/* stylelint-enable foo */
/* stylelint-disable foo */
/* stylelint-enable */
/* stylelint-disable foo, bar */
/* stylelint-disable baz */
/* stylelint-enable baz, bar */
/* stylelint-enable foo */
```

**警告：** 写在*选择器和值列表*中的注释目前被忽略。

#### 严重性：错误和警告

默认情况下，所有规则都是 `"error"` 级别的严重性。您可以通过在配置中添加 `defaultSeverity` 属性来更改此默认值（请参阅下文）。

要调整任何特定规则的严重性，请使用辅助选项 `severity`。 `severity` 的可用值是：

-   `"warning"`
-   `"error"`

```js
// 错误级别严重性示例
{ "indentation": 2 }
{ "indentation": [2] }

// 警告级别严重性示例
{ "indentation": [2, { "severity": "warning" } ] }
{ "indentation": [2, {
    "except": ["value"],
    "severity": "warning"
  }]
}
```

不同的报告生成器可以用不同的方式使用这些严重性级别，例如以不同方式显示它们，或以不同方式退出进程

#### 自定义消息

如果要在违反规则时传递自定义消息，可以通过两种方式执行此操作：为规则提供“消息”选项，或编写自定义格式化程序。

所有规则都接受一个 `message` 辅助选项，如果指定该选项，任何标准消息都将被替为换指定的内容。例如，以下规则配置将替换几个自定义消息：

```json
{
  "color-hex-case": [ "lower", {
    "message": "小写字母更容易与数字区分开来"
  } ],
  "indentation": [ 2, {
    "except": ["block"],
    "message": "请使用2个空格进行缩进。制表符使建筑师性情乖戾",
    "severity": "warning"
  } ]
}
```

如果您需要深度定制，编写[自定义格式化程序](../developer-guide/formatters.md)可以为您提供最大程度的控制。

### `extends`

您的配置可以*继承*现有配置（无论您自己的配置还是第三方配置）。当一个配置继承另一个配置时，它从另一个配置属性开始，然后添加并覆盖其中的内容。

您可以继承现有配置的数组，数组中的每个项都优先于前一项（因此第二项将覆盖第一项中的规则，第三项将覆盖第一项和第二项中的规则，依此类推，最后一项覆盖其他所有内容）。

例如，继承 [`stylelint-config-standard`](https://github.com/stylelint/stylelint-config-standard)，然后将缩进更改为制表符并关闭 `number-leading-zero` 规则：

```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "indentation": "tab",
    "number-leading-zero": null
  }
}
```

或者从 `stylelint-config-standard` 开始，然后在其上层叠 `myExtendableConfig`，然后覆盖缩进规则：

```json
{
  "extends": [
    "stylelint-config-standard",
    "./myExtendableConfig"
  ],
  "rules": {
    "indentation": "tab"
  }
}
```

`"extends"` 的值是一个“定位符”（或者是一个“定位符”数组），最终通过 `require()` 加载，所以可以是任何适用于 Node 的 `require.resolve()` 算法的格式。这意味着“定位符”可以是：

-   `node_modules` 中模块的名称（例如 `stylelint-config-standard`；该模块的 `main` 文件必须是有效的 JSON 配置）
-   使用 `.js` 或 `.json` 扩展名的文件绝对路径（如果您在 Node.js 上下文中创建 JS 对象并将其传入，则这是有意义的）。
-   相对于引用配置的使用 `.js` 或 `.json` 扩展名的文件相对路径（例如，如果 configA 具有 `extends: "../configB"`，我们将相对于 configA 查找 `configB`）。

*有赖于 `extends`，您可以创建和使用可共享的 stylelint 配置。* 如果您将配置发布到 npm，请在 `package.json` 中使用 `stylelint-config` 关键字。

### `plugins`

插件是社区构建的支持方法、工具集、*非标准* CSS 功能或非常具体的用例的规则或规则集

要使用插件，请在您的配置中添加一个 `"plugins"` 数组，在其中包含标识您要使用的插件的“定位符”。与上面的 `extends` 一样，“定位符”可以是 npm 模块名称，绝对路径或相对于调用配置文件的路径。

一旦声明了插件，在您的 `"rules"` 对象中，*您需要为插件的规则添加选项*，就像任何标准规则一样。您需要查看插件的文档才能知道规则名称应该是什么。

```json
{
  "plugins": [
    "../special-rule.js"
  ],
  "rules": {
    "plugin/special-rule": "everything"
  }
}
```

“插件”可以提供单个规则或规则集。如果您使用的插件提供规则集，只需在 `"plugins"` 配置中调用该模块，并在`"rules"`中使用它提供的规则。例如：

```json
{
  "plugins": [
    "../some-rule-set.js"
  ],
  "rules": {
    "some-rule-set/first-rule": "everything",
    "some-rule-set/second-rule": "nothing",
    "some-rule-set/third-rule": "everything"
  }
}
```

### `processors`

Processors are functions that hook into stylelint's pipeline, modifying code on its way into stylelint and modifying results on their way out.

*Processors can only be used with the CLI and the Node.js API, not with the PostCSS plugin.* (The PostCSS plugin will ignore them.)

Processors can enable stylelint to lint, but not autofix, the CSS within non-stylesheet files that aren't supported out-of-the-box by stylelint.

To use one, add a `"processors"` array to your config, containing "locaters" identifying the processors you want to use. As with `extends`, above, a "locater" can be either an npm module name, an absolute path, or a path relative to the invoking configuration file.

```json
{
  "processors": ["stylelint-my-processor"],
  "rules": {..}
}
```

If your processor has options, make that item an array whose first item is the "locator" and second item is the options object.

```json
{
  "processors": [
    "stylelint-my-processor",
    [ "some-other-processor", { "optionOne": true, "optionTwo": false } ]
  ],
  "rules": {..}
}
```

### `ignoreFiles`

提供glob或glob数组以忽略特定文件。

*请注意，这不是忽略大量文件的有效方法。* 如果要有效地忽略大量文件，请使用`.stylelintignore`或调整文件glob。

如果globs是绝对路径，则它们按原样使用。如果它们是相对路径，则相对于它们进行分析：

-   `configBasedir`，如果提供的话；
-   配置的文件路径，如果配置是 stylelint 查找加载的文件的话；
-   或 `process.cwd()`。

默认情况下，忽略所有`node_modules`和`bower_components`。如果设置了`ignoreFiles`，则将覆盖默认值。

`ignoreFiles`属性从继承配置中删除：只有根级配置可以忽略文件。

### `defaultSeverity`

未在辅助选项中指定严重性的所有规则的默认严重性级别。 `severity` 的可用值是：

-   `"warning"`
-   `"error"`

## `.stylelintignore`

您可以使用 `.stylelintignore` 文件（或指向另一个忽略模式文件）来忽略特定文件。

在检查文件系统之前，这些文件将从文件glob中排除，因此它是忽略大量文件的有效方法。

`.stylelintignore`文件中的模式必须与 [`.gitignore` 语法](https://git-scm.com/docs/gitignore)匹配。（在幕后，[`node-ignore`](https://github.com/kaelzhang/node-ignore) 解析您的模式。）这意味着您的 *`.stylelintignore` 中的模式总是相对于 `process.cwd()` 进行分析。*

stylelint 将在 `process.cwd()` 中查找`.stylelintignore`文件。您还可以使用`--ignore-path`（在CLI中）和 `ignorePath`（在JS中）选项指定忽略模式文件的路径（绝对或相对于`process.cwd()`）。
