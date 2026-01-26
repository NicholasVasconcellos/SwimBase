# Plan 2: Query & List Explorer

## Overview
Build a multi-purpose query page that pulls data from the database and displays results in a filterable list.

**Prerequisite**: [Plan 1: Multi-Entity Data Layer](./01-multi-entity-data.md)

---

## Data Model

```javascript
// Filter object
{
  id: string,
  entityType: 'teams' | 'groups' | 'strokes' | 'swimmers' | 'times',
  entityId: string,       // ID of selected entity
  entityName: string,     // Display name
  mode: 'include' | 'exclude',
  icon: string            // Emoji for display
}

// Query state
{
  activeEntity: string,   // What we're viewing (default: 'times')
  filters: Filter[]
}
```

---

## Implementation Phases

### Phase 1: Core Query Hook
**File**: `src/hooks/useExplorer.js`

Central state manager handling Subject and Filters:
- `activeEntity`: Current entity type to display (default: Times)
- `filters[]`: Array of filter objects
- `filteredResults`: Memoized selector applying Include/Exclude logic
- Cross-entity resolution (e.g., filter Times by Team → resolve Swimmers in Team first)

**Resolution Algorithm**:
```
Filter Times by Team:  Team → Swimmers (where teamId matches) → Times (where swimmerId matches)
Filter Times by Group: Group → Swimmers (where groupIds includes) → Times
Filter Swimmers by Team: Team → Swimmers (where teamId matches)
```

**File**: `src/utils/filterUtils.js`
- `resolveFilter(targetEntity, filter, entityMaps)` → Set of matching IDs
- `applyFilters(activeEntity, filters, entityMaps)` → Filtered array

### Phase 2: Common UI Components
| File | Component | Purpose |
|------|-----------|---------|
| `src/components/common/Pill.js` | Pill | Base pressable chip with icon + label |
| `src/components/common/IconButton.js` | IconButton | Circle button with icon |
| `src/components/common/Modal.js` | Modal | Base modal wrapper |

### Phase 3: Explorer Header Components
| File | Component | UI Behavior |
|------|-----------|-------------|
| `src/components/features/explorer/SubjectPill.js` | SubjectPill | First icon, tap opens picker to change entity type |
| `src/components/features/explorer/FilterPill.js` | FilterPill | Chip with icon, green/red border (Include/Exclude), entity name. Tap to toggle mode, long-press to remove |
| `src/components/features/explorer/AddFilterButton.js` | AddFilterButton | (+) icon to add new filter |
| `src/components/features/explorer/ExplorerHeader.js` | ExplorerHeader | Horizontal ScrollView composing all pills |

**Header Layout**:
```
┌──────────────────────────────────────────────────────────┐
│ [⏱️ Times ▼] [👥 Tigers ✓] [📁 Senior ✗] [+]           │
│   Subject      Include       Exclude      Add            │
└──────────────────────────────────────────────────────────┘
```

### Phase 4: Query Builder Modal
**File**: `src/components/features/explorer/QueryBuilderModal.js`

3-step wizard flow:

| Step | Component | UI |
|------|-----------|-----|
| 1 | EntityPicker | Grid of icons: Team 👥, Group 📁, Stroke 🌊, Swimmer 🏊, Date 📅 |
| 2 | ValueSelector | List/typeahead to pick specific instance |
| 3 | ModeToggle | Switch for Include ✅ vs Exclude 🚫 |

### Phase 5: Results Display
| File | Purpose |
|------|---------|
| `src/components/features/explorer/ResultsList.js` | FlatList rendering entity-specific cards |
| `src/components/features/explorer/ResultCard.js` | Generic card delegating to TimeCard, SwimmerCard, etc. |

### Phase 6: Screen & Navigation
**File**: `app/(tabs)/explorer.js` (rename `my-screen.js`)

Update `app/(tabs)/_layout.js`:
```javascript
<Tabs.Screen
  name="explorer"
  options={{
    title: "Explorer",
    tabBarIcon: () => <Text>🔍</Text>,
  }}
/>
```

---

## File Summary

### New Files (12)
```
src/hooks/useExplorer.js
src/utils/filterUtils.js
src/components/common/Pill.js
src/components/common/IconButton.js
src/components/common/Modal.js
src/components/features/explorer/index.js
src/components/features/explorer/ExplorerHeader.js
src/components/features/explorer/SubjectPill.js
src/components/features/explorer/FilterPill.js
src/components/features/explorer/AddFilterButton.js
src/components/features/explorer/QueryBuilderModal.js
src/components/features/explorer/ResultsList.js
```

### Modified Files (3)
```
app/(tabs)/my-screen.js → explorer.js (rename)
app/(tabs)/_layout.js (update tab config)
src/styles/theme.js (add filter colors)
```

---

## Theme Additions

```javascript
// src/styles/theme.js additions
filterInclude: '#4caf50',
filterExclude: '#f44336',
filterIncludeBg: 'rgba(76, 175, 80, 0.15)',
filterExcludeBg: 'rgba(244, 67, 54, 0.15)',
```

---

## Verification

1. **Subject switching**: Tap SubjectPill → change to Swimmers → list updates
2. **Add filter**: (+) → select Team → select "Tigers" → Include → filter applied
3. **Toggle mode**: Tap FilterPill → switches Include↔Exclude, results update
4. **Remove filter**: Long-press FilterPill → filter removed
5. **Cross-entity**: View Times, filter by Team → only Times from Swimmers in that Team shown
6. **Empty state**: No results → show helpful message

---

## Design Decisions

- **No filter persistence** - Filters reset on app restart (simpler)
- **Date filter**: Preset ranges (Today, This Week, This Month) + custom date picker option
