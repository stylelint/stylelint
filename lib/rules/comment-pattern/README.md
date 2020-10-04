# custom-property-pattern

Specify a pattern for comments.

<!-- prettier-ignore -->
```css
                  /*comment*/
                 /* ↑ */ a { --foo-: 1px; }
/**                 ↑
 * The pattern of this */
```

## Options

`regex`

The pattern to match the comments with.

Given the regex:

```js
/foo .+/
```

The following patterns are considered violations:

<!-- prettier-ignore -->
```css
/*not starting with foo*/
a { color: red; }
```

The following patterns are _not_ considered violations:

<!-- prettier-ignore -->
```css
/*foo at the beginning*/
a { color: red; }
```
