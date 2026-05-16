# dist-hub — Claude Code Guide

## Project

A Diageo field sales order-entry app for Android and iOS. Sales reps visit bars/restaurants on their assigned beat routes and punch in liquor orders by brand and SKU.

**Stack:** Expo SDK 52 · expo-router v4 · React Native 0.76 · TypeScript · react-native-paper · react-native-element-dropdown · FontAwesome

**Bundle IDs:** `com.madhusudansinghrathore.dist-hub` (iOS + Android)

---

## User Flow

```
Login → Beat → Outlet → Segment → Brands (grid) → SKU Modal (qty + type) → Review → Submit
```

All navigation is currently managed via `useState` booleans in parent components, not expo-router routes.

---

## Folder Structure

```
app/
  index.tsx                  # Root: manages login state
  LoginForm.tsx              # Email + password login screen
  components/                # Feature screens and modals
    BeatsOutletSegment.tsx   # Beat + Outlet cascading dropdowns
    NewBrandsScreen.tsx      # Segment picker + brand grid
    SKUModal.tsx             # Per-brand SKU selection (qty, cases/bottles)
    ReviewOrderModal.tsx     # Order review + submit
    CustomDropdown.tsx       # Reusable searchable dropdown
  constants/                 # Hardcoded data (MVP — replace with API calls later)
    BeatsOutlet.jsx          # Beat → Outlet hierarchy
    SegmentBrand.tsx         # Segment → Brand → SKU hierarchy
    DummyData.jsx            # Login credentials, dropdown options
  contexts/
    FinalOrderContext.tsx    # Global order context
  interface/                 # TypeScript type definitions
```

---

## Coding Rules

### TypeScript
- No `any`. Use proper types or generics.
- No `as` casts without an explanatory comment explaining why it is safe.
- All component props must have explicit TypeScript types.
- Context must be typed — `createContext<T>(defaultValue)`, never `createContext({})`.

### Components
- Keep components focused. Modals are separate files; screens are separate files.
- Use `StyleSheet.create()` for all styles — no inline style objects in JSX.
- `FlatList` must always have `keyExtractor`.
- Avoid re-renders: use `useCallback` for handlers passed as props when the child is a `FlatList` item or a memoized component.

### State & Data Flow
- Data flows down via props; events flow up via callbacks.
- Do not put business logic inside `useEffect` directly — extract to a named function.
- `FinalOrderContext` is the only allowed global state store. Do not introduce additional contexts without an ADR.

### Navigation
- New screens must use expo-router file-based routing, not `useState` boolean flags.
- Do not add more conditional-render "navigation" — migrate old screens to expo-router when touching them.

### Platform
- Test changes on both iOS and Android before calling a task done.
- Use `Platform.OS` to isolate platform-specific behaviour; never guess.
- Avoid third-party native modules unless there is no Expo SDK alternative — native modules break OTA updates.

### Security
- Never store credentials, API keys, or tokens in source files. Use Expo's `expo-constants` + EAS Secrets for environment variables.
- `app/constants/DummyData.jsx` exists only for local MVP development. It must be replaced before any production release.

### No Dead Code
- Do not leave commented-out code blocks in commits. Delete unused code; git history preserves it.
- Remove `console.log` calls before merging to `master`.

---

## MVP Constraints (current state)

- All data is hardcoded in `app/constants/`. No live API calls yet.
- Order submission is a fake `setTimeout` stub — no real backend write.
- Login checks against plaintext credentials in `DummyData.jsx` — not production safe.
- `react-native-toast-message` `<Toast>` is not inside a `<ToastProvider>` — fix before using toasts in production.

---

## Common Commands

```bash
npm start              # Start Expo dev server
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator
npm run lint           # Run expo lint (ESLint)
npx tsc --noEmit       # Type-check without building
npm test               # Run Jest tests
```

---

## When to Write an ADR

Use `/adr` before:
- Adding a native module or a new third-party dependency.
- Changing the navigation architecture (e.g., migrating to expo-router routes).
- Adding a state management library (Redux, Zustand, etc.).
- Introducing a backend API integration or persistence layer.
- Any change that affects the data shape flowing between Beat → Outlet → Segment → Brand → SKU.
