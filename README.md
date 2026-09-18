# Nuvecto · planer-nauki

A bilingual programming-learning MVP: visual explanations, editable JavaScript, helpful feedback, checkpoints, and a personal learning path.

**Deployment target:** [English](https://drozdzyk667.github.io/planer-nauki/en/) · [Polski](https://drozdzyk667.github.io/planer-nauki/pl/). These URLs become available after GitHub Pages activation and the first successful deployment.

![Nuvecto knowledge core](public/assets/knowledge-core.webp)

## What works

- Complete English and Polish UI, lesson content, questions, hints, feedback, and accessibility labels.
- Six playable JavaScript lessons across four free modules: Introduction, Variables & Types, Operators, and Conditions.
- Six original interactive explanations with play, pause, step, and reset controls.
- Real JavaScript execution in an isolated worker, including console output, exercise checks, errors, and an execution timeout.
- Module checkpoints, mistake review, XP, levels, learning streaks, achievements, and a mastery map.
- Versioned local progress, theme, and language persistence; dark, light, and system themes.
- Responsive layouts, keyboard navigation, reduced motion, and accessible dialogs.

The remaining 16 JavaScript modules and six additional courses are clearly marked as planned. Premium opens an informational dialog. There are no payments or user accounts. Progress belongs to the current browser and does not sync between devices.

## Develop

Use Node.js 24 or later.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000/planer-nauki/en/` or `/planer-nauki/pl/`.

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

`npm run build` statically exports the site into `out/`. The preview server serves that export at the same repository prefix as GitHub Pages. For browser tests, build first:

```bash
npx playwright install --with-deps chromium
npm run test:e2e
```

If Chromium is already installed, the optional `CHROME_EXECUTABLE_PATH` variable can point to it. CI uses Playwright's own Chromium installation.

## GitHub Pages

The workflow in [`.github/workflows/pages.yml`](.github/workflows/pages.yml) checks lint, types, domain tests, the static build, and browser tests before deploying changes to `main`. Pull requests run the same checks without deploying.

The repository's **Settings → Pages → Build and deployment → Source** must be **GitHub Actions**. After initial activation, deployments run automatically on pushes to `main`. A manual run is also available under Actions → Verify and deploy GitHub Pages.

`basePath` defaults to `/planer-nauki`, and trailing-slash routes make direct links and reloads work on Pages. When moving to another domain or repository, update `NEXT_PUBLIC_BASE_PATH`, metadata URLs, and the test/preview prefix together.

GitHub Pages cannot execute a Next.js server. This project therefore uses replaceable course and progress repositories instead of pretending that server POST endpoints exist. See [architecture](docs/ARCHITECTURE.md).

## Extend the curriculum

1. Add bilingual course/module/lesson data in `src/content/curriculum.ts` using the domain schemas.
2. Give each lesson an explanation, a prediction, an exercise with checks, and a recall question.
3. Link the lesson IDs from its module. Course data is validated by `src/services/courses.ts`.
4. Add a renderer only when introducing a new lesson block or question interaction; do not add course-specific branches to generic components.
5. Run the checks above and review both languages and themes.

## Documentation

- [Implementation report and release boundaries](docs/IMPLEMENTATION.md)
- [Architecture and hosting choices](docs/ARCHITECTURE.md)
- [Original visual assets](docs/ASSETS.md)
- [Working brand exploration](docs/BRAND.md)

## Po polsku

Nuvecto to działająca pierwsza wersja platformy do nauki programowania. Obejmuje sześć lekcji JavaScript, interaktywne wyjaśnienia, edytor kodu, quizy, powtórki i zapis postępów w przeglądarce. Język oraz motyw możesz zmienić w nagłówku. Materiały premium i kolejne kursy są zaplanowane; płatności oraz konta użytkowników nie są jeszcze dostępne.
