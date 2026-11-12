# Produck SDK setup — unfinished

Setup of the Produck React Native SDK in `boilerplate/` could not be completed. No SDK files were changed; this note is the only file in this pull request.

## What went wrong
The first install step the wizard ran failed before any file was edited.

- Command (run in `boilerplate/`): `npx expo install react-native-safe-area-context react-native-screens react-native-svg --pnpm`
- Key error line: `Error reading Expo config at .../boilerplate/app.config.ts:` followed by `Cannot find module '@expo/config'`
- The wizard then reported: `The install failed. The wizard edited no file.` and `Setup stopped before any file edit.`

## Why
`boilerplate/` has no `node_modules` and no lockfile of its own — its dependencies have never been installed here. (There is a `pnpm-lock.yaml` at the repository root, but `boilerplate/` is not a workspace member: there is no `pnpm-workspace.yaml` and no `workspaces` field.)

`npx expo install` must first read the Expo config. `app.config.ts` runs `import "tsx/cjs"` and imports from `@expo/config`, both of which live in the (missing) local `node_modules`. With no `node_modules`, Node cannot resolve `@expo/config`, so reading the config throws and the install aborts. Because no SDK package was installed, none of the SDK's later steps could run.

This is not a version conflict and not a network error. The package manager was detected correctly — pnpm (the repository root declares `packageManager: pnpm@10.9.0`, and `boilerplate/.npmrc` uses the pnpm `strict-peer-dependencies` setting); the wizard used `--pnpm`.

## What this pull request already holds
Nothing was changed. The working tree is clean apart from this note (`PRODUCK.md`). No package was installed, no lockfile was written; `app.config.ts`, `app.json`, and `src/app/_layout.tsx` are untouched.

## What is left
Run these in `boilerplate/`:

1. Install the project's existing dependencies so `node_modules` exists:
   ```
   pnpm install
   ```
2. Install the SDK's Expo-managed libraries (let Expo pick the versions):
   ```
   npx expo install react-native-safe-area-context react-native-screens react-native-svg
   ```
3. Install the SDK and its remaining native libraries with pnpm:
   ```
   pnpm add @tryproduck/react-native@^2.0.0 react-native-audio-api react-native-get-random-values react-native-incall-manager react-native-webrtc
   ```
4. Re-run the wizard, which — with the packages now present — will wrap the root component and print the config-plugin step:
   ```
   npx @tryproduck/wizard --key pk_live_0123456789abcdef0123456789abcdef0123456789abcdef --yes
   ```
   Or make the two edits by hand:
   - Add `"@tryproduck/react-native"` to the plugins list in `app.config.ts` (the `plugins: [...existingPlugins]` array), keeping the existing entries.
   - Wrap whatever `src/app/_layout.tsx` currently default-exports:
     ```tsx
     import { withProduck } from "@tryproduck/react-native"
     // ...
     export default withProduck(RootLayout, { apiKey: "pk_live_0123456789abcdef0123456789abcdef0123456789abcdef" })
     ```

There are no `ios/` or `android/` folders (this is a managed Expo app), so there are no native `Info.plist` / `AndroidManifest.xml` / ProGuard edits to make and no `cd ios && pod install` to run — the config plugin applies those when `npx expo prebuild` later generates the native folders.

Finally, rebuild to verify with `npx expo run:ios` or `npx expo run:android` (a native rebuild; Expo Go cannot load the SDK). The duck appears in the bottom-right corner; if it does not, the console prints a line starting with `Produck: not started` naming the cause.

## What to do with this pull request
Either: finish it with the steps above, delete this note file (`PRODUCK.md`), mark the pull request ready, and merge it. Or: close it, fix the cause (install the project's dependencies), and open a new one from Settings › SDK — a new one cannot start while this one is open.

## Help
yuv@tryproduck.com
