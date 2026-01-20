import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Keyboard,
  Platform,
} from "react-native";
import { colors, typography, spacing, radii, shadows } from "../../styles/theme";

export const TypeaheadInput = ({
  label,
  value,
  onChangeText,
  options,
  placeholder,
  zIndexValue,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter options based on input
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Show suggestions when focused and there's input or options to show
  const showSuggestions =
    isFocused &&
    inputValue.length > 0 &&
    filteredOptions.length > 0 &&
    !options.some((opt) => opt.toLowerCase() === inputValue.toLowerCase());

  // Show all options when input is empty and focused
  const showAllOptions = isFocused && inputValue.length === 0;

  const isShowingSuggestions = showSuggestions || showAllOptions;

  const handleSelect = (option) => {
    setInputValue(option);
    onChangeText(option);
    setIsFocused(false);
    Keyboard.dismiss();
  };

  const handleChangeText = (text) => {
    setInputValue(text);
    onChangeText(text);
  };

  const handleBlur = () => {
    // Delay to allow tap on suggestion
    setTimeout(() => setIsFocused(false), 200);
  };

  const renderSuggestionItem = (option, isFiltered = false) => (
    <TouchableOpacity
      key={option}
      style={styles.suggestionItem}
      onPress={() => handleSelect(option)}
      activeOpacity={0.7}
    >
      {isFiltered ? (
        <Text style={styles.suggestionText}>
          {option
            .split(new RegExp(`(${inputValue})`, "gi"))
            .map((part, i) => (
              <Text
                key={i}
                style={
                  part.toLowerCase() === inputValue.toLowerCase()
                    ? styles.suggestionHighlight
                    : null
                }
              >
                {part}
              </Text>
            ))}
        </Text>
      ) : (
        <Text style={styles.suggestionText}>{option}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.field,
        { zIndex: zIndexValue },
        Platform.OS === "android" && isShowingSuggestions && { elevation: 10 },
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]}
        value={inputValue}
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        autoCapitalize="words"
        autoCorrect={false}
      />
      {showSuggestions && (
        <View style={styles.suggestions}>
          <ScrollView
            style={styles.suggestionsScroll}
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled
          >
            {filteredOptions.map((option) =>
              renderSuggestionItem(option, true)
            )}
          </ScrollView>
        </View>
      )}
      {showAllOptions && (
        <View style={styles.suggestions}>
          <ScrollView
            style={styles.suggestionsScroll}
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled
          >
            {options.map((option) => renderSuggestionItem(option, false))}
          </ScrollView>
        </View>
      )}
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
  inputFocused: {
    borderColor: colors.borderFocused,
    backgroundColor: colors.inputFocusedBackground,
  },
  suggestions: {
    position: "absolute",
    top: 72,
    left: 0,
    right: 0,
    backgroundColor: colors.backgroundSuggestion,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "rgba(79,195,247,0.5)",
    zIndex: 9999,
    overflow: "hidden",
    ...shadows.suggestion,
  },
  suggestionsScroll: {
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.backgroundSuggestion,
  },
  suggestionText: {
    color: colors.text,
    fontSize: typography.sizes.lg,
  },
  suggestionHighlight: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
});
