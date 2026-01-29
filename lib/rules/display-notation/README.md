# display-notation

Specify short or full notation for the `display` property.

<!-- prettier-ignore -->
```css
a { display: block; }
/**          ↑
 *           This notation */
```

Modern `display` property values allow you to define both the [outer and inner display type](https://drafts.csswg.org/css-display-3/#the-display-properties) separately (e.g. `inline flex`). While CSS 2 used a single-keyword, precomposed syntax for the `display` property (e.g. `inline-flex`).

In the [Display Module Level 3 specification](https://drafts.csswg.org/css-display-3/) the following precomposed values are defined as legacy:

- `inline-block`
- `inline-flex`
- `inline-grid`
- `inline-table`

More recent and future inner display types (e.g. `grid-lanes`) can only be combined with the [modern, multi-keyword syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Display/Multi-keyword_syntax).

The full notation explicitly describes the inner and outer display types of elements. This notation makes it easier to understand how an element will behave and to learn about the various display types.

The short notation omits defaults or switches to legacy values, and doesn't follow the modern principle of value composition.

This rule ignores `$sass`, `@less`, and `var(--custom-property)` variable syntaxes.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

### `"full"`

Applicable display values _must always_ use the full notation.

```json
{
  "display-notation": "full"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { display: block; }
```

<!-- prettier-ignore -->
```css
a { display: grid; }
```

<!-- prettier-ignore -->
```css
a { display: list-item; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { display: block flow; }
```

<!-- prettier-ignore -->
```css
a { display: block grid; }
```

<!-- prettier-ignore -->
```css
a { display: block flow list-item; }
```

### `"short"`

Applicable display values _must always_ use the short notation.

```json
{
  "display-notation": "short"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { display: block flow; }
```

<!-- prettier-ignore -->
```css
a { display: block grid; }
```

<!-- prettier-ignore -->
```css
a { display: block flow list-item; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { display: block; }
```

<!-- prettier-ignore -->
```css
a { display: grid; }
```

<!-- prettier-ignore -->
```css
a { display: list-item; }
```

## Optional secondary options

### `ignore`

```json
{ "ignore": ["array", "of", "options"] }
```

#### `"non-legacy-values"`

Ignore display values that are not legacy values.

Given:

```json
{
  "display-notation": ["full", { "ignore": ["non-legacy-values"] }]
}
```

The following patterns are considered problems:

```css
a {
  display: inline-block;
}
```

```css
a {
  display: inline-flex;
}
```

The following patterns are _not_ considered problems:

```css
a {
  display: inline;
}
```

```css
a {
  display: grid;
}
```

```css
a {
  display: inline flow-root;
}
```

### `except`

```json
{ "except": ["array", "of", "options"] }
```

#### `"legacy-values"`

Reverse the primary option for legacy values.

Given:

```json
{
  "display-notation": ["short", { "except": ["legacy-values"] }]
}
```

The following patterns are considered problems:

```css
a {
  display: inline-block;
}
```

```css
a {
  display: inline-flex;
}
```

The following patterns are _not_ considered problems:

```css
a {
  display: block;
}
```

```css
a {
  display: inline flow-root;
}
```

```css
a {
  display: inline list-root;
}
```
