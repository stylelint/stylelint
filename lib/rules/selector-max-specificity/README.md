# selector-max-specificity

Limit the specificity of selectors.

```css
    .foo, #bar.baz span, #hoo { color: pink; }
/** ↑     ↑              ↑
 * Each of these selectors */
```

Visit the [Specificity Calculator](https://specificity.keegan.st) for visual representation of selector specificity.

This rule ignores selectors with variable interpolation (`#{$var}`, `@{var}`, `$(var)`).

This rule resolves nested selectors before calculating the specificity of a selector.

## 选项

`string`: Maximum specificity allowed.

Format is `"id,class,type"`, as laid out in the [W3C selector spec](https://drafts.csswg.org/selectors/#specificity-rules).

例如，使用 `"0,2,0"`：

以下模式被视为违规：

```css
#foo {}
```

```css
.foo .baz .bar {}
```

```css
.foo .baz {
  & .bar {}
}
```

```css
.foo {
  color: red;
  @nest .baz .bar & {
    color: blue;
  }
}
```

以下模式*不*被视为违规：

```css
div {}
```

```css
.foo div {}
```

```css
.foo div {
  & div a {}
}
```

```css
.foo {
  & .baz {}
}
```

```css
.foo {
  color: red;
  @nest .baz & {
    color: blue;
  }
}
```

## 可选的辅助选项

### `ignoreSelectors: ["/regex/", /regex/, "string"]`

给定：

```js
["0,2,0", {
  ignoreSelectors: [":global", ":local", "/my-/"]
}];
```

以下模式*不*被视为违规：

```css
:global(.foo) .bar {}
```

```css
:local(.foo.bar)
```

```css
:local(.foo, :global(.bar).baz)
```

以下模式被视为违规：

```css
:global(.foo) .bar.baz {}
```

```css
:local(.foo.bar.baz)
```

```css
:local(.foo, :global(.bar), .foo.bar.baz)
```
