# 编写格式化程序

格式化程序是一个函数，它接收 *一个这种 stylelint 结果对象组成的数组* 并输出一个字符串：

```js
// 一个 stylelint 结果对象
{
  source:  "path/to/file.css", // 文件路径或者 PostCSS 标识符（例如<input css 1>）
  errored: true, // 如果至少有一个具有“错误”级别严重性的规则触发了警告，则为 `true`
  warnings: [ // 违反规则的警告对象数组，每个对象如下面这样...
    {
      line: 3,
      column: 12,
      rule: "block-no-empty",
      severity: "error",
      text: "You should not have an empty block (block-no-empty)"
    },
    ..
  ],
  deprecations: [ // 描述警告的对象数组，每个对象如下面这样...
    {
      text: "Feature X has been deprecated and will be removed in the next major version.",
      reference: "https://stylelint.io/docs/feature-x.md"
    }
  ],
  invalidOptionWarnings: [ // 非法选项警告对象数组，每个对象如下面这样...
    {
      text: "Invalid option X for rule Y",
    }
  ],
  ignored: false // 如果文件的路径匹配一个提供的忽略模式，则为 `true`
}
```

## `stylelint.formatters`

styelint的核心格式化器在 `stylelint.formatters` 中暴露给外界
