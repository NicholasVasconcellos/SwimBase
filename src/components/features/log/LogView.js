import React from "react";
import { View, StyleSheet } from "react-native";
import { spacing } from "../../../styles/theme";
import { EmptyState } from "./EmptyState";
import { EntryCard } from "./EntryCard";
import { Button } from "../../common/Button";

export const LogView = ({ entries, unit, onClearLog }) => {
  if (entries.length === 0) {
    return <EmptyState />;
  }

  return (
    <View style={styles.logContainer}>
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} unit={unit} />
      ))}
      <Button
        title="🗑️ Clear Log"
        variant="danger"
        onPress={onClearLog}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logContainer: {
    padding: spacing.lg,
  },
});
