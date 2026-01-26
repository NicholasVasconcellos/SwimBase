import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing, radii } from "../../styles/theme";

/**
 * Displays a labeled time value in a styled card
 * @param {Object} props - Component props
 * @param {string} props.label - Card header text
 * @param {string} props.value - Time value to display
 * @returns {JSX.Element} The time card component
 */
export const TimeCard = ({ label, value }) => {
  return (
    <View style={styles.timeCard}>
      <Text style={styles.timeLabel}>{label}</Text>
      <Text style={styles.timeValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  timeCard: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  timeValue: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
});
