# Profile maintenance

Edit the root README for career updates. Keep the visual personality: Aryan explicitly prefers the snake animation, colorful header/buttons and badges over a purely text profile. The resume is a public copy without a phone number; regenerate it from the maintained career-context source when experience changes.

`node scripts/update-contributions.mjs` fetches Aryanjstar's aggregate calendar through the authenticated GitHub CLI. The scheduled action uses the repository's built-in token; no personal access token or hosted stats service is needed for the contribution visuals. For an offline check, pass `--input path/to/graphql-response.json`.

The script validates the response before rendering light/dark assets:

- **Grid:** diagonal stagger, retaining GitHub's exact contribution intensity levels.
- **Skyline:** one prism per day; square-root height scaling stops a single large day from flattening the rest. Total is GitHub's reported total, not an invented sum or commit count.
- **Header:** a decorative voice waveform, separate from the contribution data.
- **Snake:** generated with the official `Platane/snk/svg-only` action, pinned to a commit.

Only aggregate dates/counts/levels and the reported total are stored. Existing assets survive a failed data request. SVGs use CSS animations, with completed static states for reduced-motion settings. The README's snake picture selects the static calendar for reduced-motion visitors. Images do not claim to support interactive canvas hover or replay controls inside GitHub.

The daily workflow at 03:23 UTC refreshes all contribution assets. Shields.io serves the small contact and technology badges; the substantive text and project links remain readable if a badge service is unavailable.

Inspiration: the user-supplied Avi Vashishta article, “6 Ways to Put Your GitHub Graph on Your Portfolio” (25 October 2026), especially its real-data fetch, diagonal grid and square-root skyline. This SVG implementation is independently written for GitHub README rendering. [Reference demo](https://avivashishta.com/lab/commits).

References: [GitHub profile guidance](https://docs.github.com/en/account-and-profile/tutorials/using-your-github-profile-to-enhance-your-resume), [snake action](https://github.com/Platane/snk), [reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).
