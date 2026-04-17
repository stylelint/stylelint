# selector-max-compound-selectors

Limit the number of compound selectors in a selector.

<!-- prettier-ignore -->
```css
   div .bar[data-val] > a.baz + .boom > #lorem {}
/* ↑   ↑                ↑       ↑       ↑
   ↑   ↑                ↑       ↑       ↑
  Lv1 Lv2              Lv3     Lv4     Lv5  -- these are compound selectors */
```

A [compound selector](https://www.w3.org/TR/selectors4/#compound) is a chain of one or more simple (tag, class, ID, universal, attribute) selectors. If there is more than one compound selector in a complete selector, they will be separated by combinators (e.g. ` `, `+`, `>`). One reason why you might want to limit the number of compound selectors is described in the [SMACSS book](http://smacss.com/book/applicability).

Each selector in a [selector list](https://drafts.csswg.org/selectors-4/#grouping) is evaluated separately.

> [!NOTE]
> In versions prior to `17.0.0`, this rule would evaluate functional pseudo-classes separately, such as `:not()` and `:is()`, and resolve nested selectors (in a nonstandard way) before counting.

## Options

### `number`

Specify a maximum compound selectors allowed.

Given:

```json
{
  "selector-max-compound-selectors": 3
}
```

The following pattern is considered a problem:

<!-- prettier-ignore -->
```css
.foo .bar .baz .lorem {}
````

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
div {}
```

<!-- prettier-ignore -->
```css
.foo div {}
```

<!-- prettier-ignore -->
```css
#foo #bar > #baz {}
```

## Optional secondary options

### `ignoreSelectors`

```json
{ "ignoreSelectors": ["array", "of", "selectors", "/regex/"] }
```

Ignore some compound selectors. This may be useful for deep selectors like Vue's `::v-deep` or Angular's `::ng-deep` that behave more like combinators than compound selectors.

Given:

```json
{
  "selector-max-compound-selectors": [
    2,
    { "ignoreSelectors": ["::v-deep", "/ignored/"] }
  ]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
.foo .bar ::v-deep .baz {}
```

<!-- prettier-ignore -->
```css
.foo .bar > .baz.ignored {}
```

<!-- prettier-ignore -->
```css
.foo .bar > .ignored.baz {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
.foo::v-deep .bar {}
```

<!-- prettier-ignore -->
```css
.foo ::v-deep .baz {}
```

<!-- prettier-ignore -->
```css
.foo .bar > .ignored.ignored {}
```

<!-- prettier-ignore -->
```css
.foo .bar > .ignored .ignored {}
```
