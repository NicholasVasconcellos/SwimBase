import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
  Keyboard,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const swimmers = [];

const strokes = [
  "Freestyle",
  "Backstroke",
  "Breaststroke",
  "Butterfly",
  "Individual Medley",
];

const distancesMeters = ["50", "100", "200", "400", "800", "1500"];
const distancesYards = ["25", "50", "100", "200", "500", "1000", "1650"];

const efforts = ["50%", "60%", "70%", "80%", "90%", "100%"];

const referenceTimes = {};

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "--";
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(3);
    return `${mins}:${secs.padStart(6, "0")}`;
  }
  return seconds.toFixed(3);
};

const parseTimeInput = (input) => {
  if (!input) return null;
  if (input.includes(":")) {
    const [mins, secs] = input.split(":");
    return parseFloat(mins) * 60 + parseFloat(secs);
  }
  return parseFloat(input);
};

// Helper to extract numeric distance value (strips 'm' or 'y' suffix)
const getDistanceValue = (distance) => {
  if (!distance) return distance;
  return distance.toString().replace(/[my]$/i, "");
};

// Typeahead Input Component
const TypeaheadInput = ({
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
        placeholderTextColor="rgba(255,255,255,0.4)"
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
            {filteredOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.suggestionItem}
                onPress={() => handleSelect(option)}
                activeOpacity={0.7}
              >
                <Text style={styles.suggestionText}>
                  {/* Highlight matching part */}
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
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      {/* Show all options when input is empty and focused */}
      {showAllOptions && (
        <View style={styles.suggestions}>
          <ScrollView
            style={styles.suggestionsScroll}
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled
          >
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.suggestionItem}
                onPress={() => handleSelect(option)}
                activeOpacity={0.7}
              >
                <Text style={styles.suggestionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default function App() {
  const [name, setName] = useState("");
  const [stroke, setStroke] = useState("");
  const [distance, setDistance] = useState("");
  const [effort, setEffort] = useState("80%");
  const [bestTimeInput, setBestTimeInput] = useState("");
  const [entries, setEntries] = useState([]);
  const [showLog, setShowLog] = useState(false);
  const [unit, setUnit] = useState("m"); // 'm' for meters, 'y' for yards

  // Load saved entries and preferences on app start
  useEffect(() => {
    loadEntries();
    loadUnit();
  }, []);

  // Save unit preference when it changes
  useEffect(() => {
    saveUnit(unit);
  }, [unit]);

  const loadEntries = async () => {
    try {
      const saved = await AsyncStorage.getItem("swimEntries");
      if (saved) {
        setEntries(JSON.parse(saved));
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.log("Error loading entries:", error);
    }
  };

  const saveEntries = async (newEntries) => {
    try {
      await AsyncStorage.setItem("swimEntries", JSON.stringify(newEntries));
    } catch (error) {
      console.log("Error saving entries:", error);
    }
  };

  const loadUnit = async () => {
    try {
      const saved = await AsyncStorage.getItem("unitPreference");
      if (saved) {
        setUnit(saved);
      }
    } catch (error) {
      console.log("Error loading unit preference:", error);
    }
  };

  const saveUnit = async (unitValue) => {
    try {
      await AsyncStorage.setItem("unitPreference", unitValue);
    } catch (error) {
      console.log("Error saving unit preference:", error);
    }
  };

  const effortPercent = (parseInt(effort) || 80) / 100;
  const bestSeconds = parseTimeInput(bestTimeInput);
  const resultSeconds =
    bestSeconds != null && !isNaN(bestSeconds)
      ? bestSeconds + bestSeconds * (1 - effortPercent)
      : null;

  const handleLog = async () => {
    if (!name || !stroke || !distance || !bestTimeInput) {
      if (Platform.OS === 'web') {
        window.alert("Please fill in all fields");
      } else {
        Alert.alert("Missing Fields", "Please fill in all fields");
      }
      return;
    }

    const bestSeconds = parseTimeInput(bestTimeInput);
    if (bestSeconds == null || isNaN(bestSeconds)) {
      if (Platform.OS === 'web') {
        window.alert("Please enter a valid time (e.g., 25.340 or 1:03.450)");
      } else {
        Alert.alert(
          "Invalid Best Time",
          "Please enter a valid time (e.g., 25.340 or 1:03.450)"
        );
      }
      return;
    }

    const effortPercent = (parseInt(effort) || 80) / 100;
    const resultSeconds = bestSeconds + bestSeconds * (1 - effortPercent);

    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      name,
      stroke,
      distance,
      effort,
      bestTime: formatTime(bestSeconds),
      resultTime: formatTime(resultSeconds),
      bestSeconds,
      resultSeconds,
    };

    const newEntries = [newEntry, ...entries];
    setEntries(newEntries);
    await saveEntries(newEntries);
    setBestTimeInput("");

    if (Platform.OS === 'web') {
      window.alert("Entry logged!");
    } else {
      Alert.alert("Success", "Entry logged!");
    }
  };

  const clearLog = async () => {
    // Handle web platform differently since Alert.alert doesn't work on web
    if (Platform.OS === 'web') {
      const confirmed = window.confirm("Are you sure you want to delete all entries?");
      if (confirmed) {
        try {
          setEntries([]);
          await saveEntries([]);
          window.alert("All entries cleared!");
        } catch (error) {
          window.alert("Failed to clear entries: " + error.message);
        }
      }
    } else {
      // Native platforms use Alert.alert
      Alert.alert(
        "Clear Log",
        "Are you sure you want to delete all entries?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete All",
            style: "destructive",
            onPress: async () => {
              try {
                setEntries([]);
                await saveEntries([]);
                Alert.alert("Success", "All entries cleared!");
              } catch (error) {
                Alert.alert("Error", "Failed to clear entries: " + error.message);
              }
            },
          },
        ],
        { cancelable: true }
      );
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0c1929" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🏊</Text>
        <Text style={styles.title}>Swim Time Logger</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, !showLog && styles.tabActive]}
          onPress={() => setShowLog(false)}
        >
          <Text style={[styles.tabText, !showLog && styles.tabTextActive]}>
            ⏱️ New Entry
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, showLog && styles.tabActive]}
          onPress={() => setShowLog(true)}
        >
          <Text style={[styles.tabText, showLog && styles.tabTextActive]}>
            📋 Log ({entries.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        {!showLog ? (
          /* Entry Form */
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

            {/* Unit Toggle */}
            <View style={[styles.field, { zIndex: 35 }]}>
              <Text style={styles.label}>Distance Unit</Text>
              <View style={styles.unitToggle}>
                <TouchableOpacity
                  style={[
                    styles.unitButton,
                    unit === "m" && styles.unitButtonActive,
                  ]}
                  onPress={() => setUnit("m")}
                >
                  <Text
                    style={[
                      styles.unitButtonText,
                      unit === "m" && styles.unitButtonTextActive,
                    ]}
                  >
                    Meters
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.unitButton,
                    unit === "y" && styles.unitButtonActive,
                  ]}
                  onPress={() => setUnit("y")}
                >
                  <Text
                    style={[
                      styles.unitButtonText,
                      unit === "y" && styles.unitButtonTextActive,
                    ]}
                  >
                    Yards
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

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
                placeholderTextColor="rgba(255,255,255,0.4)"
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
              <View style={styles.timeCard}>
                <Text style={styles.timeLabel}>Best Time</Text>
                <Text style={styles.timeValue}>{formatTime(bestSeconds)}</Text>
              </View>
              <View style={styles.timeCard}>
                <Text style={styles.timeLabel}>Result ({effort || "80%"})</Text>
                <Text style={styles.timeValue}>
                  {formatTime(resultSeconds)}
                </Text>
              </View>
            </View>

            {/* Buttons */}
            <View style={[styles.buttonRow, { zIndex: 1 }]}>
              <TouchableOpacity
                style={styles.clearFormButton}
                onPress={clearForm}
              >
                <Text style={styles.clearFormButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logButton} onPress={handleLog}>
                <Text style={styles.logButtonText}>📝 Log Entry</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Log View */
          <View style={styles.logContainer}>
            {entries.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📋</Text>
                <Text style={styles.emptyText}>No entries yet</Text>
                <Text style={styles.emptySubtext}>
                  Log your first swim time!
                </Text>
              </View>
            ) : (
              <>
                {entries.map((entry) => (
                  <View key={entry.id} style={styles.entryCard}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryName}>{entry.name}</Text>
                      <Text style={styles.entryResult}>{entry.resultTime}</Text>
                    </View>
                    <Text style={styles.entryEvent}>
                      {getDistanceValue(entry.distance)}{unit} {entry.stroke} @{" "}
                      {entry.effort}
                    </Text>
                    <View style={styles.entryFooter}>
                      <Text style={styles.entryTimestamp}>
                        {entry.timestamp}
                      </Text>
                      <Text style={styles.entryTarget}>
                        Best: {entry.bestTime}
                      </Text>
                    </View>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearLog}
                  activeOpacity={0.7}
                >
                  <Text style={styles.clearButtonText}>🗑️ Clear Log</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* Extra padding at bottom for keyboard */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0c1929",
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4fc3f7",
  },
  tabs: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#0288d1",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.6)",
  },
  tabTextActive: {
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    // Don't use overflow: hidden here
  },
  form: {
    padding: 16,
  },
  field: {
    marginBottom: 20,
    position: "relative",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  inputFocused: {
    borderColor: "#4fc3f7",
    backgroundColor: "rgba(79,195,247,0.1)",
  },
  unitToggle: {
    flexDirection: "row",
    gap: 8,
  },
  unitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  unitButtonActive: {
    borderColor: "#4fc3f7",
    backgroundColor: "rgba(79,195,247,0.2)",
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.6)",
  },
  unitButtonTextActive: {
    color: "#4fc3f7",
  },
  hint: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginTop: 6,
  },
  suggestions: {
    position: "absolute",
    top: 72,
    left: 0,
    right: 0,
    backgroundColor: "#1a3a5c", // Fully opaque background
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(79,195,247,0.5)",
    zIndex: 9999,
    elevation: 20, // Higher elevation for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    overflow: "hidden",
  },
  suggestionsScroll: {
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    backgroundColor: "#1a3a5c", // Ensure each item has opaque background
  },
  suggestionText: {
    color: "#fff",
    fontSize: 16,
  },
  suggestionHighlight: {
    color: "#4fc3f7",
    fontWeight: "700",
  },
  timeCards: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  timeCard: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  timeLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  timeValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4fc3f7",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  clearFormButton: {
    flex: 1,
    padding: 18,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  clearFormButtonText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    fontWeight: "600",
  },
  logButton: {
    flex: 2,
    padding: 18,
    borderRadius: 16,
    backgroundColor: "#00c853",
    alignItems: "center",
  },
  logButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  logContainer: {
    padding: 16,
  },
  entryCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  entryName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  entryResult: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4fc3f7",
  },
  entryEvent: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 8,
  },
  entryFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  entryTimestamp: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
  },
  entryTarget: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.4)",
  },
  clearButton: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255,82,82,0.3)",
    backgroundColor: "rgba(255,82,82,0.1)",
    alignItems: "center",
    marginTop: 8,
  },
  clearButtonText: {
    color: "#ff5252",
    fontSize: 14,
    fontWeight: "600",
  },
});
