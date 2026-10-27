# color-function-notation

Specify modern or legacy notation for color-functions.

<!-- prettier-ignore -->
```css
    a { color: rgb(0 0 0 / 0.2) }
/**            ↑
 *             This notation */
```

You can use this rule to enforce a convention. `rgb()` and `hsl()` accept a [modern syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/rgb#syntax) and a legacy syntax. The modern syntax follows the rest of CSS, where values are space-separated, the alpha value follows a slash, and commas separate repetitions only, while the legacy syntax separates every argument with commas.

Use:

- `"modern"` to follow the specification, which keeps the legacy syntax only for compatibility
- `"legacy"` for older browsers, which accept only the comma-separated syntax

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix some of the problems reported by this rule when the primary option is `"modern"`.

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the configured notation.

## Options

### `"modern"`

Applicable color-functions _must always_ use modern notation.

```json
{
  "color-function-notation": "modern"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: rgb(0, 0, 0) }
```

<!-- prettier-ignore -->
```css
a { color: rgba(12, 122, 231, 0.2) }
```

<!-- prettier-ignore -->
```css
a { color: hsla(270, 60%, 50%, 15%) }
```

<!-- prettier-ignore -->
```css
a { color: hsl(.75turn, 60%, 70%) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: rgb(0 0 0) }
```

<!-- prettier-ignore -->
```css
a { color: rgb(12 122 231 / 0.2) }
```

<!-- prettier-ignore -->
```css
a { color: hsl(270 60% 50% / 15%) }
```

<!-- prettier-ignore -->
```css
a { color: hsl(.75turn 60% 70%) }
```

### `"legacy"`

Applicable color-functions _must always_ use the legacy notation.

```json
{
  "color-function-notation": "legacy"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: rgb(0 0 0) }
```

<!-- prettier-ignore -->
```css
a { color: rgb(12 122 231 / 0.2) }
```

<!-- prettier-ignore -->
```css
a { color: hsl(270 60% 50% / 15%) }
```

<!-- prettier-ignore -->
```css
a { color: hsl(.75turn 60% 70%) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: rgb(0, 0, 0) }
```

<!-- prettier-ignore -->
```css
a { color: rgba(12, 122, 231, 0.2) }
```

<!-- prettier-ignore -->
```css
a { color: hsla(270, 60%, 50%, 15%) }
```

<!-- prettier-ignore -->
```css
a { color: hsl(.75turn, 60%, 70%) }
```

## Optional secondary options

### `ignore`

```json
{ "ignore": ["array", "of", "options"] }
```

#### `"with-var-inside"`

Ignore color functions containing variables.

Given:

```json
{
  "color-function-notation": ["modern", { "ignore": ["with-var-inside"] }]
}
```

The following patterns are _not_ considered problems:

```css
a {
  color: rgba(var(--foo), 0.5);
}
```

Given:

```json
{
  "color-function-notation": ["legacy", { "ignore": ["with-var-inside"] }]
}
```

The following patterns are _not_ considered problems:

```css
a {
  color: rgba(var(--foo) / 0.5);
}
```
