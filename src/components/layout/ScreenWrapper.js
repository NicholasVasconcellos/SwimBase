import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { colors, spacing } from "../../styles/theme";
import { Header } from "./Header";

export const ScreenWrapper = ({ children }) => {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        {children}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {},
  bottomPadding: {
    height: spacing.xxl,
  },
});
