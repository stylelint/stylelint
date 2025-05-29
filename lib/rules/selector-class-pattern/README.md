# selector-class-pattern

Specify a pattern for class selectors.

<!-- prettier-ignore -->
```css
    .foo, #bar.baz span, #hoo[disabled] { color: pink; }
/** ↑         ↑
 * These class selectors */
```

This rule ignores non-outputting Less mixin definitions and called Less mixins.

Escaped selectors (e.g. `.u-size-11\/12\@sm`) are parsed as escaped twice (e.g. `.u-size-11\\/12\\@sm`). Your RegExp should account for that.

## Options

### `string`

Specify a regex string not surrounded with `"/"`.

The selector value _after `.`_ will be checked. No need to include `.` in your pattern.

Given:

```json
{
  "selector-class-pattern": "foo-[a-z]+"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
.foop {}
```

<!-- prettier-ignore -->
```css
.foo-BAR {}
```

<!-- prettier-ignore -->
```css
div > #zing + .foo-BAR {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
.foo-bar {}
```

<!-- prettier-ignore -->
```css
div > #zing + .foo-bar {}
```

<!-- prettier-ignore -->
```css
#foop {}
```

<!-- prettier-ignore -->
```css
[foo='bar'] {}
```

## Optional secondary options

### `resolveNestedSelectors`

This option will resolve nested selectors with `&` interpolation. Defaults to `false`.

Given the string:

```json
{
  "selector-class-pattern": ["^[A-Z]+$", { "resolveNestedSelectors": true }]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
.A {
  &__B {} /* resolved to ".A__B" */
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
.A {
  &B {} /* resolved to ".AB" */
}
```
