# Skill: api-integration

Use when replacing a hardcoded data source in `app/constants/` with a real API call, or when wiring up the order submission to a backend endpoint.

## Trigger phrases
"connect to the API", "replace hardcoded data", "call the backend", "submit to server", "fetch from endpoint", "wire up the real API"

## Context

All data in this app is currently hardcoded in `app/constants/`. The order submission in `ReviewOrderModal.tsx` is a fake `setTimeout`. The login in `LoginForm.tsx` checks against `DummyData.jsx`.

## Steps

### 1. Create a service file

For each domain, create `app/services/<domain>.service.ts`:

```ts
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;  // set in .env.local

export async function fetchBeats(): Promise<Beat[]> {
  const res = await fetch(`${BASE_URL}/beats`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(`fetchBeats failed: ${res.status}`);
  return res.json();
}
```

- One file per domain: `beats.service.ts`, `orders.service.ts`, `auth.service.ts`.
- Never call `fetch` directly inside a component.
- Always check `res.ok` and throw on failure — do not silently swallow HTTP errors.

### 2. Environment variables

Add to `.env.local` (gitignored):
```
EXPO_PUBLIC_API_BASE_URL=http://192.168.x.x:3000
```

For production via EAS, add as an EAS Secret:
```
eas secret:create --scope project --name EXPO_PUBLIC_API_BASE_URL --value https://api.example.com
```

`EXPO_PUBLIC_` prefix is required for Expo to expose env vars to the JS bundle.

### 3. Replace hardcoded data in components

Pattern for loading data in a component:

```ts
const [beats, setBeats] = useState<Beat[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetchBeats()
    .then(setBeats)
    .catch((e) => setError(e.message))
    .finally(() => setLoading(false));
}, []);
```

Show `<ActivityIndicator>` while loading; show an error message on failure.

### 4. Authentication

- Store the auth token with `expo-secure-store` (not AsyncStorage — SecureStore is encrypted).
- Install: `npx expo install expo-secure-store`
- On login success, call `SecureStore.setItemAsync('authToken', token)`.
- On logout / cancel, call `SecureStore.deleteItemAsync('authToken')`.
- In service files, read via `SecureStore.getItemAsync('authToken')`.

### 5. Order submission

Replace the `setTimeout` in `ReviewOrderModal.handleOrderPunchIn` with a real `fetch`:

```ts
const handleOrderPunchIn = async () => {
  setOrderLoader(true);
  try {
    await submitOrder({ beat: beatName, outlet, segmentOrderData });
    clearOrdersList();
    closeModal();
    handleCancelOrder();
  } catch (e) {
    // surface error to user — do not silently fail
  } finally {
    setOrderLoader(false);
  }
};
```

### 6. Checklist before finishing

- [ ] No hardcoded URLs in component files — all in service layer.
- [ ] `.env.local` added to `.gitignore`.
- [ ] Loading and error states handled in every screen that fetches data.
- [ ] Token stored in `expo-secure-store`, not `AsyncStorage`.
- [ ] `npx tsc --noEmit` — zero errors.
- [ ] `npm run lint` — zero warnings.
