# selector-id-pattern

Specify a pattern for ID selectors.

<!-- prettier-ignore -->
```css
.foo, #bar.baz a, #hoo[disabled] { color: pink; }
/**   ↑           ↑
 * These ID selectors */
```

## Options

### `string`

Specify a regex string not surrounded with `"/"`.

The selector value _after `#`_ will be checked. No need to include `#` in your pattern.

Given:

```json
{
  "selector-id-pattern": "foo-[a-z]+"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
#foop {}
```

<!-- prettier-ignore -->
```css
#foo-BAR {}
```

<!-- prettier-ignore -->
```css
div > .zing + #foo-BAR {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
#foo-bar {}
```

<!-- prettier-ignore -->
```css
div > .zing + #foo-bar {}
```

<!-- prettier-ignore -->
```css
.foop {}
```

<!-- prettier-ignore -->
```css
[foo='bar'] {}
```
