## SMOTE Visualizer

Interactive React + Vike app that demonstrates how SMOTE (Synthetic Minority Oversampling Technique) balances an imbalanced binary dataset. The page shows the original dataset side-by-side with a SMOTE-balanced version and lets you tune parameters to see the impact.

### Features
- Adjustable SMOTE neighbors (`k`) and target minority/majority ratio
- Live stats for original vs balanced class counts and number of synthetic points generated
- SVG scatter plots highlighting majority, original minority, and synthetic minority samples
- Lightweight, client-only implementation of SMOTE for educational purposes

### Tech stack
- React + Vike (Vite) with TypeScript
- Simple in-browser SMOTE implementation (no backend)
- CSS for layout and visualization styling

### Running locally
```bash
npm install
npm run dev
```
Then open the URL shown in the terminal (typically `http://localhost:5173`).

### How SMOTE is implemented (simplified)
1) Separate majority and minority samples from a small toy dataset.  
2) Compute k nearest minority neighbors for each minority point.  
3) Generate synthetic samples along the line segment between a minority point and one of its nearest neighbors using a random gap `0..1`.  
4) Repeat until the target minority count is reached; merge with original data for visualization.

### Notes and limitations
- Uses a fixed 2D toy dataset for clarity; randomness means each refresh may place synthetic points slightly differently.
- Intended for intuition-building only; not a production-ready ML pipeline.
Generated with [vike.dev/new](https://vike.dev/new) ([version 544](https://www.npmjs.com/package/create-vike/v/0.0.544)) using this command:

```sh
npm create vike@latest --- --react
```

## Contents

- [Vike](#vike)
  - [Plus files](#plus-files)
  - [Routing](#routing)
  - [SSR](#ssr)
  - [HTML Streaming](#html-streaming)

## Vike

This app is ready to start. It's powered by [Vike](https://vike.dev) and [React](https://react.dev/learn).

### Plus files

[The + files are the interface](https://vike.dev/config) between Vike and your code.

- [`+config.ts`](https://vike.dev/settings) — Settings (e.g. `<title>`)
- [`+Page.tsx`](https://vike.dev/Page) — The `<Page>` component
- [`+data.ts`](https://vike.dev/data) — Fetching data (for your `<Page>` component)
- [`+Layout.tsx`](https://vike.dev/Layout) — The `<Layout>` component (wraps your `<Page>` components)
- [`+Head.tsx`](https://vike.dev/Head) - Sets `<head>` tags
- [`/pages/_error/+Page.tsx`](https://vike.dev/error-page) — The error page (rendered when an error occurs)
- [`+onPageTransitionStart.ts`](https://vike.dev/onPageTransitionStart) and `+onPageTransitionEnd.ts` — For page transition animations

### Routing

[Vike's built-in router](https://vike.dev/routing) lets you choose between:

- [Filesystem Routing](https://vike.dev/filesystem-routing) (the URL of a page is determined based on where its `+Page.jsx` file is located on the filesystem)
- [Route Strings](https://vike.dev/route-string)
- [Route Functions](https://vike.dev/route-function)

### SSR

SSR is enabled by default. You can [disable it](https://vike.dev/ssr) for all or specific pages.

### HTML Streaming

You can [enable/disable HTML streaming](https://vike.dev/stream) for all or specific pages.

