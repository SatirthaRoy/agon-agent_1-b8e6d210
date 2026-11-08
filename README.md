# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # Love Site

  Romantic single-page site built with React, Vite, Cloudflare Pages Functions, and Cloudflare D1.

  ## Cloudflare deployment

  Follow [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md) to connect the GitHub repository, configure the admin secrets, and apply the D1 schema.

  Cloudflare Pages build settings:

  - Build command: `npm run build`
  - Build output directory: `dist`

  The D1 database binding and ID are in `wrangler.toml`. The schema migration is in `migrations/`.

  ## Local development

  Create `.dev.vars` from `.dev.vars.example`, set local admin secrets, then run:

  ```powershell
  npm install
  npm run dev
  ```

  This uses Wrangler's local D1 emulator. Its data is separate from the remote Cloudflare database.

