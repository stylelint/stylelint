# selector-no-unmatchable

Disallow unmatchable selectors.

<!-- prettier-ignore -->
```css
label:enabled {}
/**  ↑
 * Selectors like this */
```

Unmatchable selectors are valid, but can never match anything.

This rule flags selectors that:

- pair a pseudo-class with elements it never matches, e.g. `label:enabled`
- pair pseudo-classes that never match the same element, e.g. `:any-link:checked`
- pseudo-class pseudo-elements with tree-structural pseudo-classes, e.g. `::before:first-child`
- contain pseudo-elements within `:is()` or `:where()`, which cannot represent them, e.g. `:is(::before)`
- contain the nesting selector (`&`) where it cannot represent its pseudo-element ancestor rules
- select around the shadow host in ways its tree does not allow, e.g. `a :host` and `::slotted(:host)`

This rule resolves nested selectors according to the [CSS Nesting specification](https://drafts.csswg.org/css-nesting/).

> [!WARNING]
> This rule is only appropriate for CSS. You should not turn it on for CSS-like languages, such as SCSS or Less.

This rule supports up to 3 [message arguments](../../../docs/user-guide/configure.md#message): the selector, its resolved form when nesting is involved, and the reason it is unmatchable.

## Options

### `true`

```json
{
  "selector-no-unmatchable": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
label:checked {}
```

<!-- prettier-ignore -->
```css
::before:first-child {}
```

<!-- prettier-ignore -->
```css
:is(::before) {}
```

<!-- prettier-ignore -->
```css
a::before {
  .foo:hover & {}
}
```

<!-- prettier-ignore -->
```css
a :host {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
input:checked {}
```

<!-- prettier-ignore -->
```css
a::before {}
```

<!-- prettier-ignore -->
```css
.foo:hover a::before {}
```

<!-- prettier-ignore -->
```css
:host a {}
```
