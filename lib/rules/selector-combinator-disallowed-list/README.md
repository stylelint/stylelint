# selector-combinator-disallowed-list

Specify a list of disallowed combinators.

<!-- prettier-ignore -->
```css
  a + b {}
/** ↑
 * This combinator */
```

This rule normalizes the whitespace descendant combinator to be a single space.

This rule ignores [reference combinators](https://www.w3.org/TR/selectors4/#idref-combinators) e.g. `/for/`.

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the disallowed combinator.

## Options

### `Array<string>`

```json
["array", "of", "combinators"]
```

Given:

```json
{
  "selector-combinator-disallowed-list": [">", " "]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a > b {}
```

<!-- prettier-ignore -->
```css
a b {}
```

<!-- prettier-ignore -->
```css
a
b {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a + b {}
```

<!-- prettier-ignore -->
```css
a ~ b {}
```
