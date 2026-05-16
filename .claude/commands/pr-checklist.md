# /pr-checklist

Run the pre-PR review checklist against the current branch.

## What to do

1. Run `git diff master...HEAD --stat` and identify the touched files.
2. For each touched file, check the items below.
3. Report **only what fails**, with the file path and line number.
4. End with a single-line verdict: ✅ ready to push, or ❌ `<count>` issues to fix.

## Checklist

### TypeScript & types
- [ ] No `any`. No `as` casts without an explanatory comment.
- [ ] All component props have explicit TypeScript types.
- [ ] Context values are typed — no `createContext({})` without a generic.
- [ ] `SelectedOrders`, `SegmentOrder`, and related interfaces are used correctly (no structural mismatches).

### Security
- [ ] No hardcoded passwords, tokens, or API keys outside `app/constants/DummyData.jsx`.
- [ ] No secrets in any file that could be committed and shipped.

### Component quality
- [ ] `StyleSheet.create()` used for all styles — no inline style objects in JSX.
- [ ] `FlatList` has `keyExtractor` defined.
- [ ] Modal components accept `visible: boolean` and `onClose: () => void`.
- [ ] No dead code: no commented-out JSX blocks or unused variables.
- [ ] No `console.log` (unless the file is explicitly a debug/dev utility).

### State & data flow
- [ ] No business logic directly inside `useEffect` — extracted to a named function.
- [ ] No new global state without justification in an ADR.
- [ ] `FinalOrderContext` values are set where consumed (not just read from the empty default).

### Navigation
- [ ] New full screens use expo-router file-based routing, not `useState` boolean flags.
- [ ] No new conditional-render "navigation" patterns added.

### Performance
- [ ] Handlers passed to `FlatList` `renderItem` are wrapped in `useCallback`.
- [ ] No large data arrays computed inline in render — derive in `useEffect` or `useMemo`.

### Tests & checks
- [ ] `npx tsc --noEmit` passes with zero errors.
- [ ] `npm run lint` passes with zero warnings.

## Output Format

```
app/components/Foo.tsx:42 — inline style object instead of StyleSheet.create
app/contexts/Bar.tsx:5 — createContext({}) has no type parameter

❌ 2 issues to fix.
```

Or:

```
✅ ready to push.
```
