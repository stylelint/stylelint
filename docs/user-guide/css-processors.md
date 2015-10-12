# CSS processors

The linter supports current and future CSS syntax. This includes all standard CSS but also special features that use standard CSS syntactic structures, e.g. special at-rules, special properties, and special functions. Some CSS-*like* language extensions -- features that use non-standard syntactic structures -- are, as such, supported; however, since there are infinite processing possibilities, the linter cannot support everything.

You can run the linter before or after your css processors. Depending on which processors you use, each approach has caveats:

1. *Before*: Some plugins might enable a syntax that isn't compatible with the linter.
2. *After*: Some plugins might generate CSS that is invalid against your linter config, causing warnings that do not correspond to your original stylesheets.

*In both cases you can either turn off the incompatible linter rule, or stop using the incompatible plugin.* You could also approach plugin authors and request alternate formatting options that will make their plugin compatible with stylelint.
