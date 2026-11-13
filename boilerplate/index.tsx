import "@expo/metro-runtime" // this is for fast refresh on web w/o expo-router
import { registerRootComponent } from "expo"
import { withProduck } from "@tryproduck/react-native"

import { App } from "@/app"

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(withProduck(App, { apiKey: "pk_live_51740466fa6fe203f08715a6f37a78a7a395392d53d19048" }))
