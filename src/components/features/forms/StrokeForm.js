import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Alert, Platform } from "react-native";
import { colors, typography, spacing, radii } from "../../../styles/theme";
import { Button } from "../../common/Button";

/**
 * Form for creating/editing strokes
 * @param {Object} props
 * @param {Object} [props.stroke] - Existing stroke for editing
 * @param {Function} props.onSubmit - Callback with stroke data
 * @param {Function} [props.onCancel] - Cancel callback
 */
export const StrokeForm = ({ stroke, onSubmit, onCancel }) => {
  const [name, setName] = useState(stroke?.name || "");
  const isEditing = !!stroke;

  useEffect(() => {
    if (stroke) setName(stroke.name || "");
  }, [stroke]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      const msg = "Please enter a stroke name";
      Platform.OS === "web" ? window.alert(msg) : Alert.alert("Error", msg);
      return;
    }
    await onSubmit({ name: name.trim() });
    if (!isEditing) setName("");
  };

  return (
    <View style={styles.form}>
      <View style={styles.field}>
        <Text style={styles.label}>Stroke Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter stroke name..."
          placeholderTextColor={colors.placeholder}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.buttonRow}>
        {onCancel && (
          <Button title="Cancel" variant="secondary" onPress={onCancel} flex={1} />
        )}
        <Button
          title={isEditing ? "Update Stroke" : "Add Stroke"}
          variant="primary"
          onPress={handleSubmit}
          flex={onCancel ? 2 : 1}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: { padding: spacing.lg },
  field: { marginBottom: spacing.xl },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    padding: 14,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.borderLight,
    backgroundColor: colors.backgroundInput,
    color: colors.text,
    fontSize: typography.sizes.l,
    fontWeight: typography.weights.medium,
  },
  buttonRow: { flexDirection: "row", gap: spacing.md, marginTop: spacing.sm },
});
