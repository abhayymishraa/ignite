# Produck React Native SDK — setup unfinished

The Produck setup wizard was run in `boilerplate/` (declared Mobile / Expo project — confirmed: `expo` 58.0.25, `react-native` 0.88.1, which is above the SDK's RN 0.82 minimum). It could not finish because the SDK version the setup requires is not published on npm. **No source files were changed by this run.**

## What went wrong

The wizard stopped at the "Installing the SDK and its native libraries" step. The command it ran was:

```
pnpm add @tryproduck/react-native@^2.0.0 react-native-audio-api react-native-get-random-values react-native-incall-manager react-native-webrtc
```

Its key error line, quoted exactly:

```
ERR_PNPM_NO_MATCHING_VERSION  No matching version found for @tryproduck/react-native@^2.0.0 while fetching it from https://registry.npmjs.org/
```

The wizard added: `The latest release of @tryproduck/react-native is "0.1.0".` and `Other releases are: * next: 2.0.0-next.0`. It then stopped before editing any file.

## Why

`@tryproduck/react-native@^2.0.0` is not published on the public npm registry, so the install cannot resolve it. Confirmed independently:

- `npm view @tryproduck/react-native versions` → `[ '0.1.0', '2.0.0-next.0' ]`
- `npm view @tryproduck/react-native dist-tags` → `{ latest: '0.1.0', next: '2.0.0-next.0' }`
- `npm view @tryproduck/react-native@2.0.0` → `npm error code E404 … No match found for version 2.0.0`

There is no published stable `2.x` release — only an old `0.1.0` and a prerelease `2.0.0-next.0`, and the range `^2.0.0` does not select a prerelease. This run did **not** substitute a different version, because the setup is specified to install exactly `@tryproduck/react-native@^2.0.0`; changing that would change the app beyond the setup.

## What this pull request already holds

- **No source-file changes.** The app's `package.json`, `app.config.ts`, and `src/app/_layout.tsx` are untouched, because the SDK package could not be installed and the SDK's plugin/wrap steps need its code present.
- The only committed file is this note.
- For context: this run ran `pnpm install` inside `boilerplate/` so that `react-native` and `expo` resolve from the app folder (the boilerplate template ships with no lockfile and no `node_modules`). That only created `boilerplate/node_modules/` and `boilerplate/pnpm-lock.yaml`, both of which the repo's `.gitignore` ignores — so nothing from the install is committed.

## What is left (once a resolvable SDK version is available)

Run these in `boilerplate/` with pnpm (the project's package manager — CI runs `pnpm install`, the README uses `pnpm run`):

1. `npx expo install react-native-safe-area-context react-native-screens react-native-svg`
2. `pnpm add @tryproduck/react-native@^2.0.0 react-native-audio-api react-native-get-random-values react-native-incall-manager react-native-webrtc`
3. Add `"@tryproduck/react-native"` to the `plugins` list in `boilerplate/app.config.ts` (keep the existing entries).
4. Wrap the root component's default export (the wizard identified `boilerplate/src/app/_layout.tsx`) with:

   ```tsx
   import { withProduck } from "@tryproduck/react-native";

   export default withProduck(App, { apiKey: "<your project key>" });
   ```

5. Native edits and `pod install` do **not** apply: `boilerplate/` has no `ios/` or `android/` folder (both are gitignored for this template). The developer must generate them first with `npx expo prebuild`, after which Expo applies the SDK config plugin, then rebuild with `npx expo run:ios` or `npx expo run:android`.

Use `--key <your project key>` in the commands and `apiKey`. The key starts `pk_live_0123…`; the full publishable key is the one created on **Settings › SDK** (it is shown only once — create a new one there if you no longer have it).

## What to do with this pull request

The blocker is outside this repo — the required SDK version is not on npm. Either:

- **Finish it:** once `@tryproduck/react-native@^2.0.0` is published (or you confirm the correct version with Produck), run the steps above, delete this note file, mark the PR ready, and merge; **or**
- **Close it:** close this PR, resolve the SDK version, and start a fresh setup from **Settings › SDK**. A new setup cannot start while this PR is open.

## Help

Write to yuv@tryproduck.com.
