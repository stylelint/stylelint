# selector-max-specificity

Limit the specificity of selectors.

<!-- prettier-ignore -->
```css
    .foo, #bar.baz span, #hoo { color: pink; }
/** ↑     ↑              ↑
 * Each of these selectors */
```

Visit the [Specificity Calculator](https://specificity.keegan.st) for visual representation of selector specificity.

This rule ignores selectors with variable interpolation (`#{$var}`, `@{var}`, `$(var)`).

This rule adheres to the [CSS Nesting specification](https://drafts.csswg.org/css-nesting/) when calculating specificity. The [specificity](https://drafts.csswg.org/selectors-4/#specificity-rules) of the [nesting selector](https://drafts.csswg.org/css-nesting/#nest-selector) (`&`) is equal to the largest specificity among the complex selectors in the parent's selector list (identical to the behavior of [`:is()`](https://drafts.csswg.org/selectors-4/#matches)).

Each selector in a [selector list](https://drafts.csswg.org/selectors-4/#grouping) is evaluated separately.

> [!WARNING]
> This rule is only appropriate for CSS. You should not turn it on for CSS-like languages, such as SCSS or Less.

This rule supports 3 [message arguments](../../../docs/user-guide/configure.md#message): the selector, the configured maximum specificity, and the selector's resolved form.

## Options

### `string`

Specify a maximum specificity allowed.

The format is `"id,class,type"`, as laid out in the [W3C selector spec](https://drafts.csswg.org/selectors/#specificity-rules).

Given:

```json
{
  "selector-max-specificity": "0,2,0"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
#foo {}
```

<!-- prettier-ignore -->
```css
.foo .baz .bar {}
```

<!-- prettier-ignore -->
```css
.foo .baz {
  & .bar {}
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
div {}
```

<!-- prettier-ignore -->
```css
.foo div {}
```

<!-- prettier-ignore -->
```css
.foo div {
  & div a {}
}
```

<!-- prettier-ignore -->
```css
.foo {
  & .baz {}
}
```
