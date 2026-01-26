import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Alert, Platform } from "react-native";
import { colors, typography, spacing, radii } from "../../../styles/theme";
import { Button } from "../../common/Button";
import { MultiSelectTypeahead } from "../../common/MultiSelectTypeahead";

/**
 * Form for creating/editing training sessions
 * @param {Object} props
 * @param {Object} [props.training] - Existing training for editing
 * @param {Array} props.swimmers - Available swimmers
 * @param {Array} props.groups - Available groups
 * @param {Function} props.onSubmit - Callback with training data
 * @param {Function} [props.onCancel] - Cancel callback
 */
export const TrainingForm = ({
  training,
  swimmers = [],
  groups = [],
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(training?.name || "");
  const [swimmerIds, setSwimmerIds] = useState(training?.swimmerIds || []);
  const [groupIds, setGroupIds] = useState(training?.groupIds || []);
  const isEditing = !!training;

  useEffect(() => {
    if (training) {
      setName(training.name || "");
      setSwimmerIds(training.swimmerIds || []);
      setGroupIds(training.groupIds || []);
    }
  }, [training]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      const msg = "Please enter a training name";
      Platform.OS === "web" ? window.alert(msg) : Alert.alert("Error", msg);
      return;
    }
    await onSubmit({
      name: name.trim(),
      swimmerIds,
      groupIds,
      exercises: training?.exercises || [],
    });
    if (!isEditing) {
      setName("");
      setSwimmerIds([]);
      setGroupIds([]);
    }
  };

  return (
    <View style={styles.form}>
      <View style={styles.field}>
        <Text style={styles.label}>Training Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter training name..."
          placeholderTextColor={colors.placeholder}
          autoCapitalize="words"
        />
      </View>

      <MultiSelectTypeahead
        label="Assign Swimmers"
        options={swimmers}
        selectedIds={swimmerIds}
        onSelectionChange={setSwimmerIds}
        displayKey="name"
        valueKey="id"
        placeholder="Add swimmers..."
        zIndexValue={40}
      />

      <MultiSelectTypeahead
        label="Assign Groups"
        options={groups}
        selectedIds={groupIds}
        onSelectionChange={setGroupIds}
        displayKey="name"
        valueKey="id"
        placeholder="Add groups..."
        zIndexValue={30}
      />

      <View style={styles.buttonRow}>
        {onCancel && (
          <Button title="Cancel" variant="secondary" onPress={onCancel} flex={1} />
        )}
        <Button
          title={isEditing ? "Update Training" : "Add Training"}
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
