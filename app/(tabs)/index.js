import { ScreenWrapper } from "../../src/components/layout/ScreenWrapper";
import { TimeForm } from "../../src/components/features";
import { useDataContext, useUnitPreferenceContext } from "../../src/context";
import { UnitToggle } from "../../src/components/features/UnitToggle";
import { View, Text, StyleSheet, Alert, Platform } from "react-native";
import { colors, typography, spacing } from "../../src/styles/theme";

/**
 * Screen for logging new swim times
 */
export default function NewEntryScreen() {
  const { swimmers, strokes, times, isLoading } = useDataContext();
  const { unit, setUnit } = useUnitPreferenceContext();

  /**
   * Handles time submission
   * @param {Object} data - Time entry data
   */
  const handleSubmit = async (data) => {
    const result = await times.addTime(data);
    if (result) {
      const msg = "Time logged!";
      Platform.OS === "web" ? window.alert(msg) : Alert.alert("Success", msg);
      return true;
    }
    return false;
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
      <View style={styles.toggleContainer}>
        <UnitToggle unit={unit} setUnit={setUnit} />
      </View>
      <TimeForm
        swimmers={swimmers.swimmers}
        strokes={strokes.strokes}
        unit={unit}
        onSubmit={handleSubmit}
      />
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
  toggleContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
});
