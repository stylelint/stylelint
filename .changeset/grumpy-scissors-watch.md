---
"stylelint": major
---

Change: `extends` in `overrides` to be consistent with `plugins` behaviour

`overrides.extends` is fixed to make consistency with the `overrides.plugins` behavior and be merged not replaced.

If you would like to keep the previous behavior, you would need to change your config as below:

```diff json
{
- "extends": ["config-a"]
  "overrides": [
    {
      "rules": ["*.module.css"],
      "extends": ["config-b"]
    },
+   {
+     "rules": ["*.css"],
+     "extends": ["config-a"]
+   },
  ]
}
```
