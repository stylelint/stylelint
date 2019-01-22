# selector-class-pattern

Specify a pattern for class selectors.

```css
    .foo, #bar.baz span, #hoo[disabled] { color: pink; }
/** ↑         ↑
 * These class selectors */
```

This rule ignores non-outputting Less mixin definitions and called Less mixins.

Escaped selectors (e.g. `.u-size-11\/12\@sm`) are parsed as escaped twice (e.g. `.u-size-11\\/12\\@sm`). Your RegExp should account for that.

## 选项

`regex|string`

A string will be translated into a RegExp — `new RegExp(yourString)` — so *be sure to escape properly*.

The selector value *after `.`* will be checked. No need to include `.` in your pattern.

Given the string:

```js
"foo-[a-z]+"
```

以下模式被视为违规：

```css
.foop {}
```

```css
.foo-BAR {}
```

```css
div > #zing + .foo-BAR {}
```

以下模式*不*被视为违规：

```css
.foo-bar {}
```

```css
div > #zing + .foo-bar {}
```

```css
#foop {}
```

```css
[foo='bar'] {}
```

```less
.foop() {}
```

```less
.foo-bar {
  .foop;
}
```

## 可选的辅助选项

### `resolveNestedSelectors: true | false` (default: `false`)

This option will resolve nested selectors with `&` interpolation.

For example, with `true`.

Given the string:

```js
"^[A-Z]+$"
```

以下模式被视为违规：

```css
.A {
  &__B {} /* resolved to ".A__B" */
}
```

以下模式*不*被视为违规：

```css
.A {
  &B {} /* resolved to ".AB" */
}
```
