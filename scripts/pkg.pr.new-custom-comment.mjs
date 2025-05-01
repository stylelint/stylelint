import LZString from 'lz-string';

/**
 * Used in `/.github/workflows/pkg.pr.new.yml`
 */
export async function postCustomComment({ github, context, output }) {
	// eslint-disable-next-line no-console -- For debugging on github actions.
	console.log('pkg-pr-new publish output:', JSON.stringify(output));

	const sha = output.sha;

	const pullRequestNumber = getPullRequestNumber();

	const packages = output.packages.map((p) => {
		let normalizedUrl = p.url;

		if (pullRequestNumber && p.url.endsWith(sha)) {
			normalizedUrl = `${p.url.slice(0, -sha.length)}${pullRequestNumber}`;
		}

		const repoPath = `/${context.repo.owner}/${context.repo.repo}/`;

		normalizedUrl = normalizedUrl.replace(repoPath, '/');

		return {
			name: p.name,
			url: normalizedUrl,
		};
	});

	const botCommentIdentifier = '<!-- posted by pkg.pr.new-custom-comment.mjs -->';

	const onlineUrl = new URL('https://stylelint.io/demo/');
	const deps = {
		stylelint: 'latest',
		'stylelint-config-standard': 'latest',
	};

	for (const p of packages) {
		deps[p.name] = p.url;
	}

	onlineUrl.hash = compress({ deps: JSON.stringify(deps, null, 2) });
	const body = `${botCommentIdentifier}
This PR is packaged and the instant preview is available (${sha}). [View the demo website](${onlineUrl}).

Install it locally:

\`\`\`shell
npm i -D ${packages.map((p) => p.url).join(' ')}
\`\`\`
`;

	if (pullRequestNumber) {
		await createOrUpdateComment(pullRequestNumber);
	} else {
		/* eslint-disable no-console -- For debugging on github actions. */
		console.log(
			'No open pull request found for this push. Logging publish information to console:',
		);
		console.log(`\n${'='.repeat(50)}`);
		console.log(body);
		console.log(`\n${'='.repeat(50)}`);
		/* eslint-enable no-console -- For debugging on github actions. */
	}

	function getPullRequestNumber() {
		return output.number;
	}

	async function findBotComment(issueNumber) {
		const comments = await github.rest.issues.listComments({
			owner: context.repo.owner,
			repo: context.repo.repo,
			issue_number: issueNumber,
		});

		return comments.data.find((comment) => comment.body.includes(botCommentIdentifier));
	}

	async function createOrUpdateComment(issueNumber) {
		const existingComment = await findBotComment(issueNumber);

		if (existingComment) {
			await github.rest.issues.updateComment({
				owner: context.repo.owner,
				repo: context.repo.repo,
				comment_id: existingComment.id,
				body,
			});
		} else {
			await github.rest.issues.createComment({
				issue_number: issueNumber,
				owner: context.repo.owner,
				repo: context.repo.repo,
				body,
			});
		}
	}
}

function compress(data) {
	try {
		return LZString.compressToEncodedURIComponent(JSON.stringify(data));
	} catch {
		// return silently
		return '';
	}
}
