import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Alert, Platform } from "react-native";
import { colors, typography, spacing, radii } from "../../../styles/theme";
import { Button } from "../../common/Button";
import { TypeaheadInput } from "../../common/TypeaheadInput";
import { TimeCard } from "../../common/TimeCard";
import { formatTime, parseTimeInput, calculateResultTime } from "../../../utils/timeUtils";
import { distancesMeters, distancesYards, efforts } from "../../../constants";

/**
 * Form for logging swim times
 * @param {Object} props
 * @param {Array} props.swimmers - Available swimmers
 * @param {Array} props.strokes - Available strokes
 * @param {string} props.unit - Distance unit ('m' or 'y')
 * @param {Function} props.onSubmit - Callback with time data
 * @param {Function} [props.onCancel] - Cancel callback
 */
export const TimeForm = ({
  swimmers = [],
  strokes = [],
  unit = "m",
  onSubmit,
  onCancel,
}) => {
  const [swimmerId, setSwimmerId] = useState(null);
  const [swimmerName, setSwimmerName] = useState("");
  const [strokeId, setStrokeId] = useState(null);
  const [strokeName, setStrokeName] = useState("");
  const [distance, setDistance] = useState("");
  const [effort, setEffort] = useState("80%");
  const [bestTimeInput, setBestTimeInput] = useState("");

  // Derived values
  const effortPercent = (parseInt(effort) || 80) / 100;
  const bestSeconds = parseTimeInput(bestTimeInput);
  const resultSeconds = calculateResultTime(bestSeconds, effortPercent);

  const handleSwimmerSelect = (swimmer) => {
    setSwimmerId(swimmer.id);
  };

  const handleStrokeSelect = (stroke) => {
    setStrokeId(stroke.id);
  };

  const handleSubmit = async () => {
    if (!swimmerId || !strokeId || !distance || bestSeconds == null) {
      const msg = "Please fill in all fields";
      Platform.OS === "web" ? window.alert(msg) : Alert.alert("Error", msg);
      return;
    }

    await onSubmit({
      swimmerId,
      strokeId,
      distance,
      timeSeconds: bestSeconds,
      resultSeconds,
      effort,
      date: new Date().toISOString(),
    });

    // Reset form
    setBestTimeInput("");
  };

  const clearForm = () => {
    setSwimmerId(null);
    setSwimmerName("");
    setStrokeId(null);
    setStrokeName("");
    setDistance("");
    setEffort("80%");
    setBestTimeInput("");
  };

  return (
    <View style={styles.form}>
      <TypeaheadInput
        label="Swimmer"
        value={swimmerName}
        onChangeText={setSwimmerName}
        objectOptions={swimmers}
        displayKey="name"
        valueKey="id"
        onSelect={handleSwimmerSelect}
        placeholder="Select swimmer..."
        zIndexValue={50}
      />

      <TypeaheadInput
        label="Stroke"
        value={strokeName}
        onChangeText={setStrokeName}
        objectOptions={strokes}
        displayKey="name"
        valueKey="id"
        onSelect={handleStrokeSelect}
        placeholder="Select stroke..."
        zIndexValue={40}
      />

      <TypeaheadInput
        label="Distance"
        value={distance}
        onChangeText={setDistance}
        options={unit === "m" ? distancesMeters : distancesYards}
        placeholder="Select distance..."
        zIndexValue={30}
      />

      <TypeaheadInput
        label="Effort Level"
        value={effort}
        onChangeText={setEffort}
        options={efforts}
        placeholder="Select effort..."
        zIndexValue={20}
      />

      <View style={[styles.field, { zIndex: 10 }]}>
        <Text style={styles.label}>Best Time</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 25.340 or 1:03.450"
          placeholderTextColor={colors.placeholder}
          value={bestTimeInput}
          onChangeText={setBestTimeInput}
        />
        <Text style={styles.hint}>
          Result (auto): {formatTime(resultSeconds)}
        </Text>
      </View>

      <View style={[styles.timeCards, { zIndex: 5 }]}>
        <TimeCard label="Best Time" value={formatTime(bestSeconds)} />
        <TimeCard
          label={`Result (${effort || "80%"})`}
          value={formatTime(resultSeconds)}
        />
      </View>

      <View style={[styles.buttonRow, { zIndex: 1 }]}>
        <Button title="Clear" variant="secondary" onPress={clearForm} flex={1} />
        <Button title="Log Time" variant="primary" onPress={handleSubmit} flex={2} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: { padding: spacing.lg },
  field: { marginBottom: spacing.xl, position: "relative" },
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
  hint: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 6,
  },
  timeCards: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  buttonRow: { flexDirection: "row", gap: spacing.md, marginTop: spacing.sm },
});
