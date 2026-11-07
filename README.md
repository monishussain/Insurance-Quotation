# Insurance Quotation Dashboard

A standalone Angular dashboard for searching and reviewing mock insurance quotations. It uses Angular 22, strict TypeScript, RxJS 7 and Vitest without additional runtime dependencies.

## Run locally

```bash
npm install
npm start
npm test -- --watch=false
npm run build
```

Search by customer name or quotation ID. The mock API uses variable latency and the keyword `error` to simulate a failure. Use the status and premium controls to refine results, then select a row to see its details.

## Structure and decisions

- `core/services/quotation-api.ts` owns the injectable mock data source and latency/error simulation.
- `features/quotations/model` contains the quotation contract.
- `features/quotations/components/quotation-dashboard` owns the screen and its interaction state.
- The search pipeline applies debounce and duplicate suppression, then uses `switchMap` so a newer query unsubscribes the prior request. `catchError` is inside the switched request, keeping later searches usable after a failure.
- RxJS models request timing, cancellation and errors. Signals hold synchronous UI state, while computed signals derive filtered/sorted rows and the currently visible selection. This keeps data flow explicit without introducing a store for a single screen.
- Filtering uses `filter`; sorting copies the filtered array before sorting, preserving source results. `track quotation.quotationId` gives Angular stable row identity.

## Assumptions and limits

All data is local and ephemeral; there is no backend, authentication, persistence, pagination or server-side filtering. Premium amounts are displayed as SAR. A selected row is shown in details only while it remains in the current visible result set. The mock latency is intentionally nondeterministic; concurrency tests use controlled Subjects instead.

## Team-lead discussion

### Architecture for 20 feature areas

Organize by business capability, with each feature owning its routes, UI, data access and tests. Keep a small platform/core area for application-wide infrastructure and shared libraries for stable cross-feature primitives (design system, auth, telemetry and API contracts). Avoid a dumping-ground shared module: promote code only when multiple teams have a real reuse case and a clear owner.

Use route-level lazy loading and standalone feature route trees; keep the shell and global error/auth boundaries in the application layer. Assign CODEOWNERS and explicit ownership for feature libraries and shared APIs. A monorepo becomes useful when coordinated changes, consistent tooling, dependency visibility and shared CI outweigh repository autonomy; Nx or Angular CLI workspaces can enforce boundaries. Separate repositories suit teams that need independent release/tooling lifecycles and have strong contract discipline.

### Performance at 100,000 records

Move filtering, sorting and pagination to the server. Use cursor-based or well-defined page navigation, request only visible fields, and index/search data at the API boundary. Virtual scrolling limits DOM nodes when users need a long continuous list, but it does not replace server pagination or reduce transfer size by itself. Use stable IDs, OnPush-compatible signal/observable inputs, and profile before memoizing. Keep query/page/filter state in the URL or a feature store if it must survive navigation or be shared. Debounce input, cancel superseded requests, deduplicate normalized query keys, cache where freshness rules permit, and use explicit retry/backoff for transient failures.

### Microfrontends

Use Webpack Module Federation when teams need independently deployed browser remotes and the existing platform is already standardized on Webpack. It offers a mature ecosystem, with runtime remote loading and shared dependencies, but shared version negotiation and build/runtime coupling need governance. Native Federation can fit modern ESM and import-map based setups, especially when avoiding a Webpack-specific build pipeline is valuable; validate tooling maturity, integration and support requirements for the chosen stack. Both add deployment, observability, security and compatibility operations.

Choose neither when one team or a coordinated release train can deliver the product as a modular monolith. A single Angular app with lazy-loaded feature boundaries is simpler and often faster. Federation is justified when organizational deployment independence is a real requirement, such as separately released account and claims portals owned by autonomous teams, and not merely as a way to split bundles.
