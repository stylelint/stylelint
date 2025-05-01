# selector-id-pattern

Specify a pattern for ID selectors.

<!-- prettier-ignore -->
```css
.foo, #bar.baz a, #hoo[disabled] { color: pink; }
/**   ↑           ↑
 * These ID selectors */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

A string will be translated into a regular expression like `new RegExp(yourString)`, so make sure to escape it properly. Alternatively, a regular expression literal in JavaScript is available, such as `/yourPattern/`.

The selector value _after `#`_ will be checked. No need to include `#` in your pattern.

Given the string:

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
