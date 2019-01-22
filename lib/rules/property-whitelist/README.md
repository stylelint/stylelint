# property-whitelist

Specify a whitelist of allowed properties.

```css
a { display: block; }
/** ↑
 * These properties */
```

This rule ignores variables (`$sass`, `@less`, `--custom-property`).

## 选项

`array|string`: `["array", "of", "unprefixed", /properties/ or "regex"]|"property"|"/regex/"`|/regex/

If a string is surrounded with `"/"` (e.g. `"/^background/"`), it is interpreted as a regular expression. This allows, for example, easy targeting of shorthands: `/^background/` will match `background`, `background-size`, `background-color`, etc.

给定：

```js
["display", "animation", "/^background/"]
```

以下模式被视为违规：

```css
a { color: pink; }
```

```css
a {
  animation: my-animation 2s;
  color: pink;
}
```

```css
a { borkgrund: orange; }
```

以下模式*不*被视为违规：

```css
a { display: block; }
```

```css
a { -webkit-animation: my-animation 2s; }
```

```css
a {
  animation: my-animation 2s;
  -webkit-animation: my-animation 2s;
  display: block;
}
```

```css
a { background: pink; }
```

```css
a { background-color: pink; }
```
