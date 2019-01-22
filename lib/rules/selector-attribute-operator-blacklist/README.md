# selector-attribute-operator-blacklist

Specify a blacklist of disallowed attribute operators.

```css
[target="_blank"] {}
/**    ↑
 * These operators */
```

## 选项

`array|string`: `["array", "of", "operators"]|"operator"`

给定：

```js
[ "*=" ]
```

以下模式被视为违规：

```css
[class*="test"] {}
```

以下模式*不*被视为违规：

```css
[target] {}
```

```css
[target="_blank"] {}
```

```css
[class|="top"] {}
```
