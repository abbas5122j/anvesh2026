# Style Guide

## Design reference

Inspired by the Canva design **Architect Resume Website in Ivory Maroon Friendly
Rounded Style**. Adapt its warm, approachable portfolio aesthetic for the
Academic Early Warning System: ivory surfaces, deep maroon accents, rounded
shapes, and editorial photography. This is an original implementation guide;
do not copy Canva artwork, text, or template assets.

## Visual direction

- Warm, human, and confident rather than clinical or overly technical.
- Use an ivory canvas with dark wine-red typography and carefully placed
  terracotta accents.
- Use real, relevant photography sparingly to add personality; prioritize
  student privacy and use approved, consented, or illustrative images only.
- Keep risk and performance information calm, supportive, and easy to scan.

## Color palette

The palette below is an interpretation of the reference, not a claim of exact
sampled template values.

| Token | Value | Use |
| --- | --- | --- |
| `--color-background` | `#F7F2E7` | Main page and hero backgrounds |
| `--color-surface` | `#FFFCF6` | Cards, forms, and raised panels |
| `--color-surface-muted` | `#EFE8DA` | Secondary sections and subtle fills |
| `--color-text` | `#342824` | Primary body text |
| `--color-text-muted` | `#776B64` | Supporting text and metadata |
| `--color-maroon` | `#8D201F` | Headings, primary identity, selected states |
| `--color-maroon-deep` | `#651918` | Hover and pressed states |
| `--color-terracotta` | `#BF4C3C` | Warm secondary accent |
| `--color-line` | `#DED4C5` | Dividers, borders, input outlines |
| `--color-risk-low` | `#367A59` | Low-risk indicators |
| `--color-risk-medium` | `#A56A16` | Medium-risk indicators |
| `--color-risk-high` | `#A33A35` | High-risk indicators |

Treat these as starting tokens. Validate text and control contrast, especially
for muted text and colored risk states. Never communicate risk using color alone.

## Typography

- Choose an approachable, rounded sans-serif for interface text, paired with a
  distinctive but readable display face for large page headings if available.
- Use bold, dark-maroon headings with clear hierarchy and generous line height.
- Keep body copy readable and direct; avoid overly decorative fonts for data,
  forms, charts, or long explanations.
- Use tabular numerals for attendance, marks, and other dashboard metrics.
- Prefer sentence case and short, descriptive labels.

## Layout and surfaces

- Use generous whitespace and editorial composition, with a clear title area
  followed by focused content sections.
- Keep dashboards structured and data-dense only where needed; use aligned
  cards and consistent spacing to avoid a resume-like wall of text.
- Use softly rounded corners, approximately 12–20px, on cards, buttons, and
  image frames.
- Use subtle warm borders and restrained shadows instead of stark outlines.
- On mobile, stack cards and hero content, keep charts legible, and avoid
  horizontal scrolling.

## Components

- **Primary button:** maroon fill, light text, rounded corners, and clear hover,
  focus, disabled, and loading states.
- **Secondary button:** ivory or muted surface with a maroon outline or text.
- **Cards:** warm-white surface, soft border, rounded corners, concise heading,
  and one primary metric or action.
- **Risk status:** pair Low, Medium, or High with an explanation and a
  next-step suggestion; use labels and icons as well as color.
- **Charts:** use maroon and terracotta for emphasis with neutral supporting
  series, readable legends, and accessible descriptions.
- **Forms:** use persistent labels, comfortable touch targets, visible keyboard
  focus, and plain-language validation feedback.
- **Photography:** use consistent crops and rounded corners; avoid decorative
  photos where they distract from academic decisions.

## Content and accessibility

- Use supportive, non-punitive wording such as “Could use extra support” and
  “Suggested next step.”
- Explain why a risk status appears and what a student or mentor can do next.
- Include empty, loading, error, and insufficient-data states; do not imply that
  missing data means low risk.
- Use semantic headings, keyboard-accessible controls, visible focus, and
  sufficient contrast.
- Respect reduced-motion settings and avoid using motion as the only way to
  convey a change.
