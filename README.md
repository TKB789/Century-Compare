# A Century Apart

Enter a year. See it exactly a century before, and again, and again — from today back to the Big Bang.

A single-page React app that cascades through history one century at a time. Curated key events for anchor years, plus live Wikipedia fallback for any other year.

## Features

- **Exact-century cascade** — enter 1969, see 1969 → 1869 → 1769 → 1669 → ...
- **BCE support** — type "44 BCE" or "500 BC"; the timeline walks back through the Common Era boundary
- **Curated + live data** — hand-picked events for major anchor years; Wikipedia REST API fills in everything else
- **Current year is live** — shows events from the in-progress year, updated each time you load the page
- **Deep time** — beyond recorded history, unlock 12 eras from the Iron Age to the Big Bang

## Deploying to GitHub Pages

### One-time setup

1. Create a new repo on GitHub (e.g. `century-compare`).
2. Push this code to the repo:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/century-compare.git
   git push -u origin main
   ```

3. In `vite.config.js`, make sure `REPO_NAME` matches your repo name. If you named the repo something other than `century-compare`, edit that one line.

4. In your GitHub repo: go to **Settings → Pages**. Under "Build and deployment", set **Source** to **GitHub Actions**.

5. That's it. Push to `main` and the included workflow (`.github/workflows/deploy.yml`) will build and deploy automatically.

Your site will be live at `https://YOUR_USERNAME.github.io/century-compare/` within a minute or two.

### Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

### Manual build

```bash
npm run build       # output goes to ./dist
npm run preview     # preview the production build locally
```

## Project structure

```
century-compare/
├── src/
│   ├── CenturyCompare.jsx   # Main component with curated events + Wikipedia fetch
│   ├── main.jsx             # React entry point
│   └── index.css            # Tailwind directives
├── public/
│   └── favicon.svg
├── .github/workflows/
│   └── deploy.yml           # Auto-deploy on push to main
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Customizing events

All curated event data lives in the `EVENTS` object at the top of `src/CenturyCompare.jsx`. Each year is keyed by an integer (negative for BCE) and contains:

- `key`: the 5 headline events
- `more`: 5 additional events shown when user taps "Show more"
- `seeAlso`: cross-references to related years (same century only)

Deep-time eras are in the `DEEP_TIME` array just below.

## Notes

- Wikipedia's year pages are crowd-edited and vary in quality. The app fetches the "Events" section and parses the first 5 list items, so older BCE years may return less structured data than modern years.
- The current-year block shows a "● LIVE" badge and pulls fresh from Wikipedia on every page load. No backend, no database, no cron job needed.
- The "most recent completed year" default updates automatically based on the user's local date.

## License

Use it however you like.
