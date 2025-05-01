# custom-media-pattern

Specify a pattern for custom media query names.

<!-- prettier-ignore -->
```css
@custom-media --foo (max-width: 30em);
/**             ↑
 * The pattern of this */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

A string will be translated into a RegExp like so `new RegExp(yourString)` — so be sure to escape properly.

You can also use a regular expression directly in a JavaScript config, such as `/yourPattern/`.

Given the string:

```json
{
  "custom-media-pattern": "foo-.+"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@custom-media --bar (min-width: 30em);
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@custom-media --foo-bar (min-width: 30em);
```
