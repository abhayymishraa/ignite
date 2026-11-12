# Produck setup — unfinished

Declared platform / framework: **Mobile / Expo** (Expo app on React Native 0.83.2, in `boilerplate/`). This was sanity-checked against the repo manifest and entry points and matches.

## What went wrong
The SDK install step failed. The wizard ran, in `boilerplate/`:

    pnpm add @tryproduck/react-native@^2.0.0 react-native-audio-api react-native-get-random-values react-native-incall-manager react-native-webrtc

and it failed with (quoted exactly):

    ERR_PNPM_NO_MATCHING_VERSION  No matching version found for @tryproduck/react-native@^2.0.0 while fetching it from https://registry.npmjs.org/

## Why
`@tryproduck/react-native@^2.0.0` is not published on the npm registry. `npm view @tryproduck/react-native versions dist-tags` returned only:

    versions  = [ '0.1.0', '2.0.0-next.0' ]
    dist-tags = { latest: '0.1.0', next: '2.0.0-next.0' }

The range the SDK requires, `^2.0.0`, matches no published stable release: the latest stable is `0.1.0`, and `2.0.0-next.0` is a pre-release, which `^2.0.0` does not select. Because this core package could not be installed, every later step (its native libraries, the config plugin, the root-component wrap) was blocked — they all need the package present. I did not change the version, use the pre-release tag, pass `--force`/`--legacy-peer-deps`, or hand-edit source to reference a package that is not installed.

## What this pull request already holds
- `boilerplate/package.json` — `react-native-svg@15.15.3` was added by the wizard's `npx expo install react-native-safe-area-context react-native-screens react-native-svg` step (the other two were already present at compatible versions, so only svg was added; Expo picked the version). That tool also normalised the indentation of the `"dependencies"` key. No other file was changed.
- Nothing else is committed: the app's `boilerplate/pnpm-lock.yaml` is git-ignored in this repo (line 22 of the root `.gitignore`), and `node_modules/` is not committed.

Context: to run the wizard at all, the app's own dependencies first had to be installed from `boilerplate/` with `pnpm install`, because `boilerplate/` is the Ignite template and ships without an installed dependency tree. The root `pnpm-lock.yaml` is the `ignite-cli` repo's lockfile, not the app's; the wizard's first attempt (`pnpm install --frozen-lockfile` in the parent) therefore could not make `react-native`/`expo` resolve from `boilerplate/`.

## What is left
1. Install the SDK and its native libraries from `boilerplate/` (blocked until a `@tryproduck/react-native` version satisfying `^2.0.0` is published):

       pnpm add @tryproduck/react-native@^2.0.0 react-native-audio-api react-native-get-random-values react-native-incall-manager react-native-webrtc

2. Add the config plugin to `boilerplate/app.config.ts`. In the returned object, change `plugins: [...existingPlugins]` to:

       plugins: [...existingPlugins, "@tryproduck/react-native"],

3. Wrap the root component in `boilerplate/src/app/_layout.tsx` (default export `Root`) on its default export:

       import { withProduck } from "@tryproduck/react-native"
       // keep the existing component as a named `function Root() { ... }`
       export default withProduck(Root, { apiKey: "<your project key>" })

4. There are currently no `ios/` or `android/` folders in `boilerplate/`, so the native edits (Info.plist, PrivacyInfo.xcprivacy, AndroidManifest.xml, proguard-rules.pro) and `cd ios && pod install` are not applicable yet. Expo's prebuild generates those folders and applies the config plugin on the next build; run `cd ios && pod install` once an `ios/` folder exists.

5. Rebuild the app (the SDK has native code, so a JS reload or Expo Go will not load it): `npx expo run:ios` or `npx expo run:android`.

In the commands above use `--key <your project key>`. The full key is the one you created on Settings › SDK; it is shown only once there, and you can create a new one there if you no longer have it. Its first characters are `pk_live_0123…`.

## What to do with this pull request
- Finish it: do the steps above, delete this note file, mark the pull request ready, and merge it.
- Or close it, fix the cause (publish a `@tryproduck/react-native` version that satisfies `^2.0.0`), and open a new one from Settings › SDK. A new one cannot start while this one is open.

## Help
yuv@tryproduck.com
