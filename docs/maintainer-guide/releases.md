# Performing releases

1. Create a [new issue](https://github.com/stylelint/stylelint/issues/new?title=Release+%7Bversion%7D&labels=status%3A+needs+discussion) to announce the planned release:
   - include the [template checklist](#new-release-issue-template)
2. If necessary, test `main` locally in the:
   1. [`stylelint/stylelint-config-recommended`](https://github.com/stylelint/stylelint-config-recommended)
   2. [`stylelint/stylelint-config-standard`](https://github.com/stylelint/stylelint-config-standard)
   3. [`stylelint/stylelint-demo`](https://github.com/stylelint/stylelint-demo)
   4. [`stylelint/stylelint.io`](https://github.com/stylelint/stylelint.io)
3. Release Stylelint:
   1. If necessary, reorder the changelog entries in the "Prepare release" pull request so that the widest-reaching changes come first
   2. Merge the "Prepare release" pull request.
   3. Open a terminal window in the `stylelint` repository.
   4. Run `npm run release`.
   5. Select the version from the [`np`](https://github.com/sindresorhus/np) prompt that matches the one in the changelog.
   6. Copy and paste the latest changelog entries from [changelog](../../CHANGELOG.md) into the GitHub release page when it opens.
   7. Confirm the publishing of the package to [www.npmjs.com/package/stylelint](https://www.npmjs.com/package/stylelint).
   8. Confirm the creation of the release at [github.com/stylelint/stylelint/releases](https://github.com/stylelint/stylelint/releases).
4. If necessary, release `stylelint-config-*`:
   1. Change to the `stylelint-config-*` repository.
   2. Repeat steps 5 to 8 above for that repository.
5. Update the online demo:
   1. Change to the `stylelint-demo` repository
   2. Run `npm install stylelint@latest --save`.
   3. Run `npm test`.
   4. Commit these changes.
   5. Push these changes.
   6. If necessary, install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli)
   7. If necessary, login using the Stylelint Heroku account: `heroku login`
   8. If necessary, set up a remote: `heroku git:remote -a stylelint-demo`
   9. Push the code: `git push heroku main`
   10. Confirm the deployment of the update to [stylelint.io/demo](https://stylelint.io/demo).
6. Update the website:
   1. Change to the `stylelint.io` repository
   2. Run `npm install https://github.com/stylelint/stylelint/tarball/${new_version} --save-dev` (replacing `${new_version}` with the version number e.g. `14.13.2`).
   3. Run `npm test`.
   4. Commit these changes.
   5. Push these changes.
   6. Confirm the deployment of the update to [stylelint.io](https://stylelint.io).
7. Compose a tweet that:
   - announces the release
   - communicates what has changed
   - links to the appropriate heading in the changelog on [stylelint.io](https://stylelint.io).

## New release issue template

```markdown
- [ ] stylelint release
- [ ] stylelint-config-recommended update/release
- [ ] stylelint-config-standard update/release
- [ ] stylelint-demo update
- [ ] stylelint.io update
- [ ] tweet
```
