# Profile maintenance

Edit the root README for career updates. The resume is a public copy without a phone number; regenerate it from the maintained career-context source when experience changes.

`node scripts/update-contributions.mjs` fetches Aryanjstar's aggregate contribution calendar through the authenticated GitHub CLI. The scheduled action uses the repository's built-in token; no personal access token or third-party stats service is required. For an offline check, pass `--input path/to/graphql-response.json`.

The script saves only dates, counts, levels and the reported total. It validates the complete response before writing either theme, so API failures retain the previous graphic. Counts are GitHub contributions, not just commits, and are not evidence of code quality. The headline is GitHub's reported total; it is not artificially scaled from the daily cells. Light and dark SVGs use GitHub's reported contribution levels. The graph is a static, accessible SVG because a GitHub README cannot host the interactive canvas experience from the reference article.

Inspiration: the supplied article by Avi Vashishta, “6 Ways to Put Your GitHub Graph on Your Portfolio” (25 October 2026), suggested fetching real data ahead of time. This implementation is independently written for a profile README. [Reference demo](https://avivashishta.com/lab/commits).

Profile structure follows [GitHub's job-search guidance](https://docs.github.com/en/account-and-profile/tutorials/using-your-github-profile-to-enhance-your-resume): concise introduction, selected work, experience, skills and evidence. Existing generated snake assets remain in repository history; their old workflow is replaced by this calendar refresh.
