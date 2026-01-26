# Plan 1: Multi-Entity Data Layer

## Overview
Restructure the app from a single flat entry type to a multi-entity data model supporting Teams, Groups, Strokes, Swimmers, Times, and Trainings with relationships.

**Next**: See [Plan 2: Query & List Explorer](./02-query-explorer.md)

---

## Data Model

```
Team           { id, name }
Group          { id, name, teamId }
Stroke         { id, name }
Swimmer        { id, name, teamIds[], groupIds[], birthDate }
Time           { id, swimmerId, strokeId, distance{value,unit}, timeSeconds, date }
Training       { id, name, createdAt, assignedTeamIds[], assignedGroupIds[], assignedSwimmerIds[], exercises[] }
Exercise       { name, strokeId, distance{value,unit}, sets, mode, intervalSeconds?, effortPercent? }
```

---

## Implementation Plan

### Phase 1: Storage & Data Layer Foundation

**Create new files:**

| File | Purpose |
|------|---------|
| `src/services/storage.js` | Generic AsyncStorage operations with keys per entity type |
| `src/services/migrations.js` | Schema versioning and migration from v1 (swimEntries) to v2 |
| `src/utils/idUtils.js` | ID generation: `{entityType}_{timestamp}_{random}` |

**Create entity hooks (each with: items, isLoading, add, update, remove, getById, getByIds):**

| File | Hook |
|------|------|
| `src/hooks/useTeams.js` | Teams CRUD |
| `src/hooks/useGroups.js` | Groups CRUD (filtered by teamId) |
| `src/hooks/useStrokes.js` | Strokes CRUD |
| `src/hooks/useSwimmers.js` | Swimmers CRUD with team/group relationships |
| `src/hooks/useTimes.js` | Times CRUD (replaces useEntries) |
| `src/hooks/useTrainings.js` | Trainings CRUD with embedded exercises |

**Modify:**
- `src/context/EntriesContext.js` → rename to `DataContext.js`, compose all entity hooks
- `src/context/AppProvider.js` → use new `DataProvider`

### Phase 2: UI Components - Entity Type Selector & Simple Forms

**Create:**

| File | Component |
|------|-----------|
| `src/components/common/SegmentedControl.js` | Horizontal entity type selector |
| `src/components/features/forms/EntityTypeSelector.js` | Selector with icons for: Time ⏱️, Swimmer 🏊, Team 👥, Group 📁, Stroke 🌊, Training 📋 |
| `src/components/features/forms/TeamForm.js` | Name input only |
| `src/components/features/forms/GroupForm.js` | Name + team selector |
| `src/components/features/forms/StrokeForm.js` | Name input only |

**Modify:**
- `src/components/common/TypeaheadInput.js` → support object options with `valueKey`/`displayKey` props

### Phase 3: Complex Entity Forms

**Create:**

| File | Component |
|------|-----------|
| `src/components/common/MultiSelect.js` | For selecting multiple teams/groups |
| `src/components/common/DatePicker.js` | For birthDate and time entry date |
| `src/components/features/forms/SwimmerForm.js` | Name, birthDate, multi-select teams/groups |
| `src/components/features/forms/TimeForm.js` | Swimmer selector, stroke selector, distance, time input, date |

### Phase 4: Training & Exercises

**Create:**

| File | Component |
|------|-----------|
| `src/components/features/forms/TrainingForm.js` | Name, assignments (teams/groups/swimmers), exercise list |
| `src/components/features/forms/ExerciseForm.js` | Stroke, distance, sets, mode toggle (interval/effort), conditional fields |

### Phase 5: Entry Page Restructuring

**Modify:**
- `app/(tabs)/index.js` → add EntityTypeSelector at top, render appropriate form based on selection
- `src/components/features/EntryForm.js` → refactor to delegate to specific form components

---

## Storage Keys

```javascript
const STORAGE_KEYS = {
  teams: "@swimtime/teams",
  groups: "@swimtime/groups",
  strokes: "@swimtime/strokes",
  swimmers: "@swimtime/swimmers",
  times: "@swimtime/times",
  trainings: "@swimtime/trainings",
  schemaVersion: "@swimtime/schemaVersion"
};
```

---

## Migration Strategy

1. Check schema version on app startup
2. If version 1 (or no version): migrate `swimEntries` data
   - Extract unique swimmer names → create Swimmer entities
   - **Pre-seed default strokes** (Freestyle, Backstroke, Breaststroke, Butterfly, Individual Medley)
   - Convert entries → Time entities with foreign keys
   - Backup old data to `swimEntries_backup_v1`
3. Set schema version to 2

---

## Design Decisions

### Default Data
- **Pre-seed default strokes** on first launch so users can start logging times immediately

### Exercise UI
- **Inline list with add/remove** - Exercises shown as expandable cards directly in the Training form

### Delete Behavior
- **Warn and allow** - Show warning with count of affected records, but allow deletion (orphan the references)

---

## Files Summary

### New Files (19 total)
```
src/services/storage.js
src/services/migrations.js
src/utils/idUtils.js
src/hooks/useTeams.js
src/hooks/useGroups.js
src/hooks/useStrokes.js
src/hooks/useSwimmers.js
src/hooks/useTimes.js
src/hooks/useTrainings.js
src/context/DataContext.js
src/components/common/SegmentedControl.js
src/components/common/MultiSelect.js
src/components/common/DatePicker.js
src/components/features/forms/EntityTypeSelector.js
src/components/features/forms/TeamForm.js
src/components/features/forms/GroupForm.js
src/components/features/forms/StrokeForm.js
src/components/features/forms/SwimmerForm.js
src/components/features/forms/TimeForm.js
src/components/features/forms/TrainingForm.js
src/components/features/forms/ExerciseForm.js
```

### Modified Files (5 total)
```
src/context/AppProvider.js
src/components/common/TypeaheadInput.js
src/components/features/EntryForm.js
app/(tabs)/index.js
src/constants/index.js
```

### Deprecated/Removed
```
src/hooks/useEntries.js → replaced by useTimes.js
src/context/EntriesContext.js → replaced by DataContext.js
```

---

## Verification

1. **Storage**: Add a Team, Group, Stroke, Swimmer, Time, Training → verify each persists in AsyncStorage
2. **Relationships**: Create Swimmer with team/group → verify IDs stored correctly
3. **Migration**: With existing swimEntries data, launch app → verify data migrated to new schema
4. **Forms**: Each entity type selector shows correct form with appropriate typeahead options
