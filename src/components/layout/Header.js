import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing } from "../../styles/theme";

export const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerIcon}>🏊</Text>
      <Text style={styles.title}>Swim Time Logger</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerIcon: {
    fontSize: typography.sizes.giant,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
});
