# selector-max-combinators

Limit the number of combinators in a selector.

<!-- prettier-ignore -->
```css
  a > b + c ~ d e { color: pink; }
/** ↑   ↑   ↑  ↑
 * These are combinators */
```

Each selector in a [selector list](https://www.w3.org/TR/selectors4/#selector-list) is evaluated separately.

> [!NOTE]
> In versions prior to `17.0.0`, this rule would evaluate functional pseudo-classes separately, such as `:not()` and `:is()`, and resolve nested selectors (in a nonstandard way) before counting.

## Options

### `number`

Specify a maximum combinators selectors allowed.

Given:

```json
{
  "selector-max-combinators": 2
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a b ~ c + d {}
```

<!-- prettier-ignore -->
```css
a b ~ c + d > e {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {}
```

<!-- prettier-ignore -->
```css
a b {}
```

<!-- prettier-ignore -->
```css
a b ~ c {}
```
