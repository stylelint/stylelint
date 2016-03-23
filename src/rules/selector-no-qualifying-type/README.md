# stylelint-selector-no-qualifying-type

[![Build Status](https://travis-ci.org/timothyneiljohnson/stylelint-selector-no-qualifying-type.svg)](https://travis-ci.org/timothyneiljohnson/stylelint-selector-no-qualifying-type)

A [stylelint](https://github.com/stylelint/stylelint) custom rule to disallow combinations of qualifying elements with id, class or attribute selectors.

This rule will cause stylelint to warn you whenever a disallowed combination is used.

## Details

There is an ignore option (`attribute` / `class` / `id`):

Default without `ignore` option.
```css
input { /* OK */
  margin: 0
}

input[type='button'] { /* Not OK */
  margin: 0
}
```
```css
.class { /* OK */
  margin: 0
}

div.class { /* Not OK */
  margin: 0
}
```
```css
#id { /* OK */
  margin: 0
}

div#id { /* Not OK */
  margin: 0
}
```

With ignore set to `'attribute'`:
```css
input[type='button'] { /* OK */
  margin: 0
}
```
With ignore set to `'class'`:
```css
div.class { /* OK */
  margin: 0
}
```
With ignore set to `'id'`:
```css
div#id { /* OK */
  margin: 0
}
```

## Usage

Add `selector-no-qualifying-type` to your rules, with your desired options.

Example:

```js
{
  "plugins": [
    "stylelint-selector-no-qualifying-type"
  ],
  "rules": {
    "selector-no-qualifying-type": {
      "ignore": "attribute" // Optional. Other values: "class", "id".
    }
  }
};
```
