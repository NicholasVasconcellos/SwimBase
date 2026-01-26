import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Alert, Platform } from "react-native";
import { colors, typography, spacing, radii } from "../../../styles/theme";
import { Button } from "../../common/Button";
import { TypeaheadInput } from "../../common/TypeaheadInput";

/**
 * Form for creating/editing groups
 * @param {Object} props
 * @param {Object} [props.group] - Existing group for editing
 * @param {Array} props.teams - Available teams
 * @param {Function} props.onSubmit - Callback with group data
 * @param {Function} [props.onCancel] - Cancel callback
 */
export const GroupForm = ({ group, teams = [], onSubmit, onCancel }) => {
  const [name, setName] = useState(group?.name || "");
  const [teamId, setTeamId] = useState(group?.teamId || null);
  const [teamName, setTeamName] = useState("");
  const isEditing = !!group;

  useEffect(() => {
    if (group) {
      setName(group.name || "");
      setTeamId(group.teamId || null);
      const team = teams.find((t) => t.id === group.teamId);
      setTeamName(team?.name || "");
    }
  }, [group, teams]);

  const handleTeamSelect = (team) => {
    setTeamId(team.id);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      const msg = "Please enter a group name";
      Platform.OS === "web" ? window.alert(msg) : Alert.alert("Error", msg);
      return;
    }
    await onSubmit({ name: name.trim(), teamId });
    if (!isEditing) {
      setName("");
      setTeamId(null);
      setTeamName("");
    }
  };

  return (
    <View style={styles.form}>
      <View style={styles.field}>
        <Text style={styles.label}>Group Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter group name..."
          placeholderTextColor={colors.placeholder}
          autoCapitalize="words"
        />
      </View>

      <TypeaheadInput
        label="Team (Optional)"
        value={teamName}
        onChangeText={setTeamName}
        objectOptions={teams}
        displayKey="name"
        valueKey="id"
        onSelect={handleTeamSelect}
        placeholder="Select team..."
        zIndexValue={40}
      />

      <View style={styles.buttonRow}>
        {onCancel && (
          <Button title="Cancel" variant="secondary" onPress={onCancel} flex={1} />
        )}
        <Button
          title={isEditing ? "Update Group" : "Add Group"}
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
