# stylelint Node.js 应用程序接口

stylelint 模块包含一个提供 Node 应用程序接口的 `lint()` 函数。

```js
stylelint.lint(options)
  .then(function(resultObject) { .. });
```

<!-- TOC -->

## 安装

stylelint 是一个 [npm 包](https://www.npmjs.com/package/stylelint)。它使用命令安装：

```console
npm install stylelint
```

## 选项

选项是具有以下属性的对象。

虽然 `files` 和 `code` 都是“可选的”，但您 *必须* 选择其中之一。其他所有选项都是可选的。

### `code`

要检查的 CSS 字符串。

### `codeFilename`

如果使用`code`直接传递源字符串，可以使用`codeFilename`将该代码与特定文件名相关联。

这可能很有用，比如在制作直接传递代码但仍需要使用配置的`ignoreFiles`功能的文本编辑器插件时，可能会忽略该代码。

### `config`

[stylelint 配置对象](configuration.md)。

如果没有传递 `config` 或 `configFile`，stylelint 将使用[配置查找算法](./configuration.md#加载配置对象)来查找正确的配置。

### `configFile`

包含 [stylelint 配置对象](configuration.md)的 JSON、YAML 或 JS 文件的路径。

它应该是绝对路径或您的进程运行目录（`process.cwd()`）的相对路径。我们建议使用绝对路径。

### `configBasedir`

绝对路径，定义 `extends` 和 `plugins` 的相对路径 *相对于* 的目录。

只有在直接通过 `config` 属性传递对象时才需要这样做。如果您用了 `configFile`，则这个选项不是必需的。

如果传递的 `config` 对象使用相对路径，例如用于 `extends` 或 `plugins`，您必须传递 `configBasedir`。如果没有使用相对路径，则不需要这个属性。

### `configOverrides`

部分 stylelint 配置对象，其属性将覆盖现有的配置对象，无论该配置是通过 `config` 选项还是 `.stylelintrc` 文件加载的。

`configOverrides` 和 `config` 选项之间的区别在于：如果传递了任何 `config` 对象，则 stylelint 不会去寻找 `.stylelintrc` 文件而只是使用您传递的 `config` 对象；但如果您想加载 `.stylelintrc` 文件 *并且* 覆盖它的特定部分，`configOverrides` 就是做这个的。

### `files`

文件 glob 或文件 glob 数组。最终传递给 [globby](https://github.com/sindresorhus/globby) 来找出您想要检查的文件。

相对 glob 将被认为是 `globbyOptions.cwd` 的相对路径。

默认情况下，忽略所有 `node_modules` 和 `bower_components`。

### `globbyOptions`

此选项将在使用 globby 时与 `files` 一起传递。

例如，您可以手动设置特定的`cwd`，这是 `files` glob 的当前工作目录的文件夹路径。`files` 中的相对 glob 将被认为是此路径的相对路径。默认情况下，`cwd` 将由 `process.cwd()` 设置。

有关更多详细信息，请参阅 [Globby 指南](https://github.com/sindresorhus/globby#options)。

### `formatter`

选项：`"compact"|"json"|"string"|"unix"|"verbose"` 或函数。默认是 `"json"`。

指定要用于结果的格式化程序。

如果传递函数，它必须符合[开发人员指南](../developer-guide/formatters.md)中描述的条款。

### `ignoreDisables`

如果为 `true`，则将忽略所有禁用注释（例如 `/* stylelint-disable block-no-empty */`）。

您可以使用此选项查看没有这些例外情况时您的检查结果会是什么样的。

### `disableDefaultIgnores`

如果为 `true`，则 stylelint 不会自动忽略 `node_modules` 和 `bower_components` 的内容。（默认情况下，这些目录会自动被忽略。）

### `cache`

存储有关已处理文件的信息，以便下次运行 stylelint 时仅对已更改的文件进行操作。启用此选项可以显著提高 stylelint 的速度，因为只会检查已更改的文件。

默认情况下，缓存存储在 `process.cwd()` 下的 `.stylelintcache` 中。要更改它，请使用 `cacheLocation` 选项。

**注意：** 如果使用 `cache` 运行 stylelint 然后运行没有 `cache` 的 stylelint，则会删除 `.stylelintcache` 文件。这是必要的，因为我们必须假设 `.stylelintcache` 被第二个命令废止。

### `cacheLocation`

用于 `cache` 的文件或目录的路径。只有与`cache` 共同使用才有意义。如果没有指定位置，将在 `process.cwd()` 中创建 `.stylelintcache`。

如果指定了目录，则将在指定的文件夹中创建缓存文件。该文件的名称将基于 `process.cwd()` 的哈希（例如 `.cache_hashOfCWD`）。这允许stylelint 为来自不同项目的各种缓存复用单个位置。

**注意：** 如果 `cacheLocation` 的目录不存在，请确保在 Windows 上添加一个尾随的`/`（在 \*nix 系统）或 `\`（在 Windows）。否则，路径将被假定为文件。

### `reportNeedlessDisables`

如果为 `true`，`ignoreDisables` 也将被设置为 `true`，返回的数据将包含 `needlessDisables` 属性，其值是一个对象数组，每个成员对应一个源代码，告诉您哪个 stylelint 禁用注释是没有阻止违规检查的。

使用此报告来清理代码库，仅保留有其服务目的的 stylelint 禁用注释。

*建议使用此选项的方法是通过命令行界面。* 它将向控制台输出一个干净的报告。

### `maxWarnings`

设置接受警告数量的限制。如果找到的警告数超过给定限制，将向返回的数据添加 `maxWarningsExceeded` 属性。
该值是一个对象（例如 `{ maxWarnings: 0, foundWarnings: 12 }` ）。

*建议使用此选项的方法是通过命令行界面。* 当超过 `maxWarnings` 时，它将以退出码2退出。

### `ignorePath`

包含描述要忽略的文件的模式的文件的路径。路径可以是绝对路径或 `process.cwd()` 的相对路径。默认情况下，stylelint 在 `process.cwd()` 中查找 `.stylelintignore`。请参阅[配置](configuration.md#stylelintignore)。

### `syntax`

选项：`"css-in-js"|"html"|"less"|"markdown"|"sass"|"scss"|"sugarss"`

强制使用特定的非标准语法来解析源样式表。

如果您希望通过自定义语法来使用 stylelint，请参阅下面的[`customSyntax`](#customsyntax)选项。

### `customSyntax`

自定义 [PostCSS 兼容语法](https://github.com/postcss/postcss#syntaxes)模块的绝对路径。

但请注意，stylelint 无法保证核心规则可以使用除上面 `syntax` 选项列出的默认值之外的语法。

### `fix`

如果为 `true`，则 stylelint 将尽可能多的修复错误，修复实际的源文件，报告未修复的错误。请参阅[自动修复错误](cli.md#自动修复错误)文档。

## 返回的 Promise

`stylelint.lint()` 返回一个 Promise 对象，它将解析为包含以下属性的对象：

### `errored`

布尔。如果为“true”，则至少有一个具有“错误”级别严重性的规则注册了违规。

### `output`

展示格式化违规的字符串（使用默认格式化程序或您传递的任何一个）。

### `postcssResults`

包含处理期间累积的所有 [PostCSS LazyResult](https://api.postcss.org/LazyResult.html) 的数组。

### `results`

包含所有 stylelint 结果对象（格式化程序使用的对象）的数组。

## 语法错误

当您的CSS包含语法错误时，`stylelint.lint()` 并不会拒绝Promise。
它解析一个对象（请参阅[返回的 Promise](#返回的-promise)），其中包含有关语法错误的信息。

## 用法示例

如果 `myConfig` 不包含 `extends` 或 `plugins` 的相对路径，则不必使用 `configBasedir`：

```js
stylelint.lint({
  config: myConfig,
  files: "all/my/stylesheets/*.css"
})
  .then(function(data) {
    // 利用 data.output、 data.errored、
    // 还有 data.results 做些什么
  })
  .catch(function(err) {
    // 利用 err 做些什么，例如
    console.error(err.stack);
  });
```

如果`myConfig` *包含* `extends` 或 `plugins` 的相对路径，您 *必须* 使用 `configBasedir`：

```js
stylelint.lint({
  config: myConfig,
  configBasedir: path.join(__dirname, "configs"),
  files: "all/my/stylesheets/*.css"
}).then(function() { .. });
```

也许您想使用 CSS 字符串而不是文件 glob，并且您想使用字符串格式化程序而不是默认的 JSON：

```js
stylelint.lint({
  code: "a { color: pink; }",
  config: myConfig,
  formatter: "string"
}).then(function() { .. });
```

也许您想使用我自己的自定义格式化程序函数并解析`.scss`源文件：

```js
stylelint.lint({
  config: myConfig,
  files: "all/my/stylesheets/*.scss",
  formatter: function(stylelintResults) { .. },
  syntax: "scss"
}).then(function() { .. });
```

相同的模式可用于检查 Less、SCSS 或 [SugarSS](https://github.com/postcss/sugarss) 语法。
