# Nell's Diner Update Tracker Feature Guide

## Overview
Track and showcase release dates for Nell's Diner content updates, patch notes, and upcoming features. Provides players with a centralized location for update information and helps with event planning.

## Features

### 1. Release Information Data Structure

**File**: `lib/data/nells-diner.ts`

```typescript
export interface NellsDinerUpdate {
  id: string;
  title: string;
  releaseDate: number; // Unix timestamp
  content: string;
  changes: string[]; // List of major changes
  newContent: NewContent[];
  bugFixes: string[];
  balanceChanges: BalanceChange[];
  patchNotes: PatchNote[];
  status: 'released' | 'announced' | 'upcoming';
  imageUrl?: string;
  videoUrl?: string;
}

export interface NewContent {
  type: 'ghost' | 'equipment' | 'map' | 'cursed-possession' | 'event';
  name: string;
  description: string;
  details?: string;
  itemId?: string; // Link to existing ghost/equipment
}

export interface BalanceChange {
  itemName: string;
  itemType: 'ghost' | 'equipment' | 'mechanic';
  change: string;
  impact: 'buff' | 'nerf' | 'rework';
}

export interface PatchNote {
  title: string;
  description: string;
  category: 'gameplay' | 'ui' | 'performance' | 'bug' | 'balance';
}

export interface NellsDinerEvent {
  id: string;
  name: string;
  startDate: number;
  endDate: number;
  description: string;
  rewards: string[];
  eventUrl?: string;
}

// Current Nell's Diner content (as of November 2024)
export const NELLS_DINER_UPDATES: NellsDinerUpdate[] = [
  {
    id: 'nells-diner-release',
    title: 'Nell\'s Diner Released',
    releaseDate: new Date('2024-11-11').getTime(),
    content: 'The long-awaited Nell\'s Diner map has been released!',
    changes: [
      'New medium-sized map: Nell\'s Diner',
      'Unique hunts and ghost behaviors',
      'New interactive elements and hiding spots',
    ],
    newContent: [
      {
        type: 'map',
        name: 'Nell\'s Diner',
        description: 'A classic diner setting with unique ghost hunting challenges',
        details: 'Medium-sized map with 5 main areas and unique hunt mechanics',
      },
    ],
    bugFixes: [
      'Fixed spirit box audio issues',
      'Improved ghost pathfinding in certain areas',
    ],
    balanceChanges: [
      {
        itemName: 'Ouija Board',
        itemType: 'equipment',
        change: 'Increased sanity cost',
        impact: 'nerf',
      },
    ],
    patchNotes: [
      {
        title: 'Performance Improvements',
        description: 'Optimized lighting for better FPS',
        category: 'performance',
      },
    ],
    status: 'released',
    imageUrl: 'https://...',
  },
];

export const NELLS_DINER_EVENTS: NellsDinerEvent[] = [
  {
    id: 'nell-launch-event',
    name: 'Nell\'s Diner Launch Event',
    startDate: new Date('2024-11-11').getTime(),
    endDate: new Date('2024-11-25').getTime(),
    description: 'Launch week celebration with special rewards',
    rewards: [
      'Exclusive cosmetic item',
      'Ghost hunting bonus (1.5x)',
      'Equipment tier unlock',
    ],
  },
];

// Utility functions
export const getLatestUpdate = (): NellsDinerUpdate | null => {
  return NELLS_DINER_UPDATES.sort(
    (a, b) => b.releaseDate - a.releaseDate
  )[0] || null;
};

export const getReleasedUpdates = (): NellsDinerUpdate[] => {
  return NELLS_DINER_UPDATES.filter(u => u.status === 'released')
    .sort((a, b) => b.releaseDate - a.releaseDate);
};

export const getUpcomingUpdates = (): NellsDinerUpdate[] => {
  return NELLS_DINER_UPDATES.filter(
    u => u.status === 'announced' || u.status === 'upcoming'
  ).sort((a, b) => a.releaseDate - b.releaseDate);
};

export const getActiveEvents = (): NellsDinerEvent[] => {
  const now = Date.now();
  return NELLS_DINER_EVENTS.filter(
    e => e.startDate <= now && e.endDate >= now
  );
};

export const getUpcomingEvents = (): NellsDinerEvent[] => {
  const now = Date.now();
  return NELLS_DINER_EVENTS.filter(e => e.startDate > now)
    .sort((a, b) => a.startDate - b.startDate);
};
```

### 2. Timeline View Component

**Location**: `components/nells-diner-timeline.tsx`

```typescript
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from './themed-text';
import { useColorScheme } from '../hooks/use-color-scheme';
import { Colors } from '../constants/theme';
import { NellsDinerUpdate } from '../lib/data/nells-diner';

interface TimelineProps {
  updates: NellsDinerUpdate[];
}

export const NellsDinerTimeline: React.FC<TimelineProps> = ({ updates }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const statusColors = {
      released: colors.spectral,
      announced: colors.haunted,
      upcoming: colors.text,
    };
    return statusColors[status] || colors.text;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      released: '✓',
      announced: '📢',
      upcoming: '🔜',
    };
    return icons[status] || '•';
  };

  const renderTimelineItem = ({ item, index }: { item: NellsDinerUpdate; index: number }) => {
    const isLast = index === updates.length - 1;

    return (
      <View style={styles.timelineItemContainer}>
        {/* Timeline connector line */}
        {!isLast && (
          <View
            style={[
              styles.timelineLine,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          />
        )}

        {/* Timeline dot */}
        <View
          style={[
            styles.timelineDot,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <ThemedText style={styles.statusIcon}>
            {getStatusIcon(item.status)}
          </ThemedText>
        </View>

        {/* Content card */}
        <View style={[styles.timelineCard, { borderLeftColor: getStatusColor(item.status) }]}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.updateTitle}>{item.title}</ThemedText>
            <ThemedText style={styles.updateDate}>{formatDate(item.releaseDate)}</ThemedText>
          </View>

          <ThemedText style={styles.updateContent}>{item.content}</ThemedText>

          {/* Changes list */}
          {item.changes.length > 0 && (
            <View style={styles.changesSection}>
              <ThemedText style={styles.sectionTitle}>Changes</ThemedText>
              {item.changes.map((change, idx) => (
                <View key={idx} style={styles.changeItem}>
                  <ThemedText style={styles.changeBullet}>•</ThemedText>
                  <ThemedText style={styles.changeText}>{change}</ThemedText>
                </View>
              ))}
            </View>
          )}

          {/* New content */}
          {item.newContent.length > 0 && (
            <View style={styles.newContentSection}>
              <ThemedText style={styles.sectionTitle}>New Content</ThemedText>
              {item.newContent.map((content, idx) => (
                <View key={idx} style={styles.contentItem}>
                  <ThemedText style={styles.contentType}>{content.type}</ThemedText>
                  <ThemedText style={styles.contentName}>{content.name}</ThemedText>
                  <ThemedText style={styles.contentDesc}>{content.description}</ThemedText>
                </View>
              ))}
            </View>
          )}

          {/* Balance changes */}
          {item.balanceChanges.length > 0 && (
            <View style={styles.balanceSection}>
              <ThemedText style={styles.sectionTitle}>Balance Changes</ThemedText>
              {item.balanceChanges.map((change, idx) => (
                <View key={idx} style={styles.balanceItem}>
                  <View
                    style={[
                      styles.impactBadge,
                      {
                        backgroundColor:
                          change.impact === 'buff'
                            ? '#4CAF50'
                            : change.impact === 'nerf'
                            ? '#FF5252'
                            : '#FFC107',
                      },
                    ]}
                  >
                    <ThemedText style={styles.impactText}>
                      {change.impact.toUpperCase()}
                    </ThemedText>
                  </View>
                  <View>
                    <ThemedText style={styles.balanceItemName}>
                      {change.itemName}
                    </ThemedText>
                    <ThemedText style={styles.balanceItemChange}>
                      {change.change}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={updates}
        renderItem={renderTimelineItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingVertical: 16,
  },
  timelineItemContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 12,
    top: 44,
    width: 2,
    height: 100,
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  statusIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timelineCard: {
    marginLeft: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  cardHeader: {
    marginBottom: 12,
  },
  updateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  updateDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  updateContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  changesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    opacity: 0.7,
    marginBottom: 8,
  },
  changeItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  changeBullet: {
    marginRight: 8,
    fontSize: 14,
  },
  changeText: {
    flex: 1,
    fontSize: 13,
  },
  newContentSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  contentType: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    opacity: 0.6,
    marginBottom: 2,
  },
  contentName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  contentDesc: {
    fontSize: 13,
    opacity: 0.7,
  },
  balanceSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  impactText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  balanceItemName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  balanceItemChange: {
    fontSize: 12,
    opacity: 0.7,
  },
});
```

### 3. Events Section Component

**Location**: `components/nells-diner-events.tsx`

```typescript
import React from 'react';
import { View, FlatList, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { useColorScheme } from '../hooks/use-color-scheme';
import { Colors } from '../constants/theme';
import { NellsDinerEvent } from '../lib/data/nells-diner';

interface EventsProps {
  events: NellsDinerEvent[];
  title?: string;
}

export const NellsDinerEvents: React.FC<EventsProps> = ({
  events,
  title = 'Active Events',
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysRemaining = (endDate: number) => {
    const days = Math.ceil((endDate - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 1) return 'Ends today';
    if (days === 1) return 'Ends tomorrow';
    return `${days} days remaining`;
  };

  const renderEventItem = ({ item }: { item: NellsDinerEvent }) => (
    <Pressable style={[styles.eventCard, { borderColor: colors.spectral }]}>
      <View style={styles.eventHeader}>
        <ThemedText style={styles.eventName}>{item.name}</ThemedText>
        <View style={[styles.eventBadge, { backgroundColor: colors.spectral }]}>
          <ThemedText style={styles.eventBadgeText}>ACTIVE</ThemedText>
        </View>
      </View>

      <ThemedText style={styles.eventDescription}>{item.description}</ThemedText>

      <View style={styles.eventDates}>
        <Ionicons name="calendar" size={14} color={colors.text} />
        <ThemedText style={styles.dateText}>
          {formatDate(item.startDate)} - {formatDate(item.endDate)}
        </ThemedText>
      </View>

      {item.rewards.length > 0 && (
        <View style={styles.rewardsSection}>
          <ThemedText style={styles.rewardTitle}>Rewards</ThemedText>
          {item.rewards.map((reward, idx) => (
            <View key={idx} style={styles.rewardItem}>
              <Ionicons name="gift" size={14} color={colors.spectral} />
              <ThemedText style={styles.rewardText}>{reward}</ThemedText>
            </View>
          ))}
        </View>
      )}

      <View style={styles.eventFooter}>
        <ThemedText style={styles.daysRemaining}>
          {getDaysRemaining(item.endDate)}
        </ThemedText>
        {item.eventUrl && (
          <Pressable>
            <Ionicons name="open" size={16} color={colors.spectral} />
          </Pressable>
        )}
      </View>
    </Pressable>
  );

  if (events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="calendar-outline" size={40} color={colors.text} />
        <ThemedText style={styles.emptyText}>No active events</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  eventCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  eventBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  eventDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
    opacity: 0.8,
  },
  eventDates: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    opacity: 0.7,
  },
  rewardsSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  rewardTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    opacity: 0.6,
    marginBottom: 6,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  rewardText: {
    fontSize: 12,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  daysRemaining: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF5252',
  },
  emptyContainer: {
    paddingVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.6,
  },
});
```

### 4. Updates Screen

**Location**: Create `app/(tabs)/updates.tsx`

```typescript
import React, { useState } from 'react';
import { View, SectionList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '../components/themed-text';
import { useColorScheme } from '../hooks/use-color-scheme';
import { Colors } from '../constants/theme';
import {
  getReleasedUpdates,
  getUpcomingUpdates,
  getActiveEvents,
  getUpcomingEvents,
} from '../lib/data/nells-diner';
import { NellsDinerTimeline } from '../components/nells-diner-timeline';
import { NellsDinerEvents } from '../components/nells-diner-events';

export default function UpdatesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedTab, setSelectedTab] = useState<'updates' | 'events'>('updates');

  const releasedUpdates = getReleasedUpdates();
  const upcomingUpdates = getUpcomingUpdates();
  const activeEvents = getActiveEvents();
  const upcomingEvents = getUpcomingEvents();

  const updateSections = [
    {
      title: 'Released',
      data: releasedUpdates,
      icon: '✓',
    },
    {
      title: 'Upcoming',
      data: upcomingUpdates,
      icon: '🔜',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Nell's Diner Updates</ThemedText>
        <Ionicons name="information-circle-outline" size={24} color={colors.text} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Pressable
          onPress={() => setSelectedTab('updates')}
          style={[
            styles.tab,
            {
              borderBottomColor:
                selectedTab === 'updates' ? colors.spectral : 'transparent',
              borderBottomWidth: 2,
            },
          ]}
        >
          <ThemedText
            style={{
              fontWeight: selectedTab === 'updates' ? '700' : '500',
              color: selectedTab === 'updates' ? colors.spectral : colors.text,
            }}
          >
            Updates
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => setSelectedTab('events')}
          style={[
            styles.tab,
            {
              borderBottomColor:
                selectedTab === 'events' ? colors.haunted : 'transparent',
              borderBottomWidth: 2,
            },
          ]}
        >
          <ThemedText
            style={{
              fontWeight: selectedTab === 'events' ? '700' : '500',
              color: selectedTab === 'events' ? colors.haunted : colors.text,
            }}
          >
            Events
          </ThemedText>
        </Pressable>
      </View>

      {/* Content */}
      {selectedTab === 'updates' ? (
        <View style={styles.content}>
          {releasedUpdates.length === 0 && upcomingUpdates.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="newspaper-outline" size={48} color={colors.text} />
              <ThemedText style={styles.emptyText}>No updates yet</ThemedText>
            </View>
          ) : (
            <NellsDinerTimeline
              updates={[...releasedUpdates, ...upcomingUpdates]}
            />
          )}
        </View>
      ) : (
        <View style={styles.content}>
          {activeEvents.length > 0 && (
            <NellsDinerEvents events={activeEvents} title="Active Events" />
          )}
          {upcomingEvents.length > 0 && (
            <NellsDinerEvents events={upcomingEvents} title="Upcoming Events" />
          )}
          {activeEvents.length === 0 && upcomingEvents.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color={colors.text} />
              <ThemedText style={styles.emptyText}>No events scheduled</ThemedText>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
});
```

### 5. Updates Tab Integration

**Location**: Update `app/(tabs)/_layout.tsx`

Add new Updates tab:

```typescript
<Tabs.Screen
  name="updates"
  options={{
    title: 'Updates',
    headerShown: false,
    tabBarIcon: ({ color, focused }) => (
      <Ionicons
        name={focused ? 'newspaper' : 'newspaper-outline'}
        size={24}
        color={color}
      />
    ),
  }}
/>
```

## Update Management Guide

### Adding New Updates

Edit `lib/data/nells-diner.ts`:

```typescript
const newUpdate: NellsDinerUpdate = {
  id: 'unique-update-id',
  title: 'Update Title',
  releaseDate: new Date('2024-12-01').getTime(),
  content: 'Description of the update',
  changes: [
    'Change 1',
    'Change 2',
  ],
  newContent: [
    {
      type: 'ghost',
      name: 'New Ghost Name',
      description: 'Description',
      itemId: 'ghost-id',
    },
  ],
  bugFixes: ['Bug 1', 'Bug 2'],
  balanceChanges: [],
  patchNotes: [],
  status: 'announced', // or 'released'
};

NELLS_DINER_UPDATES.push(newUpdate);
```

### Adding Events

```typescript
const newEvent: NellsDinerEvent = {
  id: 'event-id',
  name: 'Event Name',
  startDate: new Date('2024-12-01').getTime(),
  endDate: new Date('2024-12-15').getTime(),
  description: 'Event description',
  rewards: ['Reward 1', 'Reward 2'],
  eventUrl: 'https://...',
};

NELLS_DINER_EVENTS.push(newEvent);
```

## Implementation Guide

### Step 1: Create Data File
- Create `lib/data/nells-diner.ts`
- Add update and event interfaces
- Add current update information
- Add utility functions

### Step 2: Create Components
- Create `components/nells-diner-timeline.tsx`
- Create `components/nells-diner-events.tsx`

### Step 3: Create Screen
- Create `app/(tabs)/updates.tsx`
- Add tab navigation for Updates/Events

### Step 4: Integration
- Update `app/(tabs)/_layout.tsx` to include new Updates tab
- Ensure imports are correct

### Step 5: Testing
- Test timeline rendering
- Test event display
- Test status indicators
- Test date formatting

## Features

✅ Release timeline with status indicators
✅ New content announcements
✅ Balance change tracking
✅ Active events display
✅ Upcoming events preview
✅ Patch notes integration
✅ Bug fixes listing

## Testing Checklist

- [ ] Timeline displays released updates
- [ ] Upcoming updates show with correct status
- [ ] Status badges display correctly
- [ ] Active events are visible
- [ ] Upcoming events are visible
- [ ] Dates format correctly
- [ ] Tab switching works smoothly
- [ ] Empty states display properly
- [ ] Balance changes show correct impact badges
- [ ] New content preview works

## Future Enhancement Ideas

1. **Notifications**: Notify users when events are about to end
2. **Deep Linking**: Link from updates to relevant game content
3. **Comparison View**: Show before/after for balance changes
4. **Wiki Integration**: Link to official wiki for full patch notes
5. **Event Countdown**: Visual countdown timer for events
6. **Tier Rewards**: Show reward tiers for events
7. **Event Filters**: Filter by reward type or content type
8. **Update Notifications**: In-app notification system for new updates
