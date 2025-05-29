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

This rule resolves nested selectors before counting the specificity of a selector. Each selector in a [selector list](https://www.w3.org/TR/selectors4/#selector-list) is evaluated separately.

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

<!-- prettier-ignore -->
```css
.foo {
  color: red;
  @nest .baz .bar & {
    color: blue;
  }
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

<!-- prettier-ignore -->
```css
.foo {
  color: red;
  @nest .baz & {
    color: blue;
  }
}
```

## Optional secondary options

### `ignoreSelectors`

```json
{ "ignoreSelectors": ["array", "of", "selectors", "/regex/"] }
```

Given:

```json
{
  "selector-max-specificity": [
    "0,2,0",
    {
      "ignoreSelectors": [":host", ":host-context", "/^my-/"]
    }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
:host(.foo) .bar {}
```

<!-- prettier-ignore -->
```css
:host-context(.foo.bar) {}
```

<!-- prettier-ignore -->
```css
:host-context(.foo, :host(.bar).baz) {}
```

<!-- prettier-ignore -->
```css
my-element.foo.bar {}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
:host(.foo) .bar.baz {}
```

<!-- prettier-ignore -->
```css
:host-context(.foo.bar.baz) {}
```

<!-- prettier-ignore -->
```css
:host-context(.foo, :host(.bar), .foo.bar.baz) {}
```

<!-- prettier-ignore -->
```css
my-element.foo.bar.baz {}
```
