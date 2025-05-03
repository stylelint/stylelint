# color-named

Require (where possible) or disallow named colors.

<!-- prettier-ignore -->
```css
a { color: black }
/**        ↑
 * This named color */
```

This rule ignores `$sass` and `@less` variable syntaxes.

## Options

### `"always-where-possible"`

Colors _must always_, where possible, be named.

```json
{
  "color-named": "always-where-possible"
}
```

This will complain if a hex (3, 4, 6 and 8 digit), `rgb()`, `rgba()`, `hsl()`, `hsla()`, `hwb()` or `gray()` color can be represented as a named color.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: #000; }
```

<!-- prettier-ignore -->
```css
a { color: #f000; }
```

<!-- prettier-ignore -->
```css
a { color: #ff000000; }
```

<!-- prettier-ignore -->
```css
a { color: rgb(0, 0, 0); }
```

<!-- prettier-ignore -->
```css
a { color: rgb(0%, 0%, 0%); }
```

<!-- prettier-ignore -->
```css
a { color: rgba(0, 0, 0, 0); }
```

<!-- prettier-ignore -->
```css
a { color: hsl(0, 0%, 0%); }
```

<!-- prettier-ignore -->
```css
a { color: hwb(0, 0%, 100%); }
```

<!-- prettier-ignore -->
```css
a { color: gray(0); }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: black; }
```

<!-- prettier-ignore -->
```css
a { color: rgb(10, 0, 0); }
```

<!-- prettier-ignore -->
```css
a { color: rgb(0, 0, 0, 0.5); }
```

### `"never"`

Colors _must never_ be named.

```json
{
  "color-named": "never"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: black; }
```

<!-- prettier-ignore -->
```css
a { color: white; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: #000; }
```

<!-- prettier-ignore -->
```css
a { color: rgb(0, 0, 0); }
```

<!-- prettier-ignore -->
```css
a { color: var(--white); }
```

## Optional secondary options

### `ignore`

```json
{ "ignore": ["array", "of", "options"] }
```

#### `"inside-function"`

Ignore colors that are inside a function.

Given:

```json
{
  "color-named": ["never", { "ignore": ["inside-function"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  color: map-get($color, blue);
}
```

<!-- prettier-ignore -->
```css
a {
  background-image: url(red);
}
```

### `ignoreProperties`

```json
{ "ignoreProperties": ["array", "of", "properties", "/regex/"] }
```

Given:

```json
{
  "color-named": ["never", { "ignoreProperties": ["/^my-/", "composes"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  my-property: red;
}
```

<!-- prettier-ignore -->
```css
a {
  my-other-property: red;
}
```

<!-- prettier-ignore -->
```css
a {
  composes: red from './index.css';
}
```
