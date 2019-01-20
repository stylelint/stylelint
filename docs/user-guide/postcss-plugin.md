# stylelint PostCSS 插件

与任何其他 [PostCSS 插件](https://github.com/postcss/postcss#plugins)一样，您可以使用 stylelint 的 PostCSS 插件，可以使用 [PostCSS 运行器](https://github.com/postcss/postcss#runners)，也可以直接使用 PostCSS JS 应用程序接口。

*但是，如果专用的 stylelint 任务运行插件[可用](complementary-tools.md)（例如 [gulp-stylelint](https://github.com/olegskl/gulp-stylelint) 或 [grunt-stylelint](https://github.com/wikimedia/grunt-stylelint)）我们建议您使用该插件而不是此插件，因为它们可以提供更好的报告。*

<!-- TOC -->

## 安装

stylelint 是一个 [npm 包](https://www.npmjs.com/package/stylelint)。它使用命令安装：

```console
npm install stylelint --save-dev
```

## 选项

该插件接受选项对象作为参数，具有以下属性：

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

### `ignoreDisables`

如果为 `true`，则将忽略所有禁用注释（例如 `/* stylelint-disable block-no-empty */`）。

您可以使用此选项查看没有这些例外情况时您的检查结果会是什么样的。

### `ignorePath`

包含描述要忽略的文件的模式的文件的路径。路径可以是绝对路径或 `process.cwd()` 的相对路径。默认情况下，stylelint 在 `process.cwd()` 中查找 `.stylelintignore`。请参阅[配置](configuration.md#stylelintignore)。

## 用法示例

我们建议您在应用任何转换之前检查 CSS。您可以这样做：

-   创建独立的lint任务，该任务独立于构建任务。
-   使用 [`postcss-import`](https://github.com/postcss/postcss-import) 的 [`plugins` option](https://github.com/postcss/postcss-import#plugins) 或 [`postcss-easy-import`](https://github.com/TrySound/postcss-easy-import) 在进行任何转换之前检查文件。
-   将 stylelint 放在插件管道的开头。

您还需要一个报告生成器。*stylelint 插件通过 PostCSS 注册警告* 。因此，您需要用于打印警告的 PostCSS 运行器或插件，其目的是格式化和打印警告（例如 [`postcss-reporter`](https://github.com/postcss/postcss-reporter)）。

### 示例 A

一个单独的检查任务，通过 PostCSS JS 应用程序接口使用[`postcss-less`](https://github.com/shellscape/postcss-less)和本插件来检查 Less。

*注意：stylelint PostCSS 插件与 stylelint 命令行界面和 Node.js 应用程序接口不同，没有 `syntax` 选项。相反，必须在 [PostCSS 选项](https://github.com/postcss/postcss#options)中设置语法，因为管道中只能有一个解析器/语法。*

```js
var fs = require("fs")
var less = require("postcss-less")
var postcss = require("postcss")

// 要处理的CSS

var css = fs.readFileSync("input.css", "utf8")

postcss([
  require("stylelint")({ /* 您的选项 */ }),
  require("postcss-reporter")({ clearReportedMessages: true })
])
  .process(css, {
    from: "input.css",
    syntax: less
  })
  .then()
  .catch(err => console.error(err.stack))
```

相同的模式可用于检查 Less、SCSS 或 [SugarSS](https://github.com/postcss/sugarss) 语法。

### 示例 B

组合检查和构建任务，其中本插件通过 PostCSS JS 应用程序接口使用，但使用在 [`postcss-import`](https://github.com/postcss/postcss-import) 中（利用其 `plugins` 选项），以便在进行任何转换之前对源文件进行检查。

```js
var fs = require("fs")
var postcss = require("postcss")
var stylelint = require("stylelint")

// 要处理的CSS
var css = fs.readFileSync("lib/app.css", "utf8")

postcss(
  [
    require("postcss-import")({
      plugins: [
        require("stylelint")({ /* 您的选项 */ })
      ]
    }),
    require("postcss-cssnext"),
    require("postcss-reporter")({ clearReportedMessages: true })
  ]
)
  .process(css, { from: 'lib/app.css', to: 'app.css' })
  .then(function (result) {
    fs.writeFileSync('app.css', result.css);
    if ( result.map ) fs.writeFileSync('app.css.map', result.map);
  })
  .catch(err => console.error(err.stack))
```
