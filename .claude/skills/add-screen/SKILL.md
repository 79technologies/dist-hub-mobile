# Skill: add-screen

Use when adding a new screen or modal to the app — a new page in the beat→outlet→segment→brand→SKU flow, a new settings screen, a history screen, etc.

## Trigger phrases
"add a screen", "create a new page", "add a modal", "new route", "scaffold a screen"

## Steps

1. **Decide: route or modal?**
   - Full screens that are navigated to → expo-router file in `app/`
   - Overlays that appear on top of an existing screen → Modal component in `app/components/`

2. **For a new expo-router screen**
   - Create `app/<screen-name>.tsx` (or `app/(group)/<screen-name>.tsx` if it belongs to a flow group).
   - Define `export default function <ScreenName>()`.
   - Use `useLocalSearchParams()` for route params; `useRouter()` for navigation.
   - Wire up navigation from the calling screen using `router.push('/<screen-name>')` or `<Link>`.

3. **For a new Modal component**
   - Create `app/components/<FeatureName>Modal.tsx`.
   - Accept `visible: boolean` and `onClose: () => void` as required props.
   - Wrap content in `<Modal animationType="slide" transparent visible={visible}>`.
   - The parent controls `visible` state; the modal only calls `onClose`.

4. **Mandatory checklist before finishing**
   - [ ] All props have explicit TypeScript types.
   - [ ] `StyleSheet.create()` used for all styles — no inline objects.
   - [ ] `FlatList` items have `keyExtractor`.
   - [ ] Component is exported as `default` and named to match the file.
   - [ ] No `any` types.
   - [ ] No `console.log` left in the file.
   - [ ] Run `npx tsc --noEmit` — zero errors.
   - [ ] Run `npm run lint` — zero warnings.

## Pattern reference

Existing screens to copy from:
- Full screen: `app/components/NewBrandsScreen.tsx`
- Modal: `app/components/SKUModal.tsx`
- Reusable dropdown: `app/components/CustomDropdown.tsx`
