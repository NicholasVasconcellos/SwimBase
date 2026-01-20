import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, typography, spacing, radii } from "../../styles/theme";

export const TabNavigation = ({ showLog, setShowLog, entryCount }) => {
  return (
    <View style={styles.tabs}>
      <TouchableOpacity
        style={[styles.tab, !showLog && styles.tabActive]}
        onPress={() => setShowLog(false)}
      >
        <Text style={[styles.tabText, !showLog && styles.tabTextActive]}>
          ⏱️ New Entry
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, showLog && styles.tabActive]}
        onPress={() => setShowLog(true)}
      >
        <Text style={[styles.tabText, showLog && styles.tabTextActive]}>
          📋 Log ({entryCount})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: colors.primaryDark,
  },
  tabText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.text,
  },
});
