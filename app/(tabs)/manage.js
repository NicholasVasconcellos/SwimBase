import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import { ScreenWrapper } from "../../src/components/layout/ScreenWrapper";
import { useDataContext, useUnitPreferenceContext } from "../../src/context";
import { colors, typography, spacing, radii } from "../../src/styles/theme";
import {
  EntityTypeSelector,
  TeamForm,
  GroupForm,
  StrokeForm,
  SwimmerForm,
  TrainingForm,
} from "../../src/components/features";

/**
 * Screen for managing entities (teams, groups, strokes, swimmers, trainings)
 */
export default function ManageScreen() {
  const [entityType, setEntityType] = useState("swimmer");
  const [editingItem, setEditingItem] = useState(null);
  const { unit } = useUnitPreferenceContext();

  const {
    teams,
    groups,
    strokes,
    swimmers,
    trainings,
    isLoading,
  } = useDataContext();

  /**
   * Gets list of entities for current type
   */
  const getEntities = () => {
    switch (entityType) {
      case "swimmer": return swimmers.swimmers;
      case "team": return teams.teams;
      case "group": return groups.groups;
      case "stroke": return strokes.strokes;
      case "training": return trainings.trainings;
      default: return [];
    }
  };

  /**
   * Handles form submission for add/edit
   */
  const handleSubmit = async (data) => {
    let result;
    switch (entityType) {
      case "swimmer":
        result = editingItem
          ? await swimmers.updateSwimmer(editingItem.id, data)
          : await swimmers.addSwimmer(data);
        break;
      case "team":
        result = editingItem
          ? await teams.updateTeam(editingItem.id, data)
          : await teams.addTeam(data);
        break;
      case "group":
        result = editingItem
          ? await groups.updateGroup(editingItem.id, data)
          : await groups.addGroup(data);
        break;
      case "stroke":
        result = editingItem
          ? await strokes.updateStroke(editingItem.id, data)
          : await strokes.addStroke(data);
        break;
      case "training":
        result = editingItem
          ? await trainings.updateTraining(editingItem.id, data)
          : await trainings.addTraining(data);
        break;
    }

    if (result) {
      setEditingItem(null);
      const msg = editingItem ? "Updated!" : "Added!";
      Platform.OS === "web" ? window.alert(msg) : Alert.alert("Success", msg);
    }
  };

  /**
   * Confirms and deletes an entity
   */
  const handleDelete = (item) => {
    const doDelete = async () => {
      switch (entityType) {
        case "swimmer": await swimmers.removeSwimmer(item.id); break;
        case "team": await teams.removeTeam(item.id); break;
        case "group": await groups.removeGroup(item.id); break;
        case "stroke": await strokes.removeStroke(item.id); break;
        case "training": await trainings.removeTraining(item.id); break;
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm(`Delete "${item.name}"?`)) doDelete();
    } else {
      Alert.alert("Delete", `Delete "${item.name}"?`, [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: doDelete },
      ]);
    }
  };

  /**
   * Renders form based on entity type
   */
  const renderForm = () => {
    const props = {
      onSubmit: handleSubmit,
      onCancel: editingItem ? () => setEditingItem(null) : undefined,
    };

    switch (entityType) {
      case "swimmer":
        return (
          <SwimmerForm
            {...props}
            swimmer={editingItem}
            teams={teams.teams}
            groups={groups.groups}
          />
        );
      case "team":
        return <TeamForm {...props} team={editingItem} />;
      case "group":
        return <GroupForm {...props} group={editingItem} teams={teams.teams} />;
      case "stroke":
        return <StrokeForm {...props} stroke={editingItem} />;
      case "training":
        return (
          <TrainingForm
            {...props}
            training={editingItem}
            swimmers={swimmers.swimmers}
            groups={groups.groups}
          />
        );
      default:
        return null;
    }
  };

  /**
   * Renders list item for an entity
   */
  const renderItem = (item) => (
    <View key={item.id} style={styles.listItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.itemActions}>
        <TouchableOpacity
          onPress={() => setEditingItem(item)}
          style={styles.actionBtn}
        >
          <Text style={styles.editBtn}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item)}
          style={styles.actionBtn}
        >
          <Text style={styles.deleteBtn}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const entities = getEntities();

  return (
    <ScreenWrapper>
      <ScrollView keyboardShouldPersistTaps="handled">
        <EntityTypeSelector selected={entityType} onSelect={setEntityType} />

        {renderForm()}

        <View style={styles.listSection}>
          <Text style={styles.listHeader}>
            {entityType.charAt(0).toUpperCase() + entityType.slice(1)}s ({entities.length})
          </Text>
          {entities.length === 0 ? (
            <Text style={styles.emptyText}>No {entityType}s yet</Text>
          ) : (
            entities.map(renderItem)
          )}
        </View>
      </ScrollView>
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
  listSection: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  listHeader: {
    fontSize: typography.sizes.l,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.backgroundCard,
    borderRadius: radii.sm,
    marginBottom: spacing.sm,
  },
  itemName: {
    color: colors.text,
    fontSize: typography.sizes.l,
    flex: 1,
  },
  itemActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  editBtn: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  deleteBtn: {
    color: colors.danger,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: typography.sizes.md,
    textAlign: "center",
    paddingVertical: spacing.xl,
  },
});
