import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing, radii } from "../../../styles/theme";
import { getDistanceValue } from "../../../utils/distanceUtils";

export const EntryCard = ({ entry, unit }) => {
  return (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryName}>{entry.name}</Text>
        <Text style={styles.entryResult}>{entry.resultTime}</Text>
      </View>
      <Text style={styles.entryEvent}>
        {getDistanceValue(entry.distance)}
        {unit} {entry.stroke} @ {entry.effort}
      </Text>
      <View style={styles.entryFooter}>
        <Text style={styles.entryTimestamp}>{entry.timestamp}</Text>
        <Text style={styles.entryTarget}>Best: {entry.bestTime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  entryCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  entryName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  entryResult: {
    fontSize: typography.sizes.xl + 2,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  entryEvent: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  entryFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  entryTimestamp: {
    fontSize: typography.sizes.xs,
    color: colors.textDisabled,
  },
  entryTarget: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
});
