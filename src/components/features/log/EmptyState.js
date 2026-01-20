import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing } from "../../../styles/theme";

export const EmptyState = () => {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyText}>No entries yet</Text>
      <Text style={styles.emptySubtext}>Log your first swim time!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: typography.sizes.huge,
    marginBottom: spacing.lg,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.sizes.md,
    color: colors.textDisabled,
  },
});
