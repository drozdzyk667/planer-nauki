# Implementation report

## Product delivered

Nuvecto is a working English/Polish programming-learning MVP built from the repository's original README-only state. It includes a landing page, course catalogue, JavaScript roadmap, lesson runner, checkpoints, results, dashboard, review queue, and premium information dialog.

The JavaScript roadmap contains 20 modules. Four free modules contain six playable micro-lessons: first program, variables, constants, data types, operators, and conditions. The other 16 modules and TypeScript, React, Next.js, Python, SQL, and AI courses are explicitly planned.

## Architecture and repository structure

Next.js App Router statically exports both language routes for GitHub Pages. React/TypeScript components consume a validated `CourseRepository`; content does not leak directly into page components. A versioned local progress service owns mutations and persistence. Domain rules own scores, XP, completion, access, and review scheduling.

| Directory           | Responsibility                                                 |
| ------------------- | -------------------------------------------------------------- |
| `src/app`           | Static routes, metadata, application shell styles, error pages |
| `src/domain`        | Zod schemas, types, pure learning rules                        |
| `src/content`       | English/Polish curriculum and exercise checks                  |
| `src/services`      | Course repository, local progress, user preferences            |
| `src/features`      | Catalogue/path, learning/checkpoints, dashboard/review         |
| `src/components`    | Navigation, dialogs, shared controls, teaching visuals         |
| `public/assets`     | Generated artwork and isolated exercise runtime                |
| `tests`             | Domain/persistence tests and browser acceptance suite          |
| `.github/workflows` | Verification and Pages deployment                              |

GitHub Pages is static hosting. The initial mock server endpoints in the product brief were adapted to repository interfaces; there is no running backend or fake successful network persistence. A future server can implement those interfaces for accounts, synchronized progress, and entitlements. Details are in [ARCHITECTURE.md](ARCHITECTURE.md).

## Dependencies

| Dependency                               | Reason                                                      |
| ---------------------------------------- | ----------------------------------------------------------- |
| Next.js 16 / React 19 / TypeScript 6     | Typed components, file routing, static HTML generation      |
| Zod 4                                    | Validate course data, progress, and runtime messages        |
| Motion 13                                | Small UI transitions and controlled concept animation       |
| CodeMirror 6 via `@uiw/react-codemirror` | Lazy-loaded accessible JavaScript editor                    |
| Lucide React                             | Consistent interface icons                                  |
| Fontsource                               | Locally hosted DM Sans and JetBrains Mono                   |
| Vitest / Playwright / axe-core           | Domain rules, browser flows, automated accessibility checks |

Custom semantic CSS avoids a second component/style framework. There is no global state library, separate API server, payment SDK, or media service. ESLint is pinned to major 9 because the installed Next.js React lint plugin is incompatible with ESLint 10's removed context API. The lockfile records exact resolved versions.

## Current learning flow

Landing → catalogue/JavaScript path → Variables & Types → variables, constants, and types lessons. Each lesson uses **Understand → Predict → Code → Recall**, then awards 80 XP on first completion. Code runs in a sandboxed opaque-origin iframe and short-lived Web Worker. The runtime exposes a bounded console, denies network access by CSP, and terminates long-running execution. Learners can use a hint, reset, retry, and move back while preserving their current code within the lesson.

Completing the three lessons opens the six-question checkpoint. Results show accuracy, mistakes, and up to 100 additional XP. A better retry only awards the improvement; replaying the same lesson does not award duplicate XP. The dashboard reflects progress immediately and after reload. Mistakes and scheduled concepts appear in review, with bounded daily review rewards. Premium modules remain locked and open an honest informational dialog.

## Themes, accessibility, and motion

Semantic tokens cover backgrounds, text, borders, focus, success, errors, and accents in dark/light themes. System mode responds to operating-system changes. A small early theme script reduces the wrong-theme flash. Preferences and language are retained locally; the language switch preserves the current route.

The UI uses semantic headings, native links/buttons/radios, fieldsets, visible focus, a skip link, feedback text/icons, progress labels, and native modal dialogs with focus containment, Escape dismissal, and focus restoration. The code editor's editable surface has a localized label, accessible colors, and Tab exits normally. Error, empty, loading, unavailable-content, and storage-failure states are visible.

Motion uses short entry, hover, progress, and reward transitions. Teaching diagrams are learner controlled. `prefers-reduced-motion` removes decorative movement and keeps content visible, with manual diagram stepping still available. Generated artwork plus real-text diagrams fulfill the original visuals requirement; no generated video is claimed. See [ASSETS.md](ASSETS.md).

## Verification

Local release verification on 2026-09-18:

- `npm run lint`: passed.
- `npm run typecheck`: passed; the production build also completed its TypeScript check.
- `npm test`: 18 tests passed across domain and persistence suites.
- `npm run build`: passed; 33 static pages generated, with a 4.2 MB export on disk.
- `npm run test:e2e`: all 14 Chromium tests passed in the final run.
- Responsive checks covered 375, 430, 768, 1024, and 1440 px across six routes with no horizontal overflow.
- axe checks found no violations of the selected WCAG A/AA rules on the six main screens in both themes, question feedback and editor/results in both themes, checkpoint results, and the premium dialog. Automated checks do not establish complete WCAG conformance.
- Keyboard checks covered the skip link, reduced-motion stepping, modal focus containment, Escape, and focus restoration. Screenshots were visually reviewed for desktop/mobile landing, light theme, Polish roadmap/dashboard, and the code editor.
- The full Variables & Types flow earned 340 XP, retained progress after reload, and awarded zero duplicate lesson XP. All other free lessons, Polish wrong-answer feedback/review, theme and language persistence, infinite-loop timeout, DOM isolation, code recovery, back-step code retention, malformed storage, and locked checkpoints passed.

The local Playwright browser download was unavailable in this environment. The same repository tests ran against locally extracted Chromium 153 using `CHROME_EXECUTABLE_PATH`; CI installs Playwright Chromium normally. No Lighthouse score or measured field Core Web Vitals is claimed. Performance measures implemented include static HTML, locally served fonts, compressed responsive WebP art, and a lazy-loaded code editor.

Release fixes included tablet artwork overflow, reduced-motion content visibility, modal focus containment, syntax color contrast, a screen-reader label on the actual editor surface, saved code when stepping back, and cleanup when restarting an in-flight exercise.

## Ready for use, mocked, and next

**Publication:** this repository is now authorized for the GitHub connection. The checked-in workflow verifies and deploys the static site through GitHub Actions. Its run history is the source of truth for deployment status.

**Ready for a public static MVP:** bilingual navigation and curriculum, all six free lessons, code execution/checks, module checkpoints, local progress/XP/reviews, themes, responsive layouts, and static export. CI verifies changes before Pages deployment once Pages is enabled.

**Planned or limited:** additional courses, 16 premium modules, account creation, cloud sync, real entitlements, payments, and adaptive content authoring. Premium is informational. Review scheduling is a transparent heuristic, not a scientifically calibrated mastery measurement. Checkpoints currently reuse lesson questions. Current question renderers handle single choice, output prediction, and true/false; other question types are only extension points.

Local progress can be cleared by browser data deletion or edited by a user. In-progress editor text survives back/forward lesson steps but is not saved across a full reload. Client-side tests and locks are not certification or billing controls. The worker is suitable for these local beginner exercises; a paid assessment platform needs an independently hardened execution service. No full manual screen-reader audit, cross-browser certification, field performance study, trademark clearance, or security audit is claimed.

**Recommended next implementation:** separate checkpoint question banks; author and review the Functions module in both languages; move progress and entitlements to an authenticated server when needed; add Firefox/WebKit and assistive-technology testing; measure live Core Web Vitals before increasing animation or media weight. Choose a commercial name after proper clearance.
