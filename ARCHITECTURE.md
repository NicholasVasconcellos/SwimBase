# SwimTimeLogger Architecture

## Overview

React Native/Expo app for logging swim times with effort-based pace calculations.

## Directory Structure

```
├── App.js                    # Root component (minimal orchestration)
├── src/
│   ├── constants/            # App-wide constants
│   │   └── index.js          # strokes, distances, efforts
│   │
│   ├── utils/                # Pure utility functions
│   │   ├── timeUtils.js      # formatTime, parseTimeInput, calculateResultTime
│   │   └── distanceUtils.js  # getDistanceValue
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useEntries.js     # Entries CRUD + AsyncStorage persistence
│   │   └── useUnitPreference.js  # Meters/yards toggle + persistence
│   │
│   ├── styles/
│   │   └── theme.js          # colors, spacing, typography, radii, shadows
│   │
│   └── components/
│       ├── common/           # Reusable UI primitives
│       │   ├── Button.js     # Variants: primary, secondary, danger
│       │   ├── TimeCard.js   # Time display card
│       │   └── TypeaheadInput.js  # Autocomplete input
│       │
│       ├── layout/           # App structure components
│       │   ├── Header.js     # App header with icon/title
│       │   └── TabNavigation.js  # New Entry / Log tabs
│       │
│       └── features/         # Feature-specific components
│           ├── EntryForm.js  # New entry form (owns form state)
│           ├── UnitToggle.js # Meters/yards selector
│           └── log/
│               ├── LogView.js    # Entries list container
│               ├── EntryCard.js  # Single entry display
│               └── EmptyState.js # Empty log placeholder
```

## Data Flow

```
App.js
├── useEntries() ──────────> AsyncStorage (swimEntries)
├── useUnitPreference() ───> AsyncStorage (unitPreference)
│
├── Header
├── TabNavigation ─────────> showLog state (local)
│
└── [showLog ? LogView : EntryForm]
    ├── EntryForm ─────────> form state (local), calls addEntry()
    └── LogView ───────────> reads entries, calls clearEntries()
```

## State Management

| State | Location | Persistence |
|-------|----------|-------------|
| `entries` | `useEntries` hook | AsyncStorage |
| `unit` | `useUnitPreference` hook | AsyncStorage |
| `showLog` | `App.js` | None (UI only) |
| Form fields | `EntryForm` | None (transient) |

## Key Patterns

- **Colocated state**: Form fields live in `EntryForm`, not lifted to App
- **Custom hooks**: Encapsulate persistence logic and side effects
- **Derived values**: `effortPercent`, `resultSeconds` computed inline, not stored
- **Barrel exports**: Each directory has `index.js` for clean imports

## Import Examples

```javascript
// From hooks
import { useEntries, useUnitPreference } from './src/hooks';

// From components
import { Button, TimeCard } from './src/components/common';
import { Header, TabNavigation } from './src/components/layout';
import { EntryForm, LogView } from './src/components/features';

// From utils
import { formatTime, parseTimeInput } from './src/utils';
```
