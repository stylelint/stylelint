# stylelint 命令行界面

## 安装

stylelint 是一个 [npm 包](https://www.npmjs.com/package/stylelint)。它使用命令安装：

```shell
npm install stylelint --save-dev
```

<!-- TOC -->

## 用法

`stylelint --help` 打印命令行界面文档。

命令行界面将格式化结果输出到 `process.stdout`，您可以用人工或其他地方读取（例如将信息写入文件）。

### 例子

当您运行类似于以下示例的命令时，请确保在文件 glob 周围包含引号。这将确保无论您的 shell 如何，都可以使用 [globby](https://github.com/sindresorhus/globby) 的功能（如 `**` glob 星号）。

寻找 `.stylelintrc` 并检查 `foo` 目录中的所有 `.css` 文件：

```shell
stylelint "foo/*.css"
```

寻找 `.stylelintrc` 并检查 `bar` 目录中的所有 `.html` 文件中的所有 `<style>` 块：

```shell
stylelint "bar/*.html"
```

寻找 `.stylelintrc` 和检查 `stdin`（标准输入）：

```shell
echo "a { color: pink; }" | stylelint
```

使用 `bar/mySpecialConfig.json` 作为配置来检查 `foo` 目录中的所有 `.css` 文件，然后将输出写入 `myTestReport.txt`：

```shell
stylelint "foo/*.css" --config bar/mySpecialConfig.json > myTestReport.txt
```

使用 `bar/mySpecialConfig.json` 作为配置，打开静默模式，检查 `foo` 及其任何子目录还有 `bar` 目录中的所有 `.css` 文件：

```shell
stylelint "foo/**/*.css" "bar/*.css" -q -f json --config bar/mySpecialConfig.json
```

检查所有 `.css` 文件, 使用 glob 中的否定排除 `docker` 子文件夹中的文件：

```shell
stylelint "**/*.css, !**/docker/**"
```

使用 `cache` 和 `cache-location` 选项缓存已处理的 `.scss` 文件，以便只对 `foo` 目录中已更改的文件进行操作：

```shell
stylelint "foo/**/*.scss" --cache --cache-location "/Users/user/.stylelintcache/"
```

stylelint 将[自动推断语法](css-processors.md#parsing-non-standard-syntax)。但您可以使用 `--syntax` 选项强制使用特定语法。例如，将 `foo` 目录中所有 `.css` 文件 _作为 Scss_ 检查：

```shell
stylelint "foo/**/*.css" --syntax scss
```

stylelint还可以接受自定义 [PostCSS 兼容语法](https://github.com/postcss/postcss#syntaxes)。要使用自定义语法，请提供语法模块名称或语法文件的路径：`--custom-syntax custom-syntax` 或 `--custom-syntax ./path/to/custom-syntax`。

### 递归检查目录

要递归检查目录，使用 `**` glob 星号：

```shell
stylelint "foo/**/*.scss"
```

glob 周围的引号很重要，因为它们允许 stylelint 使用 globby 而不是 shell 来解释 glob，这可能在功能上不完全相同。

### 自动修复错误

使用 `--fix` 选项，stylelint 将尽可能多的修复错误，修复实际的源文件，报告未修复的错误。

检查 `foo` 目录中所有的 `.css` 文件。如果违反支持自动修复的规则，则修复源文件：

```shell
stylelint "foo/*.css" --fix
```

**注意：** 这是一个 _试验性_ 功能。它目前不遵守在源代码中禁用 stylelint 的特殊注释（例如 `/* stylelint-disable */`）。无论这些注释如何，都将应用自动修复。

如果您同时使用这些特殊注释和自动修复，请运行 stylelint 两次作为临时解决方案。在第一次运行时，可能会错过某些违规，或者可能会错误地报告某些违规。

对于具有标准语法的 CSS，stylelint 将使用 [postcss-safe-parser](https://github.com/postcss/postcss-safe-parser) 来修复语法错误。

### 排除配置故障

使用 `--print-config` 选项，stylelint 会输出要用于文件的配置。如果存在该选项，则不执行检查，此时只有与配置相关的选项有效。

## 语法错误

命令行界面会通知您 CSS 中的语法错误。
它使用与违规检查相同的输出格式。
错误名称是 `CssSyntaxError`。

## 退出代码

命令行界面会使用以下退出代码退出进程：

-   1：未知错误。
-   2：至少有一个具有"error"级别严重性的规则触发了至少一次违规。
-   78：配置文件有问题。
-   80：传递了文件glob，但没有找到文件。
