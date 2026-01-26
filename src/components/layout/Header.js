import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing } from "../../styles/theme";

/**
 * App header displaying the swimming icon and app title
 * @returns {JSX.Element} The header component
 */
export const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerIcon}>🏊</Text>
      <Text style={styles.title}>My Neptune</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: spacing.l,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerIcon: {
    fontSize: typography.sizes.giant,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
});
