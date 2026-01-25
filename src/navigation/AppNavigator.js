import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View, StyleSheet } from "react-native";
import { colors, typography, spacing, radii } from "../styles/theme";
import { useEntriesContext } from "../context";
import { NewEntryScreen } from "../screens/NewEntryScreen";
import { LogScreen } from "../screens/LogScreen";

const Tab = createBottomTabNavigator();

const TabIcon = ({ label, focused }) => (
  <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
    {label}
  </Text>
);

const Badge = ({ count }) => {
  if (count === 0) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count}</Text>
    </View>
  );
};

export const AppNavigator = () => {
  const { entryCount } = useEntriesContext();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.textMuted,
        }}
      >
        <Tab.Screen
          name="NewEntry"
          component={NewEntryScreen}
          options={{
            tabBarLabel: ({ focused }) => (
              <TabIcon label="New Entry" focused={focused} />
            ),
            tabBarIcon: ({ focused }) => (
              <Text style={styles.tabIcon}>
                {focused ? "\u23F1\uFE0F" : "\u23F1\uFE0F"}
              </Text>
            ),
          }}
        />
        <Tab.Screen
          name="Log"
          component={LogScreen}
          options={{
            tabBarLabel: ({ focused }) => (
              <View style={styles.logLabelContainer}>
                <TabIcon label="Log" focused={focused} />
                <Badge count={entryCount} />
              </View>
            ),
            tabBarIcon: ({ focused }) => (
              <Text style={styles.tabIcon}>
                {focused ? "\uD83D\uDCCB" : "\uD83D\uDCCB"}
              </Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.backgroundSecondary,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    height: 70,
  },
  tabLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
  },
  tabLabelActive: {
    color: colors.text,
  },
  tabIcon: {
    fontSize: 20,
  },
  logLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  badge: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: {
    color: colors.text,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
});
