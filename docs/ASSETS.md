# Original visual assets

## Knowledge core

Created with OpenAI image generation for this project on 2026-09-18. The artwork is an artistic metaphor for accumulated understanding, not an instructional diagram.

Creative direction: a translucent glass cube containing a luminous violet core, thin cyan/lavender orbital rings, sparse glass nodes, deep graphite surroundings, cinematic refractions, and no text, logos, people, or devices. Typography and interface labels are rendered separately in HTML.

Delivered assets:

| File                                      | Dimensions | Size          | Use                                    |
| ----------------------------------------- | ---------- | ------------- | -------------------------------------- |
| `public/assets/knowledge-core.webp`       | 1400 × 933 | 106,180 bytes | Desktop/tablet hero and social preview |
| `public/assets/knowledge-core-small.webp` | 700 × 467  | 29,968 bytes  | Hero on screens up to 600 px           |

The generated raster was resized and encoded as WebP. A responsive picture source selects the smaller asset. Width and height reserve layout space. The artwork is decorative, with empty alternative text; nearby HTML conveys the message in both languages.

## Teaching visuals

`src/components/visual-explainer.tsx` contains six original code-native interactive explanations:

1. Execution: code becomes console output.
2. Variables: a name points to a changing value.
3. Constants: reassignment is rejected.
4. Types: values are grouped by JavaScript type.
5. Operators: explicit number conversion and multiplication.
6. Conditions: a comparison selects a branch.

These use real text, HTML/CSS, and Motion so the instructional labels stay exact and can be translated. Playback is user initiated. Step and reset remain available with reduced motion; autoplay is disabled. The learner receives the same code and explanation without animation.

No video was generated or embedded. Animated, controllable diagrams are used for the learning material. The brand mark and favicon are original vector/CSS work. Lucide supplies interface icons; DM Sans and JetBrains Mono are bundled through Fontsource with their upstream licenses retained in the dependencies.
