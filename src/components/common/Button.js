import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, typography, spacing, radii } from "../../styles/theme";

const VARIANTS = {
  primary: {
    button: {
      backgroundColor: colors.success,
    },
    text: {
      color: colors.text,
      fontSize: typography.sizes.xl,
      fontWeight: typography.weights.bold,
    },
  },
  secondary: {
    button: {
      backgroundColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
    },
    text: {
      color: colors.textSecondary,
      fontSize: typography.sizes.lg,
      fontWeight: typography.weights.semibold,
    },
  },
  danger: {
    button: {
      borderWidth: 2,
      borderColor: colors.dangerLight,
      backgroundColor: colors.dangerBackground,
    },
    text: {
      color: colors.danger,
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.semibold,
    },
  },
};

export const Button = ({
  title,
  onPress,
  variant = "primary",
  style,
  textStyle,
  flex,
}) => {
  const variantStyles = VARIANTS[variant] || VARIANTS.primary;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles.button,
        flex && { flex },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, variantStyles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: spacing.xl - 2,
    borderRadius: radii.lg,
    alignItems: "center",
  },
  text: {
    color: colors.text,
  },
});
