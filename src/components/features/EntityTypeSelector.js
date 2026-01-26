import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { colors, typography, spacing, radii } from "../../styles/theme";

const ENTITY_TYPES = [
  { key: "swimmer", label: "Swimmer", icon: "🏊" },
  { key: "team", label: "Team", icon: "👥" },
  { key: "group", label: "Group", icon: "📁" },
  { key: "stroke", label: "Stroke", icon: "🌊" },
  { key: "training", label: "Training", icon: "📋" },
];

/**
 * Segmented control for selecting entity type
 * @param {Object} props
 * @param {string} props.selected - Currently selected entity key
 * @param {Function} props.onSelect - Selection callback
 */
export const EntityTypeSelector = ({ selected, onSelect }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ENTITY_TYPES.map((type) => (
          <TouchableOpacity
            key={type.key}
            style={[
              styles.segment,
              selected === type.key && styles.segmentActive,
            ]}
            onPress={() => onSelect(type.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{type.icon}</Text>
            <Text
              style={[
                styles.label,
                selected === type.key && styles.labelActive,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

/**
 * Returns list of entity type configs
 * @returns {Array}
 */
export const getEntityTypes = () => ENTITY_TYPES;

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  segment: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segmentActive: {
    backgroundColor: colors.unitActiveBackground,
    borderColor: colors.primary,
  },
  icon: {
    fontSize: typography.sizes.l,
    marginRight: spacing.xs,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
});
