import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { AppProvider } from "../src/context";
import { colors } from "../src/styles/theme";

/**
 * Root layout with safe area handling and global providers
 * @returns {JSX.Element} The root layout component
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <AppProvider>
        <Slot />
      </AppProvider>
    </SafeAreaProvider>
  );
}
