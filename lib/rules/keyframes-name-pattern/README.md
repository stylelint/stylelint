# keyframes-name-pattern

Specify a pattern for keyframe names.

<!-- prettier-ignore -->
```css
@keyframes slide-right {}
/**             ↑
 * The pattern of this */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

A string will be translated into a RegExp like so `new RegExp(yourString)` — so be sure to escape properly.

If configuring this rule in JavaScript, you can use a regular expression directly, such as `/yourPattern/`.

Given the string:

```json
{
  "keyframes-name-pattern": "foo-.+"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@keyframes foo {}
```

<!-- prettier-ignore -->
```css
@keyframes bar {}
```

<!-- prettier-ignore -->
```css
@keyframes FOO-bar {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@keyframes foo-bar {}
```
