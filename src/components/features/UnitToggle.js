import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, typography, spacing, radii } from "../../styles/theme";

export const UnitToggle = ({ unit, setUnit, zIndexValue = 35 }) => {
  return (
    <View style={[styles.field, { zIndex: zIndexValue }]}>
      <Text style={styles.label}>Distance Unit</Text>
      <View style={styles.unitToggle}>
        <TouchableOpacity
          style={[styles.unitButton, unit === "m" && styles.unitButtonActive]}
          onPress={() => setUnit("m")}
        >
          <Text
            style={[
              styles.unitButtonText,
              unit === "m" && styles.unitButtonTextActive,
            ]}
          >
            Meters
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.unitButton, unit === "y" && styles.unitButtonActive]}
          onPress={() => setUnit("y")}
        >
          <Text
            style={[
              styles.unitButtonText,
              unit === "y" && styles.unitButtonTextActive,
            ]}
          >
            Yards
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.xl,
    position: "relative",
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  unitToggle: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  unitButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.borderLight,
    backgroundColor: colors.backgroundInput,
    alignItems: "center",
  },
  unitButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.unitActiveBackground,
  },
  unitButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
  },
  unitButtonTextActive: {
    color: colors.primary,
  },
});
