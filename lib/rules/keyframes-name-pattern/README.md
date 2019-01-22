# keyframes-name-pattern

Specify a pattern for keyframe names.

```css
@keyframes slide-right {}
/**             ↑
 * The pattern of this */
```

## 选项

`regex|string`

A string will be translated into a RegExp — `new RegExp(yourString)` — so *be
sure to escape properly*.

Given the string:

```js
"foo-.+"
```

以下模式被视为违规：

```css
@keyframes foo {}
```

```css
@keyframes bar {}
```

```css
@keyframes FOO-bar {}
```

以下模式*不*被视为违规：

```css
@keyframes foo-bar {}
```
