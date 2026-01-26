import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing, radii } from "../../src/styles/theme";
import { useEntriesContext } from "../../src/context";

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

export default function TabLayout() {
  const { entryCount } = useEntriesContext();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "New Entry",
          tabBarLabel: ({ focused }) => (
            <TabIcon label="New Entry" focused={focused} />
          ),
          tabBarIcon: () => <Text style={styles.tabIcon}>⏱️</Text>,
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: "Log",
          tabBarLabel: ({ focused }) => (
            <View style={styles.logLabelContainer}>
              <TabIcon label="Log" focused={focused} />
              <Badge count={entryCount} />
            </View>
          ),
          tabBarIcon: () => <Text style={styles.tabIcon}>📋</Text>,
        }}
      />
      <Tabs.Screen
        name="my-screen"
        options={{
          title: "My Screen",
          tabBarLabel: ({ focused }) => (
            <TabIcon label="My Screen" focused={focused} />
          ),
          tabBarIcon: () => <Text style={styles.tabIcon}>⭐</Text>,
        }}
      />
    </Tabs>
  );
}

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
