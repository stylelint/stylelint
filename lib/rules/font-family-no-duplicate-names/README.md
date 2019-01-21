# font-family-no-duplicate-names

禁止使用重复的字体族名称。

```css
a { font-family: serif, serif; }
/**              ↑      ↑
 *            这些字体族名称 */
```

该规则会检测 `font` 和 `font-family`属性。

该规则会忽略`$sass`、`@less` 和 `var(--custom-property)` 变量语法。

**警告:** 这条规则有时候会被*未加引号*的多字字体名称和*未加引号*的包含转义字符的字体名称触发。只要用引号包住这些字体名称，就能解决这个问题。

## 选项

### `true`

以下模式被视为违规：

```css
a { font-family: 'Times', Times, serif; }
```

```css
a { font: 1em "Arial", 'Arial', sans-serif; }
```

```css
a { font: normal 14px/32px -apple-system, BlinkMacSystemFont, sans-serif, sans-serif; }
```

以下模式*不*被视为违规。

```css
a { font-family: Times, serif; }
```

```css
a { font: 1em "Arial", "sans-serif", sans-serif; }
```

```css
a { font: normal 14px/32px -apple-system, BlinkMacSystemFont, sans-serif; }
```

## 可选的次选项

### `ignoreFontFamilyNames: ["/regex/", /regex/, "string"]`

Given:

```js
["/^My Font /", "monospace"]
```

以下模式*不*被视为违规。

```css
font-family: monospace, monospace
```

```css
font-family: "My Font Family", "My Font Family", monospace
```
