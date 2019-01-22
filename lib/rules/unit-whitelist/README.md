# unit-whitelist

Specify a whitelist of allowed units.

```css
a { width: 100px; }
/**           ↑
 *  These units */
```

## 选项

`array|string`: `["array", "of", "units"]|"unit"`

给定：

```js
["px", "em", "deg"]
```

以下模式被视为违规：

```css
a { width: 100%; }
```

```css
a { font-size: 10rem; }
```

```css
a { animation: animation-name 5s ease; }
```

以下模式*不*被视为违规：

```css
a { font-size: 1.2em; }
```

```css
a { line-height: 1.2; }
```

```css
a { height: 100px; }
```

```css
a { height: 100PX; }
```

```css
a { transform: rotate(30deg); }
```

## 可选的辅助选项

### `ignoreProperties: { unit: ["property", "/regex/", /regex/] }`

Ignore units in the values of declarations with the specified properties.

For example, with `["px", "em"]`.

给定：

```js
{
  "rem": [ "line-height", "/^border/" ],
  "%": [ "width" ]
}
```

以下模式*不*被视为违规：

```css
a { line-height: 0.1rem; }
```

```css
a { border-bottom-width: 6rem; }
```

```css
a { width: 100%; }
```

以下模式被视为违规：

```css
a { margin: 0 20rem; }
```

```css
a { -moz-border-radius-topright: 20rem; }
```

```css
a { height: 100%; }
```
