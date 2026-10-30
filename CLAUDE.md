# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml`).

```bash
pnpm install      # install dependencies
pnpm dev          # start Vite dev server
pnpm build        # production build to dist/
pnpm preview      # serve the production build
```

There is no test runner, linter, or formatter configured. Type checking is done by TypeScript (`tsconfig.json` has `noEmit: true`); Vite handles TS/decorators via `vite-plugin-babel` at build time.

## Environment

Firebase config is read from `VITE_FIREBASE_*` env vars (`.env`, gitignored) in [src/firebase/index.ts](src/firebase/index.ts): `VITE_FIREBASE_API_KEY`, `_AUTH_DOMAIN`, `_DB_URL`, `_PROJECT_ID`, `_STORAGE`, `_SENDER_ID`, `_APP_ID`.

## Architecture

Single-page app built with **Lit** (web components) + **Firebase** (Auth, Realtime Database, Storage), bundled with Vite. UI text and many comments are in Spanish.

### Bootstrap and auto-registration

Entry is [src/xgamecovers.ts](src/xgamecovers.ts), which uses `import.meta.glob(..., { eager: true })` to eagerly import **every** file under `elements/`, `components/`, `views/`, and every `.scss` under `styles/`. Custom elements self-register via `@customElement`, so a new component becomes available simply by creating its file in the right folder — there is no central registry to update. `index.html` mounts a single `<e-app>`.

### Routing

Client-side routing uses `@lit-labs/router` with a `URLPattern` polyfill. Routes are defined as a plain object in [src/controllers/router.controller.ts](src/controllers/router.controller.ts); each entry maps a `path` to a `render(params)` returning a view element (`v-*`). `[e-app](src/elements/e-app/e-app.ts)` wires the router. To add a page: add a route here and create the matching `v-*` view. Use `getAdminRoute(key, params)` to build URLs from route keys rather than hardcoding paths. A `_middleware`/`authStore.isLogged()` check gates auth-only behavior; the catch-all `(.*)` route redirects to `/`.

### Layered domain model

Each business entity lives in `src/domain/<entity>/` and follows the same layering. Data flows **UI → repository → factory → firebase service**:

- **`*.repository.ts`** — the API surface used by views. Defines a `PATH` constant (the RTDB node), calls `rtdbService`, and maps results through the factory. Exported as a singleton (`export const gameRepository = new GameRepository()`).
- **`*.factory.ts`** — `fromApi(data)` normalizes raw RTDB records into typed domain objects with defaults. Always map reads through the factory.
- **`*.types.ts`** — the domain type.
- **`*.form.ts`** (some entities) — a declarative `FormScheme` describing form fields (type, label, validation, nested repeatable blocks) consumed by the generic `c-form` component. See [src/domain/game/game.form.ts](src/domain/game/game.form.ts) and [src/domain/form/form.types.ts](src/domain/form/form.types.ts).

`auth` is the exception: it adds an **`auth.store.ts`** singleton (`authStore`) holding reactive user state via `onAuthChange`, used across views and the router for `isLogged()`.

### The c-form / FormScheme engine

Most create/edit views are driven by a single generic component, [`c-form`](src/components/c-form/c-form.ts), rendered from a declarative **`FormScheme`** (types in [src/domain/form/form.types.ts](src/domain/form/form.types.ts)). Entity schemes live in `src/domain/<entity>/<entity>.form.ts` (e.g. [game.form.ts](src/domain/game/game.form.ts)). This is the most intricate subsystem — read it before touching forms.

**Scheme shape.** A `FormScheme` is `Record<string, FieldScheme | FieldBlock>` — order of keys is render order.

- **`FieldScheme`** — one field. `type` selects the widget (`text`/`date`/`datetime-local`/`number`/`hidden` → `e-input`, plus `file`, `search`, `textarea`, `select`, `select-multiple`, `select-preview`, `checkbox`); unknown types render a "no disponible" placeholder. **`fillValue` is the field's live value** — it is both the initial value and where the current value is written back on every input (`_updateSchemeValue`). `fieldSize` (`min`/`small`/`half`/`big`/`max`/`full`) maps to a `c-form__field--*` modifier class.
- **`FieldBlock`** — a repeatable group of sub-schemes (`structure` is the template; `fields: FormScheme[]` is the live instances). `canAdd`/`canDelete` render +/- buttons that `structuredClone` the `structure` or splice `fields`; `messageEmpty` shows when empty. `c-form` distinguishes the two by `'fields' in field`.

**Wiring a view to c-form (the contract):**

1. View holds the scheme in `@state() _formscheme` and passes it as `.scheme=${this._formscheme}`.
2. **Populate dynamic options** (e.g. select options fetched from a repository) by `structuredClone`-ing the scheme, mutating the target field's `options`, and reassigning `_formscheme` to trigger re-render — see `_fillConsolesOptions`.
3. **Prefill for edit** by writing each field's `fillValue` from the loaded entity; for blocks, clone `structure` per record and push into `fields` — see `_setGameValues` / `_setDesignsValue` in [v-catalogue-edit.ts](src/views/v-catalogue-edit/v-catalogue-edit.ts).
4. **On submit**, `@query('c-form')` and call one of three getters, each of which first runs native `form.reportValidity()` and returns `null` if invalid:
   - `getFinalData()` — cloned plain object of `fillValue`s; **skips** block fields flagged `excludeBlock` and fields flagged `excludeValue`. This is the entity payload for the DB.
   - `getFullData()` — same but **without** exclusions (used to reach block data like designs, incl. file inputs).
   - `getRawData()` — the raw scheme itself, so the view can reach `field.files` (the `FileList` for uploads) and per-instance block fields.

   The catalogue views use all three together: `getFinalData()` for the game record, `getFullData().designs` to iterate design blocks, and `getRawData().designs.fields[i]` to pull each design's `poster`/`slipcover`/`material` `FileList` for upload.

**Field dependencies.** A field can declare `dependsOn: [otherFieldId]` to react to another field. On every `updated()`, `c-form` rebuilds listeners (`_clearAllDependencyListeners` → `_activateDependencies`) and wires one of three behaviors by tag pair: text→text (mirror value, with optional `concatValue` template where `${index}` is the 1-based block index — see the design `name` field), select→select (repopulate options from `additionalData[value]`), and text/textarea→search (hide/clear the main field while the search field has a value). When adding a dependency type, extend `_associateDependency`.

### Firebase services

[src/firebase/](src/firebase/) wraps the SDK: `index.ts` initializes the app and exports `auth`/`rtdb`/`storage`; `rtdb.service.ts` is a generic CRUD helper (`getAll`, `getAllOrderedBy`, `getById`, `filterByChild`, `set`, `update`, `delete`) that auto-stamps `id`/`createdAt`/`updatedAt`; `auth.service.ts` (Google sign-in) and `storage.service.ts` handle the other Firebase products. Repositories should go through these services, not the raw SDK.

### Component tiers

Three tiers of web components, each folder holding a `.ts` + a co-located `.style.scss` imported with `?inline` and wrapped in `css\`${unsafeCSS(style)}\``:

- **`elements/` (`e-*`)** — primitives: `e-button`, `e-input`, `e-select`, `e-icon`, `e-layout`, etc. `e-icon` renders inline SVGs registered in [e-icon.list.ts](src/elements/e-icon/e-icon.list.ts) from `sources/`.
- **`components/` (`c-*`)** — composed widgets: `c-form`, `c-card*`, `c-modal`, `c-search`, `c-filters`, etc.
- **`views/` (`v-*`)** — page-level components mapped by the router; they load data from repositories in `connectedCallback`/`render` and compose `c-*`/`e-*`.

Views wrap content in the page shell via `LayoutMixin`'s `layoutGrid(content, heading)` ([src/mixins/layout.mixin.ts](src/mixins/layout.mixin.ts)). Cross-component communication is via `CustomEvent` (e.g. `@search`), with a `debounce` helper in [src/utils/events.utils.ts](src/utils/events.utils.ts).

### Styling

SCSS is global-loaded (base, tools, typography, variables, utils under `src/styles/`) plus per-component `?inline` styles compiled into each component's shadow DOM. `sass` is a dev dependency; Vite compiles SCSS natively.

## Conventions

- TypeScript uses **experimental (legacy) decorators** (`experimentalDecorators`, `useDefineForClassFields: false`) — required for Lit's `@customElement`/`@state`/`@property`. Babel's `@babel/plugin-proposal-decorators` mirrors this at bundle time.
- Imports frequently include the `.ts` extension (`allowImportingTsExtensions` is on).
- Naming: `e-*` element / `c-*` component / `v-*` view for tags and folders; domain singletons are lowercased instance exports.
- New assets: add SVGs to `e-icon/sources/` and register them in `e-icon.list.ts`.
