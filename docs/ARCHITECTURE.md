# Nuvecto architecture

The initial repository contained only its README. No existing application or configuration was replaced.

## Hosting decision

Next.js App Router + React + TypeScript, statically exported for GitHub Pages at `/planer-nauki`. Explicit `en` and `pl` routes are generated at build time, with trailing slashes so deep links and reloads work. A Pages workflow builds and deploys the site. GitHub Pages is static hosting: runtime Route Handlers, POST endpoints, authentication and server-side billing are deliberately absent. Static course repositories and a local progress service implement replaceable interfaces. A future server deployment can substitute HTTP repositories without rewriting lesson UI.

## Boundaries

- `src/domain`: Zod schemas, semantic types, scoring, access rules and review scheduling.
- `src/content`: bilingual course data and lesson blocks, separate from components.
- `src/services`: validated content repository, browser persistence, preference store and learning service.
- `src/features`: course catalogue/path, lesson runner, checkpoint, dashboard and review.
- `src/components`: accessible UI, navigation, original visual explanations and motion.
- `src/app`: statically generated locale-aware routes and metadata.
- `public/assets`: original generated artwork and sandbox runtime; precise teaching visuals live in `src/components`.
- `tests`: domain tests, full browser learning flows, responsive and accessibility checks.

Code exercises run in an opaque-origin sandboxed iframe that starts a short-lived Web Worker. Learner code has no access to the application DOM or localStorage; network connections are denied by the sandbox document CSP and execution times out. Tests live in content. Client-side tests, entitlement locks and progress are educational MVP features, not trusted billing or certification controls.

Progress updates are centralized, schema validated and versioned. Lesson XP is awarded once, checkpoint XP only increases with a better score, and review rewards are limited per concept/day. Native local calendar dates track learning days. Review is an explicit heuristic with 1/3/7/14 day intervals, with a shorter interval after mistakes.

## Design

Semantic light/dark tokens, locally hosted fonts, reusable motion durations, reduced-motion support, original knowledge-core artwork and precise interactive code-native teaching diagrams. English and Polish cover navigation, lessons, questions, hints, errors, feedback, dialogs, empty states and accessibility labels. Code keywords and language names remain unchanged.

## References checked

- https://nextjs.org/docs/app/guides/static-exports
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

Installed dependency versions and the lockfile record the registry versions resolved during implementation.
