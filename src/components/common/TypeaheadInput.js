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
import {
  colors,
  typography,
  spacing,
  radii,
  shadows,
} from "../../styles/theme";

/**
 * Text input with autocomplete dropdown suggestions
 * @param {Object} props - Component props
 * @param {string} props.label - Input field label
 * @param {string} props.value - Current input value
 * @param {Function} props.onChangeText - Text change handler
 * @param {string[]} props.options - Available autocomplete options
 * @param {string} props.placeholder - Placeholder text
 * @param {number} props.zIndexValue - Z-index for dropdown layering
 * @returns {JSX.Element} The typeahead input component
 */
export const TypeaheadInput = ({
  label,
  value,
  onChangeText,
  options,
  placeholder,
  zIndexValue,
}) => {
  // Bool is focused for when the input text field is active (opposite is blurred)
  const [isFocused, setIsFocused] = useState(false);
  // Track what is displayed on the component
  // onChangeText callback updates parent 
  const [inputValue, setInputValue] = useState(value);

  // if Value changes update "InputValue"
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter options based on input
  // array.filter((element) => condition)
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase()),
  );

  // focused = text box is active
  // Bool showsuggestions, when it's focused and theres input
  const showSuggestions =
    isFocused &&
    inputValue.length > 0 &&
    filteredOptions.length > 0 &&
    !options.some((opt) => opt.toLowerCase() === inputValue.toLowerCase());

  // Show all options when input is empty and focused
  // Bool show All Options : when it's focused and no input yet
  const showAllOptions = isFocused && inputValue.length === 0;

  const isShowingSuggestions = showSuggestions || showAllOptions;

  /**
   * Selects an option and closes the dropdown
   * @param {string} option - Selected option text
   */
  const handleSelect = (option) => {
    setInputValue(option);
    onChangeText(option);
    setIsFocused(false);
    Keyboard.dismiss();
  };

  /**
   * Updates input value and notifies parent of text change
   * @param {string} text - New input text
   */
  const handleChangeText = (text) => {
    setInputValue(text);
    onChangeText(text);
  };

  /**
   * Handles input blur with delay to allow suggestion taps
   */
  const handleBlur = () => {
    // Delay to allow tap on suggestion
    setTimeout(() => setIsFocused(false), 200);
  };

  /**
   * Renders a single suggestion item with optional text highlighting
   * @param {string} option - Suggestion text
   * @param {boolean} [isFiltered=false] - Whether to highlight matching text
   * @returns {JSX.Element} The suggestion item
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
        // if isFocused use the inputfocused style (short circuit syntax)
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
      {/* Short circuit syntax for conditional rendering */}
      {showSuggestions && (
        <View style={styles.suggestions}>
          <ScrollView
            style={styles.suggestionsScroll}
            // Even when keyboard is open, register taps on other things
            // By default tapping outside dismissed the keyboard and ignores the tap
            keyboardShouldPersistTaps="always"
            // scroll is applied only to inner element
            nestedScrollEnabled
          >
            {filteredOptions.map((option) =>
              renderSuggestionItem(option, true),
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
