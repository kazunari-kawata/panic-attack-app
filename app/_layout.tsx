/* eslint-disable import/no-unresolved */
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./components/Header";
import Menu from "./components/Menu";

export default function RootLayout() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#5DADE2" }}
      edges={["top", "left", "right"]}
    >
      <Header />
      <Slot />
      <Menu />
    </SafeAreaView>
  );
}
