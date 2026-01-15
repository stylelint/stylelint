# selector-max-id

Limit the number of ID selectors in a selector.

<!-- prettier-ignore -->
```css
    #foo {}
/** ↑
 * This type of selector */
```

Each selector in a [selector list](https://drafts.csswg.org/selectors-4/#grouping) is evaluated separately.

> [!NOTE]
> In versions prior to `17.0.0`, this rule would evaluate functional pseudo-classes separately, such as `:not()` and `:is()`, and resolve nested selectors (in a nonstandard way) before counting.

## Options

### `number`

Specify a maximum universal selectors allowed.

Given:

```json
{
  "selector-max-id": 2
}
```

The following pattern is considered a problem:

<!-- prettier-ignore -->
```css
#foo #bar #baz {}
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

## Optional secondary options

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

Ignore selectors inside of the specified [functional pseudo-classes](https://drafts.csswg.org/selectors-4/#pseudo-classes).

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
