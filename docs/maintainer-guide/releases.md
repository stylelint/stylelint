# Performing releases

1. Create a [new issue](https://github.com/stylelint/stylelint/issues/new?title=Release+%7Bversion%7D&labels=status%3A+needs+discussion) to announce the planned release:
   - include the [template checklist](#new-release-issue-template)
   - if applicable, list any new rules so that we can discuss including them in our configs
2. If necessary, open a pull request to mark those rules in [`docs/user-guide/rules.md`](../user-guide/rules.md).
3. Check if package tests in [stylelint/stylelint-ecosystem-tester](https://github.com/stylelint/stylelint-ecosystem-tester) fail with the new version.
4. If necessary, test the main branch locally against:
   1. [stylelint/stylelint-config-recommended](https://github.com/stylelint/stylelint-config-recommended)
   2. [stylelint/stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard)
   3. [stylelint/stylelint.io](https://github.com/stylelint/stylelint.io)
5. Release Stylelint:
   1. Ensure `CHANGELOG.md` has the correct date (UTC) for the latest release.
   2. Add a summary about what's changed including if there's a new config.
   3. If necessary, reorder the changelog entries in the "Prepare x.y.z" pull request so that the widest-reaching changes come first.
   4. Merge the "Prepare x.y.z" pull request.
   5. Merge the "Release x.y.z" pull request.
   6. Confirm the publishing of the package to [www.npmjs.com/package/stylelint](https://www.npmjs.com/package/stylelint).
   7. Confirm the creation of the release at [stylelint/stylelint/releases](https://github.com/stylelint/stylelint/releases).
6. If necessary, release `stylelint-config-*`:
   1. Change to the `stylelint-config-*` repository.
   2. Repeat steps 5 to 8 above for that repository.
7. Update the website:
   1. Go to the [releasing action page](https://github.com/stylelint/stylelint.io/actions/workflows/release-stylelint.yml) in the `stylelint.io` repository.
   2. Click **Run workflow**.
   3. Check and merge a pull request created by the action.
   4. Confirm the deployment of the update to [stylelint.io](https://stylelint.io).
8. Check that [stylelint.io/demo](https://stylelint.io/demo) installs the latest Stylelint and config versions.

## New release issue template

```markdown
- [ ] stylelint-ecosystem-tester check
- [ ] stylelint release
- [ ] stylelint-config-recommended update/release
- [ ] stylelint-config-standard update/release
- [ ] stylelint.io update
- [ ] stylelint-demo check
```
