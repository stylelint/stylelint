# selector-combinator-allowed-list

Specify a list of allowed combinators.

<!-- prettier-ignore -->
```css
  a + b {}
/** ↑
 * This combinator */
```

This rule normalizes the whitespace descendant combinator to be a single space.

This rule ignores [reference combinators](https://www.w3.org/TR/selectors4/#idref-combinators) e.g. `/for/`.

## Options

### `Array<string>`

```json
["array", "of", "combinators"]
```

Given:

```json
{
  "selector-combinator-allowed-list": [">", " "]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a + b {}
```

<!-- prettier-ignore -->
```css
a ~ b {}
```

The following patterns are _not_ considered problems:

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
