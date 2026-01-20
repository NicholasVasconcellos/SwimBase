import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors, typography, spacing, radii } from "../../styles/theme";
import {
  swimmers,
  strokes,
  distancesMeters,
  distancesYards,
  efforts,
} from "../../constants";
import { formatTime, parseTimeInput, calculateResultTime } from "../../utils/timeUtils";
import { TypeaheadInput } from "../common/TypeaheadInput";
import { TimeCard } from "../common/TimeCard";
import { Button } from "../common/Button";
import { UnitToggle } from "./UnitToggle";

export const EntryForm = ({ unit, setUnit, onSubmit }) => {
  const [name, setName] = useState("");
  const [stroke, setStroke] = useState("");
  const [distance, setDistance] = useState("");
  const [effort, setEffort] = useState("80%");
  const [bestTimeInput, setBestTimeInput] = useState("");

  // Derived values
  const effortPercent = (parseInt(effort) || 80) / 100;
  const bestSeconds = parseTimeInput(bestTimeInput);
  const resultSeconds = calculateResultTime(bestSeconds, effortPercent);

  const handleLog = async () => {
    const success = await onSubmit({
      name,
      stroke,
      distance,
      effort,
      bestTimeInput,
    });

    if (success) {
      setBestTimeInput("");
    }
  };

  const clearForm = () => {
    setName("");
    setStroke("");
    setDistance("");
    setEffort("80%");
    setBestTimeInput("");
  };

  return (
    <View style={styles.form}>
      <TypeaheadInput
        label="Swimmer"
        value={name}
        onChangeText={setName}
        options={swimmers}
        placeholder="Start typing name..."
        zIndexValue={50}
      />

      <TypeaheadInput
        label="Stroke"
        value={stroke}
        onChangeText={setStroke}
        options={strokes}
        placeholder="Start typing stroke..."
        zIndexValue={40}
      />

      <UnitToggle unit={unit} setUnit={setUnit} zIndexValue={35} />

      <TypeaheadInput
        label="Distance"
        value={distance}
        onChangeText={setDistance}
        options={unit === "m" ? distancesMeters : distancesYards}
        placeholder="Start typing distance..."
        zIndexValue={30}
      />

      <TypeaheadInput
        label="Effort Level"
        value={effort}
        onChangeText={setEffort}
        options={efforts}
        placeholder="Start typing effort..."
        zIndexValue={20}
      />

      {/* Best Time Input */}
      <View style={[styles.field, { zIndex: 10 }]}>
        <Text style={styles.label}>Best Time</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 25.340 or 1:03.450"
          placeholderTextColor={colors.placeholder}
          value={bestTimeInput}
          onChangeText={setBestTimeInput}
          keyboardType="default"
        />
        <Text style={styles.hint}>
          Result (auto): {formatTime(resultSeconds)}
        </Text>
      </View>

      {/* Time Display Cards */}
      <View style={[styles.timeCards, { zIndex: 5 }]}>
        <TimeCard label="Best Time" value={formatTime(bestSeconds)} />
        <TimeCard
          label={`Result (${effort || "80%"})`}
          value={formatTime(resultSeconds)}
        />
      </View>

      {/* Buttons */}
      <View style={[styles.buttonRow, { zIndex: 1 }]}>
        <Button
          title="Clear"
          variant="secondary"
          onPress={clearForm}
          flex={1}
        />
        <Button
          title="📝 Log Entry"
          variant="primary"
          onPress={handleLog}
          flex={2}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: spacing.lg,
  },
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
  input: {
    padding: 14,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.borderLight,
    backgroundColor: colors.backgroundInput,
    color: colors.text,
    fontSize: typography.sizes.lg,
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
  buttonRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
});
