import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
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
 * Typeahead input with multi-selection support
 * Displays selected items as removable chips
 * @param {Object} props
 * @param {string} props.label - Input field label
 * @param {Object[]} props.options - Available options [{id, name, ...}]
 * @param {string[]} props.selectedIds - Currently selected IDs
 * @param {Function} props.onSelectionChange - Callback with updated ID array
 * @param {string} [props.valueKey='id'] - Key for option ID
 * @param {string} [props.displayKey='name'] - Key for display text
 * @param {string} [props.placeholder] - Input placeholder
 * @param {number} [props.zIndexValue] - Z-index for dropdown
 */
export const MultiSelectTypeahead = ({
  label,
  options = [],
  selectedIds = [],
  onSelectionChange,
  valueKey = "id",
  displayKey = "name",
  placeholder = "Type to search...",
  zIndexValue = 1,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Build lookup map
  const optionMap = useMemo(() => {
    const map = {};
    options.forEach((opt) => {
      map[opt[valueKey]] = opt;
    });
    return map;
  }, [options, valueKey]);

  // Get selected objects for display
  const selectedItems = useMemo(() => {
    return selectedIds.map((id) => optionMap[id]).filter(Boolean);
  }, [selectedIds, optionMap]);

  // Filter unselected options by input
  const filteredOptions = useMemo(() => {
    const available = options.filter(
      (opt) => !selectedIds.includes(opt[valueKey])
    );
    if (!inputValue) return available;
    const lower = inputValue.toLowerCase();
    return available.filter((opt) =>
      opt[displayKey]?.toLowerCase().includes(lower)
    );
  }, [options, selectedIds, inputValue, valueKey, displayKey]);

  const showSuggestions = isFocused && filteredOptions.length > 0;

  /**
   * Adds item to selection
   * @param {Object} item
   */
  const handleSelect = (item) => {
    const newIds = [...selectedIds, item[valueKey]];
    onSelectionChange(newIds);
    setInputValue("");
  };

  /**
   * Removes item from selection
   * @param {string} id
   */
  const handleRemove = (id) => {
    const newIds = selectedIds.filter((sid) => sid !== id);
    onSelectionChange(newIds);
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 200);
  };

  /**
   * Renders a chip for selected item
   * @param {Object} item
   */
  const renderChip = (item) => (
    <View key={item[valueKey]} style={styles.chip}>
      <Text style={styles.chipText}>{item[displayKey]}</Text>
      <TouchableOpacity
        onPress={() => handleRemove(item[valueKey])}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.chipRemove}>×</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Renders suggestion item with optional highlight
   * @param {Object} option
   */
  const renderSuggestionItem = (option) => {
    const text = option[displayKey] || "";
    return (
      <TouchableOpacity
        key={option[valueKey]}
        style={styles.suggestionItem}
        onPress={() => handleSelect(option)}
        activeOpacity={0.7}
      >
        {inputValue ? (
          <Text style={styles.suggestionText}>
            {text.split(new RegExp(`(${inputValue})`, "gi")).map((part, i) => (
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
          <Text style={styles.suggestionText}>{text}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.field,
        { zIndex: zIndexValue },
        Platform.OS === "android" && showSuggestions && { elevation: 10 },
      ]}
    >
      <Text style={styles.label}>{label}</Text>

      {/* Selected chips */}
      {selectedItems.length > 0 && (
        <View style={styles.chipsContainer}>
          {selectedItems.map(renderChip)}
        </View>
      )}

      {/* Input */}
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]}
        value={inputValue}
        onChangeText={setInputValue}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        autoCapitalize="words"
        autoCorrect={false}
      />

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <View style={styles.suggestions}>
          <ScrollView
            style={styles.suggestionsScroll}
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled
          >
            {filteredOptions.map(renderSuggestionItem)}
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
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryDark,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chipText: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    marginRight: spacing.xs,
  },
  chipRemove: {
    color: colors.textMuted,
    fontSize: typography.sizes.l,
    fontWeight: typography.weights.bold,
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
    top: "100%",
    marginTop: spacing.xs,
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
