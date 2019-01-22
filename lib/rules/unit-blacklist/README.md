# unit-blacklist

Specify a blacklist of disallowed units.

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
a { width: 100px; }
```

```css
a { font-size: 10em; }
```

```css
a { transform: rotate(30deg); }
```

以下模式*不*被视为违规：

```css
a { font-size: 1.2rem; }
```

```css
a { line-height: 1.2; }
```

```css
a { height: 100vmin; }
```

```css
a { animation: animation-name 5s ease; }
```

## 可选的辅助选项

### `ignoreProperties: { unit: ["property", "/regex/", /regex/] }`

Ignore units in the values of declarations with the specified properties.

For example, with `["px", "vmin"]`.

给定：

```js
{
  "px": [ "font-size", "/^border/" ],
  "vmin": [ "width" ]
}
```

以下模式*不*被视为违规：

```css
a { font-size: 13px; }
```

```css
a { border-bottom-width: 6px; }
```

```css
a { width: 100vmin; }
```

以下模式被视为违规：

```css
a { line-height: 12px; }
```

```css
a { -moz-border-radius-topright: 40px; }
```

```css
a { height: 100vmin; }
```

### `ignoreMediaFeatureNames: { unit: ["property", "/regex/", /regex/] }`

Ignore units for specific feature names.

For example, with `["px", "dpi"]`.

给定：

```js
{
  "px": [ "min-width", "/height$/" ],
  "dpi": [ "resolution" ]
}
```

以下模式*不*被视为违规：

```css
@media (min-width: 960px) {}
```

```css
@media (max-height: 280px) {}
```

```css
@media not (resolution: 300dpi) {}
```

以下模式被视为违规：

```css
@media screen and (max-device-width: 500px) {}
```

```css
@media all and (min-width: 500px) and (max-width: 200px) {}
```

```css
@media print and (max-resolution: 100dpi) {}
```
