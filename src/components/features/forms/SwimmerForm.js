import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Alert, Platform } from "react-native";
import { colors, typography, spacing, radii } from "../../../styles/theme";
import { Button } from "../../common/Button";
import { MultiSelectTypeahead } from "../../common/MultiSelectTypeahead";

/**
 * Form for creating/editing swimmers
 * @param {Object} props
 * @param {Object} [props.swimmer] - Existing swimmer for editing
 * @param {Array} props.teams - Available teams
 * @param {Array} props.groups - Available groups
 * @param {Function} props.onSubmit - Callback with swimmer data
 * @param {Function} [props.onCancel] - Cancel callback
 */
export const SwimmerForm = ({
  swimmer,
  teams = [],
  groups = [],
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(swimmer?.name || "");
  const [birthDate, setBirthDate] = useState(swimmer?.birthDate || "");
  const [teamIds, setTeamIds] = useState(swimmer?.teamIds || []);
  const [groupIds, setGroupIds] = useState(swimmer?.groupIds || []);
  const isEditing = !!swimmer;

  useEffect(() => {
    if (swimmer) {
      setName(swimmer.name || "");
      setBirthDate(swimmer.birthDate || "");
      setTeamIds(swimmer.teamIds || []);
      setGroupIds(swimmer.groupIds || []);
    }
  }, [swimmer]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      const msg = "Please enter a swimmer name";
      Platform.OS === "web" ? window.alert(msg) : Alert.alert("Error", msg);
      return;
    }
    await onSubmit({
      name: name.trim(),
      birthDate: birthDate || null,
      teamIds,
      groupIds,
    });
    if (!isEditing) {
      setName("");
      setBirthDate("");
      setTeamIds([]);
      setGroupIds([]);
    }
  };

  return (
    <View style={styles.form}>
      <View style={styles.field}>
        <Text style={styles.label}>Swimmer Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter swimmer name..."
          placeholderTextColor={colors.placeholder}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Birth Date (Optional)</Text>
        <TextInput
          style={styles.input}
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.placeholder}
        />
      </View>

      <MultiSelectTypeahead
        label="Teams"
        options={teams}
        selectedIds={teamIds}
        onSelectionChange={setTeamIds}
        displayKey="name"
        valueKey="id"
        placeholder="Add teams..."
        zIndexValue={40}
      />

      <MultiSelectTypeahead
        label="Groups"
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
          title={isEditing ? "Update Swimmer" : "Add Swimmer"}
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
