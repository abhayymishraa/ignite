# Produck React Native SDK — setup unfinished

Platform: Mobile / Expo (Expo app on React Native 0.83.2). The app lives in `boilerplate/`. This note is for a developer who did not see the setup run.

## What went wrong

The SDK package install failed. Command run (in `boilerplate/`):

    pnpm add @tryproduck/react-native@^2.0.0 react-native-audio-api react-native-get-random-values react-native-incall-manager react-native-webrtc

Key error line, quoted exactly:

    ERR_PNPM_NO_MATCHING_VERSION  No matching version found for @tryproduck/react-native@^2.0.0 while fetching it from https://registry.npmjs.org/

## Why

The npm registry does not publish a version that `^2.0.0` accepts. Confirmed:

    npm view @tryproduck/react-native versions   -> [ '0.1.0', '2.0.0-next.0' ]
    npm view @tryproduck/react-native dist-tags   -> { latest: '0.1.0', next: '2.0.0-next.0' }

`0.1.0` is below `^2.0.0`, and `2.0.0-next.0` is a pre-release, which a caret range does not match. I did not change the version, pass `--force`/`--legacy-peer-deps`, or substitute the pre-release, because the setup must install the version it names and I may not alter it.

(The SDK's own peer requirements, for reference: react `>=18.3`, react-native `>=0.81`, react-native-svg `>=15 <16`, react-native-view-shot `>=4 <5`, react-native-safe-area-context `>=5 <6`.)

Sandbox note (no repo file added): `boilerplate/` ships without a lockfile, so the wizard first ran `pnpm install --frozen-lockfile` in the repo root (the Ignite CLI package) and then could not resolve react-native/expo from `boilerplate/`. I ran `pnpm install` inside `boilerplate/` to install the app's own packages; `boilerplate/node_modules` and `boilerplate/pnpm-lock.yaml` are gitignored, so they are not part of this pull request. That let the wizard reach the install steps, where it then hit the error above.

## What this pull request already holds

- `boilerplate/package.json`: `react-native-svg` changed from `15.16.0` to `15.15.3`. Expo chose this version during the first setup step, `npx expo install react-native-safe-area-context react-native-screens react-native-svg` (all three were already present, so only svg's pin changed). The wizard's JSON writer also made a one-line whitespace fix on the `"dependencies":` key.
- Nothing else changed. The SDK packages are NOT installed, the config plugin is NOT added, and the root component is NOT wrapped.

## What is left (run in `boilerplate/`)

1. Install the SDK and its native libraries, once a version `^2.0.0` accepts is published (ask Produck for the exact spec if the 2.x line is still only the pre-release `2.0.0-next.0`; do not guess):

       pnpm add @tryproduck/react-native@^2.0.0 react-native-audio-api react-native-get-random-values react-native-incall-manager react-native-webrtc

2. Re-run the wizard to apply the remaining steps, or do them by hand:

       npx @tryproduck/wizard --key <your project key> --yes

3. Add the config plugin: in `boilerplate/app.config.ts`, add `"@tryproduck/react-native"` to the `plugins` list (keep the existing entries).

4. Wrap the root component's default export in `boilerplate/src/app/_layout.tsx`:

       import { withProduck } from "@tryproduck/react-native";

       export default withProduck(Root, { apiKey: "<your project key>" });

   (Use the file's actual default-exported component name in place of `Root`.)

No `cd ios && pod install`: `boilerplate/` has no `ios/` (or `android/`) folder, so the native edits and pod install do not apply here. Expo applies the config plugin when it later generates those folders.

Then rebuild (the SDK has native code, so a JS reload / Expo Go is not enough):

    npx expo run:ios
    # or
    npx expo run:android

## About the key

Use `--key <your project key>` in commands. The key starts `pk_live_0123…`. The full value is the one you created on Settings › SDK; it is shown only once there, and you can create a new one if needed.

## What to do with this pull request

- Finish it with the steps above, delete this note file, mark the pull request ready, and merge it; or
- Close it, fix the cause (get a published `@tryproduck/react-native` version that `^2.0.0` accepts), and open a new one from Settings › SDK. A new one cannot start while this one is open.

## Help

Write to yuv@tryproduck.com.
