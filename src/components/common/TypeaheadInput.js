import React, { useState, useEffect, useMemo } from "react";
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
import {
  colors,
  typography,
  spacing,
  radii,
  shadows,
} from "../../styles/theme";

/**
 * Text input with autocomplete dropdown suggestions
 * Supports both string[] and object[] options
 * @param {Object} props
 * @param {string} props.label - Input field label
 * @param {string} props.value - Current input value
 * @param {Function} props.onChangeText - Text change handler (receives string)
 * @param {string[]} [props.options] - String autocomplete options
 * @param {Object[]} [props.objectOptions] - Object autocomplete options
 * @param {string} [props.valueKey='id'] - Key for object value
 * @param {string} [props.displayKey='name'] - Key for display text
 * @param {Function} [props.onSelect] - Selection handler (receives object if objectOptions)
 * @param {string} props.placeholder - Placeholder text
 * @param {number} props.zIndexValue - Z-index for dropdown layering
 */
export const TypeaheadInput = ({
  label,
  value,
  onChangeText,
  options = [],
  objectOptions,
  valueKey = "id",
  displayKey = "name",
  onSelect,
  placeholder,
  zIndexValue,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  // Normalize options to array of display strings
  const displayOptions = useMemo(() => {
    if (objectOptions) {
      return objectOptions.map((opt) => opt[displayKey] || "");
    }
    return options;
  }, [options, objectOptions, displayKey]);

  // Build lookup map for object options
  const optionMap = useMemo(() => {
    if (!objectOptions) return null;
    const map = {};
    objectOptions.forEach((opt) => {
      map[opt[displayKey]?.toLowerCase()] = opt;
    });
    return map;
  }, [objectOptions, displayKey]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter options based on input
  const filteredOptions = displayOptions.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  const showSuggestions =
    isFocused &&
    inputValue.length > 0 &&
    filteredOptions.length > 0 &&
    !displayOptions.some(
      (opt) => opt.toLowerCase() === inputValue.toLowerCase()
    );

  const showAllOptions = isFocused && inputValue.length === 0;
  const isShowingSuggestions = showSuggestions || showAllOptions;

  /**
   * Selects an option and closes the dropdown
   * @param {string} displayText - Selected display text
   */
  const handleSelect = (displayText) => {
    setInputValue(displayText);
    onChangeText(displayText);

    // Call onSelect with the full object if using objectOptions
    if (onSelect && optionMap) {
      const obj = optionMap[displayText.toLowerCase()];
      if (obj) {
        onSelect(obj);
      }
    }

    setIsFocused(false);
    Keyboard.dismiss();
  };

  /**
   * Updates input value and notifies parent
   * @param {string} text - New input text
   */
  const handleChangeText = (text) => {
    setInputValue(text);
    onChangeText(text);
  };

  /**
   * Handles input blur with delay for tap handling
   */
  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 200);
  };

  /**
   * Renders a single suggestion item
   * @param {string} option - Display text
   * @param {boolean} isFiltered - Highlight matching text
   */
  const renderSuggestionItem = (option, isFiltered = false) => (
    <TouchableOpacity
      key={option}
      style={styles.suggestionItem}
      onPress={() => handleSelect(option)}
      activeOpacity={0.7}
    >
      {isFiltered ? (
        <Text style={styles.suggestionText}>
          {option.split(new RegExp(`(${inputValue})`, "gi")).map((part, i) => (
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
            {displayOptions.map((option) => renderSuggestionItem(option, false))}
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
    fontSize: typography.sizes.l,
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
    fontSize: typography.sizes.l,
  },
  suggestionHighlight: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
});
