# color-function-notation

Specify modern or legacy notation for color-functions.

<!-- prettier-ignore -->
```css
    a { color: rgb(0 0 0 / 0.2) }
/**            ↑
 *             This notation */
```

Modern color-functions use a comma-free syntax because functions in CSS are used to group/name a syntax chunk. They should work by the same rules that CSS grammar does in general: values are optional and re-orderable when possible, space-separated, and commas are used to separate repetitions only.

For legacy reasons, `rgb()` and `hsl()` also supports an alternate syntax that separates all of its arguments with commas. Also for legacy reasons, the `rgba()` and `hsla()` functions exist using the same comma-based syntax.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix some of the problems reported by this rule when the primary option is `"modern"`.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`string`: `"modern"|"legacy"`

### `"modern"`

Applicable color-functions _must always_ use modern notation.

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

### `ignore: ["with-var-inside"]`

Ignore color functions containing variables.

Given:

```json
["modern", { "ignore": ["with-var-inside"] }]
```

The following patterns are _not_ considered problems:

```css
a {
  color: rgba(var(--foo), 0.5);
}
```

Given:

```json
["legacy", { "ignore": ["with-var-inside"] }]
```

The following patterns are _not_ considered problems:

```css
a {
  color: rgba(var(--foo) / 0.5);
}
```
