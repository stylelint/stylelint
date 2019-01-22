# custom-property-pattern

Specify a pattern for custom properties.

```css
a { --foo-: 1px; }
/**   ↑
 * The pattern of this */
```

## 选项

`regex|string`

A string will be translated into a RegExp like so `new RegExp(yourString)` — so be sure to escape properly.

Given the string:

```js
"foo-.+"
```

以下模式被视为违规：

```css
:root { --boo-bar: 0; }
```

以下模式*不*被视为违规：

```css
:root { --foo-bar: 0; }
```
