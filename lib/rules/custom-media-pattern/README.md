# custom-media-pattern

Specify a pattern for custom media query names.

```css
@custom-media --foo (max-width: 30em);
/**             ↑
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
@custom-media --bar (min-width: 30em);
```

以下模式*不*被视为违规：

```css
@custom-media --foo-bar (min-width: 30em);
```
