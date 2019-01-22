# selector-id-pattern

Specify a pattern for ID selectors.

```css
.foo, #bar.baz a, #hoo[disabled] { color: pink; }
/**   ↑           ↑
 * These ID selectors */
```

## 选项

`regex|string`

A string will be translated into a RegExp — `new RegExp(yourString)` — so *be sure to escape properly*.

The selector value *after `#`* will be checked. No need to include `#` in your pattern.

Given the string:

```js
"foo-[a-z]+"
```

以下模式被视为违规：

```css
#foop {}
```

```css
#foo-BAR {}
```

```css
div > .zing + #foo-BAR {}
```

以下模式*不*被视为违规：

```css
#foo-bar {}
```

```css
div > .zing + #foo-bar {}
```

```css
.foop {}
```

```css
[foo='bar'] {}
```
