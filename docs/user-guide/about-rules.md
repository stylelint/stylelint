# 关于规则

我们一直非常谨慎地对待规则命名一致性。

这些规则旨在协同执行严格的约定。

<!-- TOC -->

## 关于规则名称

规则名称是：

-   由连字符分隔的小写单词组成
-   分为两部分

第一部分描述了规则适用的[*事物*](http://apps.workflower.fi/vocabs/css/en)。第二部分描述了规则检查的内容。

例如：

```js
"number-leading-zero"
// ↑          ↑
// 事物       规则检查的内容
```

当规则适用于整个样式表时，没有第一部分。

例如：

```js
"no-eol-whitespace"
"indentation"
//    ↑
// 规则检查的内容
```

### 否定规则

大多数规则要求*或*禁止某些内容。

例如，数字必须*有*或*无*前导零：

-   `number-leading-zero`: `string -   "always"|"never"`
    -   `"always"` -   *必须有*前导0
    -   `"never"` -   *必须无*前导0

```css
a { line-height: 0.5; }
/**              ↑
 *          这个前导零 */
```

然而，有些规则*只是禁止*某些事物。这些规则在其名称中包含 `*-no-*`。

例如，是否应禁止空块：

-   `block-no-empty` -   块*必须不*为空

```css
a {   }
/** ↑
 * 像这样的块 */
```

请注意，对于这样的规则，如果有一个强制执行相反的选项，即每个块*必须*为空，则没有意义。

### 最大和最小规则

`*-max-*` 和 `*-min-*` 规则用于*设置限制*。

例如，用一个数值指定数字中“.”之后的最大位数：

-   `number-max-precision`: `int`

```css
a { font-size: 1.333em; }
/**             ↑
 * "." 之后最大的数字位数 */
```

### 空白规则

空格规则允许您指定是否必须在样式表的某个特定部分中使用空行，单个空格，换行符或无空白。

空白规则组合了两组关键字：

-   `before`、`after` 和 `inside` 用于指定预期空格（如果有）的位置
-   `empty-line`、`space` 和 `newline` 用于指定是否需要单个空行，单个空格，单个换行符或无空白

例如，指定样式表中的所有注释之前是否必须有一个空行或无空白：

-   `comment-empty-line-before`: `string` -   `"always"|"never"`

```css
a {}
           ←
/* 注释 */ ↑
           ↑
/**        ↑
 * 这个空行 */
```

此外，一些空白规则使用另一组关键字：

-   `comma`、`colon`、`semicolon`、`opening-brace`、`closing-brace`、`opening-parenthesis`、`closing-parenthesis`、`operator` 或 `range-operator` 用于*事物*中指定的标点具体部位

例如，指定函数中的逗号后是否必须包含单个空格或无空白：

-   `function-comma-space-after`: `string` -   `"always"|"never"`

```css
a { transform: translate(1, 1) }
/**                       ↑
 *               这个逗号之后的空格 */
```

标点符号的复数用于 `inside` 规则。例如，指定位于函数括号内必须的单个空格或无空白：

-   `function-parentheses-space-inside`: `string` -   `"always"|"never"`

```css
a { transform: translate( 1, 1 ); }
/**                     ↑      ↑
 *                这两个括号内的空格 */
```

## 规则协同工作

这些规则可以一起使用以强制执行严格的约定。

### `*-newline/space-before` 和 `*-newline/space-after` 规则

假设您希望每个声明当中的冒号之前无空白，冒号之后只有一个空格：

```css
a { color: pink; }
/**      ↑
 * 此冒号前无空白，此冒号后有一个空格 */
```

您可以用以下方法强制执行：

```js
"declaration-colon-space-after": "always",
"declaration-colon-space-before": "never"
```

某些*事物*（例如声明块和值列表）可以跨越多行。在这些情况下，可以使用 `newline` 规则和额外选项来提供灵活性。

例如，这是一套完整的 `value-list-comma-*` 规则及其选项：

-   `value-list-comma-space-after`: `"always"|"never"|"always-single-line"|"never-single-line"`
-   `value-list-comma-space-before`: `"always"|"never"|"always-single-line"|"never-single-line"`
-   `value-list-comma-newline-after`: `"always"|"always-multi-line|"never-multi-line"`
-   `value-list-comma-newline-before`: `"always"|"always-multi-line"|"never-multi-line"`

其中 `*-multi-line` 和 `*-single-line` 引用了值列表（*事物*）。例如，给定：

```css
a,
b {
  color: red;
  font-family: sans, serif, monospace; /* 单行值列表 */
}              ↑                    ↑
/**            ↑                    ↑
 *      值列表开始于这里，       结束于这里 */
```

此示例中只有单行值列表。选择器、声明块和规则是多行的。这就是 `*-multi-line` 和 `*-single-line` 在此规则的上下文中引用的内容。

#### 示例 A

假设您只想允许单行值列表。并且您希望逗号之前无空白，逗号之后只有一个空格：

```css
a {
  font-family: sans, serif, monospace;
  box-shadow: 1px 1px 1px red, 2px 2px 1px 1px blue inset, 2px 2px 1px 2px blue inset;
}
```

您可以用以下方法强制执行：

```js
"value-list-comma-space-after": "always",
"value-list-comma-space-before": "never"
```

#### 示例 B

假设您要同时允许单行和多行值列表。您希望单行列表中的逗号之后有一个空格，而单行和多行列表中的逗号之前无空白：

```css
a {
  font-family: sans, serif, monospace; /* 单行值列表，逗号之后有一个空格，但逗号之前无空白 */
  box-shadow: 1px 1px 1px red, /* 多行值列表，... */
    2px 2px 1px 1px blue inset, /* ... 逗号之后有一个换行符, ...  */
    2px 2px 1px 2px blue inset; /* ... 但逗号之前无空白 */
}
```

您可以用以下方法强制执行：

```js
"value-list-comma-newline-after": "always-multi-line",
"value-list-comma-space-after": "always-single-line",
"value-list-comma-space-before": "never"
```

#### 示例 C

假设您要同时允许单行和多行值列表。您希望单行列表中的逗号之前无空白，并且两种列表中的逗号后面始终都是空格：

```css
a {
  font-family: sans, serif, monospace;
  box-shadow: 1px 1px 1px red
    , 2px 2px 1px 1px blue inset
    , 2px 2px 1px 2px blue inset;
}
```

您可以用以下方法强制执行：

```js
"value-list-comma-newline-before": "always-multi-line",
"value-list-comma-space-after": "always",
"value-list-comma-space-before": "never-single-line"
```

#### 示例 D

最后，规则足够灵活，可以对单行和多行列表强制执行完全不同的约定。假设您要同时允许单行和多行值列表。您希望单行列表在冒号之前和之后具有单个空格。您希望多行列表在逗号之前有一个换行符，但之后无空白：

```css
a {
  font-family: sans , serif , monospace; /* single-line list with a single space before and after the comma */
  box-shadow: 1px 1px 1px red /* multi-line list ... */
    ,2px 2px 1px 1px blue inset /* ... with newline before, ...  */
    ,2px 2px 1px 2px blue inset; /* ... but no space after the comma */
}
```

您可以用以下方法强制执行：

```js
"value-list-comma-newline-after": "never-multi-line",
"value-list-comma-newline-before": "always-multi-line",
"value-list-comma-space-after": "always-single-line",
"value-list-comma-space-before": "always-single-line"
```

### `*-empty-line-before` 和 `*-max-empty-lines` 规则

这些规则共同控制不同位置允许的空行。

每个*事物*负责将自己推动*前面的事物*，而不是推动*后续的事物*。这种一致性是为了避免冲突，这就是为什么 stylelint 中没有任何 `*-empty-line-after` 规则。

假设您要强制执行以下操作：

```css
a {
  background: green;
  color: red;

  @media (min-width: 30em) {
    color: blue;
  }
}

b {
  --custom-property: green;

  background: pink;
  color: red;
}
```

您可以这样做：

```js
"at-rule-empty-line-before": ["always", {
  "except": ["first-nested"]
}],
"custom-property-empty-line-before": [ "always", {
  "except": [
    "after-custom-property",
    "first-nested"
  ]
}],
"declaration-empty-line-before": ["always", {
  "except": [
    "after-declaration",
    "first-nested"
  ]
}],
"block-closing-brace-empty-line-before": "never",
"rule-empty-line-before": ["always-multi-line"]
```

我们建议您将主要选项（例如 `"always"` 或 `"never"`）设置为最普遍的风格，并使用 `except` 可选的辅助选项定义例外。`except` 选项有很多值，例如 `first-nested`、`after-comment` 等。

`*-empty-line-before` 规则控制在*事物*之前不要或者必须空*一行或多行*空行。`*-max-empty-lines` 规则通过控制*事物*中的*空行数*。`max-empty-lines` 规则用于设置整个源代码的限制。然后可以使用诸如 `function-max-empty-lines`、`selector-max-empty-lines` 和 `value-list-max-empty-lines` 之类的规则来更严格的设置 *事物* 内的空行限制。

例如，假设您要强制执行以下操作：

```css
a,
b {
  box-shadow:
    inset 0 2px 0 #dcffa6,
    0 2px 5px #000;
}

c {
  transform:
    translate(
      1,
      1
    );
}
```

即整个源代码中最多有1个空行，但函数，选择器列表和值列表中没有空行。

您可以这样做：

```js
"function-max-empty-lines": 0,
"max-empty-lines": 1,
"selector-list-max-empty-lines": 0,
"value-list-max-empty-lines": 0
```

### `*-whitelist`、`*-blacklist`、`color-named` 和可应用 `*-no-*` 规则

这些规则协同工作用以允许（或禁止）语言特征和结构。

这里有针对 CSS 语言的主要结构的 `*-whitelist` 和 `*-blacklist` 规则：@规则，函数，声明（即属性-值对），属性和单位。这些规则可用于允许（或禁止）使用这些结构的任何语言特性（例如 `@media`、`rgb()`）。但是，有些功能没有被这些 `*-whitelist` 和 `*-blacklist` 规则捕获（或者只需要复杂的正则表达式来配置）。有一些单独的规则，通常是 `*-no-*` 规则（例如 `color-no-hex` 和 `selector-no-id`），以禁止这些功能。

假设您想禁止 `@debug` 语言扩展。您可以使用 `at-rule-blacklist` 或 `at-rule-whitelist` 规则来执行此操作，因为 `@debug` 语言扩展使用 @规则 构造，例如：

```js
"at-rule-blacklist": ["debug"]
```

假设您无论出于何种原因，想要禁止全部@规则构造。您可以这样做：

```js
"at-rule-whitelist": []
```

假设您要禁用 `border` 属性的值 `none`。您可以使用 `declaration-property-value-blacklist` 或 `declaration-property-value-whitelist` 来做到这一点，例如

```js
"declaration-property-value-blacklist": [{
  "/^border/": ["none"]
}]
```

#### 颜色

大部分 `<颜色>` 值是*函数*。因此，可以使用 `function-blacklist` 或  `function-whitelist` 规则允许（或禁止）它们。还有两种不是函数的颜色表示法：命名颜色和十六进制颜色。允许（或禁止）这两个特定的规则：`color-named` 和 `color-no-hex`。

假设您要强制执行 *如果颜色有相应的命名* 则使用命名颜色，否则使用使用 `hwb` 颜色，例如：

```css
a {
  background: hwb(235, 0%, 0%); /* 此颜色没有相应的命名 */
  color: black;
}
```

如果您采用白名单方法，您可以这样做：

```js
"color-named": "always-where-possible",
"color-no-hex": true,
"function-whitelist": ["hwb"]
```

或者，如果您采用黑名单方法：

```js
"color-named": "always-where-possible",
"color-no-hex": true,
"function-blacklist": ["/^rgb/", "/^hsl/", "gray"]
```

这种方法可以扩展使用到语言扩展（使用 @规则和函数这两个内置可扩展语法结构）时。例如，假设您要禁止所有标准颜色表示法，而使用自定义颜色表示法，例如 `my-color(red with a dash of green / 5%)`。您可以这样做：

```js
"color-named": "never",
"color-no-hex": true,
"function-whitelist": ["my-color"]
```
