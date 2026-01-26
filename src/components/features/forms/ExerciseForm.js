import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Alert, Platform } from "react-native";
import { colors, typography, spacing, radii } from "../../../styles/theme";
import { Button } from "../../common/Button";
import { TypeaheadInput } from "../../common/TypeaheadInput";
import { distancesMeters, distancesYards, efforts } from "../../../constants";

const EXERCISE_MODES = ["Interval", "Effort"];

/**
 * Form for creating/editing exercises within a training
 * @param {Object} props
 * @param {Object} [props.exercise] - Existing exercise for editing
 * @param {Array} props.strokes - Available strokes
 * @param {string} props.unit - Distance unit ('m' or 'y')
 * @param {Function} props.onSubmit - Callback with exercise data
 * @param {Function} [props.onCancel] - Cancel callback
 */
export const ExerciseForm = ({
  exercise,
  strokes = [],
  unit = "m",
  onSubmit,
  onCancel,
}) => {
  const [strokeId, setStrokeId] = useState(exercise?.strokeId || null);
  const [strokeName, setStrokeName] = useState("");
  const [distance, setDistance] = useState(exercise?.distance || "");
  const [sets, setSets] = useState(exercise?.sets?.toString() || "1");
  const [mode, setMode] = useState(exercise?.mode || "Effort");
  const [interval, setInterval] = useState(exercise?.interval || "");
  const [effort, setEffort] = useState(exercise?.effort || "80%");
  const isEditing = !!exercise;

  useEffect(() => {
    if (exercise) {
      setStrokeId(exercise.strokeId || null);
      const stroke = strokes.find((s) => s.id === exercise.strokeId);
      setStrokeName(stroke?.name || "");
      setDistance(exercise.distance || "");
      setSets(exercise.sets?.toString() || "1");
      setMode(exercise.mode || "Effort");
      setInterval(exercise.interval || "");
      setEffort(exercise.effort || "80%");
    }
  }, [exercise, strokes]);

  const handleStrokeSelect = (stroke) => {
    setStrokeId(stroke.id);
  };

  const handleSubmit = async () => {
    if (!strokeId || !distance || !sets) {
      const msg = "Please fill in stroke, distance, and sets";
      Platform.OS === "web" ? window.alert(msg) : Alert.alert("Error", msg);
      return;
    }
    await onSubmit({
      strokeId,
      distance,
      sets: parseInt(sets) || 1,
      mode,
      interval: mode === "Interval" ? interval : null,
      effort: mode === "Effort" ? effort : null,
    });
    if (!isEditing) {
      setStrokeName("");
      setStrokeId(null);
      setDistance("");
      setSets("1");
      setInterval("");
    }
  };

  return (
    <View style={styles.form}>
      <TypeaheadInput
        label="Stroke"
        value={strokeName}
        onChangeText={setStrokeName}
        objectOptions={strokes}
        displayKey="name"
        valueKey="id"
        onSelect={handleStrokeSelect}
        placeholder="Select stroke..."
        zIndexValue={50}
      />

      <TypeaheadInput
        label="Distance"
        value={distance}
        onChangeText={setDistance}
        options={unit === "m" ? distancesMeters : distancesYards}
        placeholder="Select distance..."
        zIndexValue={40}
      />

      <View style={styles.field}>
        <Text style={styles.label}>Sets</Text>
        <TextInput
          style={styles.input}
          value={sets}
          onChangeText={setSets}
          placeholder="Number of sets"
          placeholderTextColor={colors.placeholder}
          keyboardType="numeric"
        />
      </View>

      <TypeaheadInput
        label="Mode"
        value={mode}
        onChangeText={setMode}
        options={EXERCISE_MODES}
        placeholder="Select mode..."
        zIndexValue={30}
      />

      {mode === "Interval" && (
        <View style={styles.field}>
          <Text style={styles.label}>Interval</Text>
          <TextInput
            style={styles.input}
            value={interval}
            onChangeText={setInterval}
            placeholder="e.g. 1:30"
            placeholderTextColor={colors.placeholder}
          />
        </View>
      )}

      {mode === "Effort" && (
        <TypeaheadInput
          label="Effort"
          value={effort}
          onChangeText={setEffort}
          options={efforts}
          placeholder="Select effort..."
          zIndexValue={20}
        />
      )}

      <View style={styles.buttonRow}>
        {onCancel && (
          <Button title="Cancel" variant="secondary" onPress={onCancel} flex={1} />
        )}
        <Button
          title={isEditing ? "Update Exercise" : "Add Exercise"}
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
