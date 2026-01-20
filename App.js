import React, { useState } from "react";
import { SafeAreaView, StatusBar, ScrollView, StyleSheet, View } from "react-native";
import { colors } from "./src/styles/theme";
import { useEntries } from "./src/hooks/useEntries";
import { useUnitPreference } from "./src/hooks/useUnitPreference";
import { Header } from "./src/components/layout/Header";
import { TabNavigation } from "./src/components/layout/TabNavigation";
import { EntryForm } from "./src/components/features/EntryForm";
import { LogView } from "./src/components/features/log/LogView";

export default function App() {
  const [showLog, setShowLog] = useState(false);
  const { entries, addEntry, clearEntries, entryCount } = useEntries();
  const { unit, setUnit } = useUnitPreference();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <Header />

      <TabNavigation
        showLog={showLog}
        setShowLog={setShowLog}
        entryCount={entryCount}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        {!showLog ? (
          <EntryForm unit={unit} setUnit={setUnit} onSubmit={addEntry} />
        ) : (
          <LogView entries={entries} unit={unit} onClearLog={clearEntries} />
        )}

        {/* Extra padding at bottom for keyboard */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {},
  bottomPadding: {
    height: 100,
  },
});
