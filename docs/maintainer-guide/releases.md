# Performing releases

1. Create a [new issue](https://github.com/stylelint/stylelint/issues/new?title=Release+%7Bversion%7D&labels=status%3A+needs+discussion) to announce the planned release:
   - include the [template checklist](#new-release-issue-template)
   - if applicable, list any new rules so that we can discuss including them in our configs
2. If necessary, open a pull request to mark those rules in [`docs/user-guide/rules.md`](../user-guide/rules.md).
3. If necessary, test `main` locally in the:
   1. [`stylelint/stylelint-config-recommended`](https://github.com/stylelint/stylelint-config-recommended)
   2. [`stylelint/stylelint-config-standard`](https://github.com/stylelint/stylelint-config-standard)
   3. [`stylelint/stylelint.io`](https://github.com/stylelint/stylelint.io)
4. Release Stylelint:
   1. If necessary, reorder the changelog entries in the "Prepare x.y.z" pull request so that the widest-reaching changes come first.
   2. Merge the "Prepare x.y.z" pull request.
   3. Open a terminal window in the `stylelint` repository.
   4. Run `npm run release`.
   5. Select the version from the [`np`](https://github.com/sindresorhus/np) prompt that matches the one in the changelog.
   6. Confirm the publishing of the package to [www.npmjs.com/package/stylelint](https://www.npmjs.com/package/stylelint).
   7. Confirm the creation of the release at [github.com/stylelint/stylelint/releases](https://github.com/stylelint/stylelint/releases).
5. If necessary, release `stylelint-config-*`:
   1. Change to the `stylelint-config-*` repository.
   2. Repeat steps 5 to 8 above for that repository.
6. Update the website:
   1. Change to the `stylelint.io` repository.
   2. Run `npm install https://github.com/stylelint/stylelint/tarball/${new_version} --save-dev` (replacing `${new_version}` with the version number e.g. `14.13.2`).
   3. Run `npm test`.
   4. Commit these changes.
   5. Push these changes.
   6. Confirm the deployment of the update to [stylelint.io](https://stylelint.io).
7. Check that [stylelint.io/demo](https://stylelint.io/demo) installs the latest Stylelint and config versions.
8. Compose a tweet that:
   - announces the release
   - communicates what has changed
   - links to the appropriate heading in the changelog on [stylelint.io](https://stylelint.io)

## New release issue template

```markdown
- [ ] stylelint release
- [ ] stylelint-config-recommended update/release
- [ ] stylelint-config-standard update/release
- [ ] stylelint.io update
- [ ] stylelint-demo check
- [ ] tweet
```
