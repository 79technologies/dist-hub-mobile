# 0001 — Local Persistence with expo-sqlite

**Status:** Proposed
**Date:** 2026-05-16
**Deciders:** Madhusudansingh Rathore

## Context

All app data (beats, outlets, segments, brands, SKUs) is currently hardcoded in `app/constants/`. Order submission is a fake `setTimeout` stub with no backend write. Field sales reps work in areas with unreliable connectivity, so the app must function fully offline and sync when a connection is available.

The order data model is relational: a beat contains outlets, outlets belong to segments, segments contain brands, and brands contain SKUs. A submitted order ties together a beat, outlet, one or more segments, and per-brand SKU selections with quantity and type (cases/bottles).

Two storage needs exist:
1. **Reference data** — beats, outlets, segments, brands, SKUs (currently hardcoded; will eventually come from an API but must be cached for offline use).
2. **Order data** — draft orders in progress, completed orders pending sync to the backend, and sync status per order.

Options evaluated: `expo-sqlite`, `@react-native-async-storage/async-storage`, and MMKV.

## Decision

Use **`expo-sqlite`** (part of Expo SDK 52) as the sole local persistence layer for both reference data and order data.

- All reference data (beats, outlets, segments, brands, SKUs) is seeded into SQLite tables on first launch and refreshed when the API becomes available.
- Orders are written to a `orders` table with a `sync_status` column (`draft` | `pending` | `synced` | `failed`).
- A dedicated `db/` module (`app/db/`) owns all schema definitions, migrations, and query functions. No component imports `expo-sqlite` directly.
- Schema migrations are managed with a `migrations` table (sequential integer versions).
- `AsyncStorage` is reserved only for non-relational primitives: auth token, last-sync timestamp, user preferences.

## Consequences

**Easier:**
- Querying unsynced orders, filtering by beat/date, and aggregating order history are straightforward SQL.
- Reference data can be refreshed from the API without touching component state.
- The `app/constants/` hardcoded files can be deleted once the seed migration is written.
- Offline-first behaviour is a natural fit: writes go to SQLite immediately, a background sync job reads `pending` rows.

**Harder:**
- Schema changes require explicit migration scripts; there is no auto-migration.
- `expo-sqlite` async API adds boilerplate compared to synchronous in-memory constants.
- Testing requires either a real SQLite file or a mock of the `db/` module boundary.
- The `FinalOrderContext` global state store will need to be reconsidered — order state that survives app restarts must come from SQLite, not React state.

**New constraints:**
- Every new table or column change must ship with a numbered migration.
- Components must never import `expo-sqlite` directly — all DB access goes through `app/db/`.
- The `app/constants/` files (`BeatsOutlet.jsx`, `SegmentBrand.tsx`) are deprecated and must not receive new data; they exist only until the seed migration replaces them.

## Alternatives Considered

**`@react-native-async-storage/async-storage`**
Key-value store. Suitable for flat primitives (token, preferences). Storing relational order data as nested JSON means loading entire blobs to filter or update a single field. No querying. Rejected for order and reference data; retained for auth token and preferences.

**MMKV (`react-native-mmkv`)**
Synchronous, very fast key-value store. Same structural limitation as AsyncStorage for relational data. Also requires a native module, which breaks OTA updates per the project's native-module policy.

**WatermelonDB**
Reactive ORM built on SQLite, designed for large offline-first datasets. Adds significant complexity and a native module dependency. Overkill for MVP scale; reconsider if order history grows beyond ~10 k rows or multi-user sync conflict resolution is needed.

## References

- Related ADRs: —
- `app/constants/DummyData.jsx` — current fake credential + dropdown data (to be replaced)
- `app/constants/BeatsOutlet.jsx`, `app/constants/SegmentBrand.tsx` — reference data to be seeded into SQLite
- Expo SQLite docs: https://docs.expo.dev/versions/latest/sdk/sqlite/
