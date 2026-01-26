import { useMemo } from "react";
import { View, Text, StyleSheet, Alert, Platform } from "react-native";
import { ScreenWrapper } from "../../src/components/layout/ScreenWrapper";
import { LogView } from "../../src/components/features/log/LogView";
import { useDataContext, useUnitPreferenceContext } from "../../src/context";
import { formatTime } from "../../src/utils/timeUtils";
import { colors, typography } from "../../src/styles/theme";

/**
 * Screen for viewing logged swim times
 */
export default function LogScreen() {
  const { times, swimmers, strokes, isLoading } = useDataContext();
  const { unit } = useUnitPreferenceContext();

  /**
   * Maps time entities to entry format expected by LogView
   */
  const entries = useMemo(() => {
    return times.times.map((time) => {
      const swimmer = swimmers.getSwimmerById(time.swimmerId);
      const stroke = strokes.getStrokeById(time.strokeId);
      return {
        id: time.id,
        name: swimmer?.name || "Unknown",
        stroke: stroke?.name || "Unknown",
        distance: time.distance,
        effort: time.effort || "100%",
        bestTime: formatTime(time.timeSeconds),
        resultTime: formatTime(time.resultSeconds || time.timeSeconds),
        bestSeconds: time.timeSeconds,
        resultSeconds: time.resultSeconds || time.timeSeconds,
        timestamp: time.date
          ? new Date(time.date).toLocaleString()
          : "No date",
      };
    });
  }, [times.times, swimmers, strokes]);

  /**
   * Clears all logged times after confirmation
   */
  const handleClearLog = () => {
    const doClear = async () => {
      await times.clearTimes();
      const msg = "All times cleared!";
      Platform.OS === "web" ? window.alert(msg) : Alert.alert("Success", msg);
    };

    if (Platform.OS === "web") {
      if (window.confirm("Delete all logged times?")) doClear();
    } else {
      Alert.alert("Clear Log", "Delete all logged times?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete All", style: "destructive", onPress: doClear },
      ]);
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <LogView entries={entries} unit={unit} onClearLog={handleClearLog} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: typography.sizes.l,
  },
});
