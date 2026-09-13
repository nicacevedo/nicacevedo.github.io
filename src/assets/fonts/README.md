# Vendored typefaces

Variable `.woff2` subsets, committed so the build never reaches a font CDN.
Both are licensed under the SIL Open Font License 1.1 — see the `*-OFL.txt`
files beside them.

| File                                           | Family                   | Source                                                 |
| ---------------------------------------------- | ------------------------ | ------------------------------------------------------ |
| `instrument-sans-latin*-wght-normal.woff2`     | Instrument Sans Variable | `@fontsource-variable/instrument-sans@5.3.0`, `files/` |
| `newsreader-latin*-wght-{normal,italic}.woff2` | Newsreader Variable      | `@fontsource-variable/newsreader@5.3.0`, `files/`      |

To refresh them, install the package version you want and copy the `latin` and
`latin-ext` files across:

```bash
npm pack @fontsource-variable/instrument-sans@5
```

The `unicode-range` values in `astro.config.mjs` come from the same packages'
`index.css` and must be updated alongside the files.
