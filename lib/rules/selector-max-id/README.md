# selector-max-id

Limit the number of ID selectors in a selector.

<!-- prettier-ignore -->
```css
    #foo {}
/** ↑
 * This type of selector */
```

This rule resolves nested selectors before counting the number of ID selectors. Each selector in a [selector list](https://www.w3.org/TR/selectors4/#selector-list) is evaluated separately.

The `:not()` pseudo-class is also evaluated separately. The rule processes the argument as if it were an independent selector, and the result does not count toward the total for the entire selector.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

### `number`

Specify a maximum universal selectors allowed.

Given:

```json
{
  "selector-max-id": 2
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
#foo #bar #baz {}
```

<!-- prettier-ignore -->
```css
#foo #bar {
  & #baz {}
}
```

<!-- prettier-ignore -->
```css
#foo #bar {
  & > #bar {}
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
#foo {}
```

<!-- prettier-ignore -->
```css
#foo #bar {}
```

<!-- prettier-ignore -->
```css
.foo #foo {}
```

<!-- prettier-ignore -->
```css
#foo.foo #bar {}
```

<!-- prettier-ignore -->
```css
/* each selector in a selector list is evaluated separately */
#foo,
#baz #quux {}
```

<!-- prettier-ignore -->
```css
/* `#bar` is inside `:not()`, so it is evaluated separately */
#foo #bar:not(#baz) {}
```

## Optional secondary options

### `checkContextFunctionalPseudoClasses`

```json
{
  "checkContextFunctionalPseudoClasses": [
    "array",
    "of",
    "pseudo-classes",
    "/regex/"
  ]
}
```

Check selectors inside of the specified custom [functional pseudo-classes](https://drafts.csswg.org/selectors-4/#pseudo-classes) that provide [evaluation contexts](https://drafts.csswg.org/selectors-4/#specificity-rules).

This option has a higher precedence than `ignoreContextFunctionalPseudoClasses`.

Given:

```json
{
  "selector-max-id": [2, { "checkContextFunctionalPseudoClasses": [":--foo"] }]
}
```

The following pattern is considered a problem:

<!-- prettier-ignore -->
```css
:--foo(#foo #bar #baz) {}
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
:--foo() {}
```

### `ignoreContextFunctionalPseudoClasses`

```json
{
  "ignoreContextFunctionalPseudoClasses": [
    "array",
    "of",
    "pseudo-classes",
    "/regex/"
  ]
}
```

Ignore selectors inside of the specified [functional pseudo-classes](https://drafts.csswg.org/selectors-4/#pseudo-classes) that provide [evaluation contexts](https://drafts.csswg.org/selectors-4/#specificity-rules).

Given:

```json
{
  "selector-max-id": [
    0,
    { "ignoreContextFunctionalPseudoClasses": [":not", "/^:(h|H)as$/"] }
  ]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a:is(#foo) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a:not(#foo) {}
```

<!-- prettier-ignore -->
```css
a:has(#foo) {}
```
