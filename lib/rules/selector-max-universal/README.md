# selector-max-universal

Limit the number of universal selectors in a selector.

<!-- prettier-ignore -->
```css
    * {}
/** ↑
 * This universal selector */
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
  "selector-max-universal": 2
}
```

The following pattern is considered a problem:

<!-- prettier-ignore -->
```css
* * * {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
* {}
```

<!-- prettier-ignore -->
```css
* * {}
```

<!-- prettier-ignore -->
```css
.foo * {}
```

<!-- prettier-ignore -->
```css
*.foo * {}
```

## Optional secondary options

### `ignoreAfterCombinators`

```json
{ "ignoreAfterCombinators": ["array", "of", "combinators"] }
```

Ignore universal selectors that come after one of the specified combinators.

Given:

```json
{
  "selector-max-universal": [2, { "ignoreAfterCombinators": [">", "+"] }]
}
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
* * > * {}
```
