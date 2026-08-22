import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth } from '@/constants/theme';

import type { Category, Segment, Child } from "../constants/types";
import { formatClock, formatDuration } from '@/constants/utils';
import styles from '@/constants/styles';
import CurrentActivityCard from './current-activity-card';
import categories from '@/constants/categories';
import initialChildren from '@/constants/children';
import ChildTabs from './child-tabs';


export default function StopwatchScreen() {
    const [children, setChildren] = useState(initialChildren);
    const [selectedChildId, setSelectedChildId] = useState('emily');
    const [currentTime, setCurrentTime] = useState(Date.now());
    const selectedChild = children.find((child) => child.id === selectedChildId) ?? children[0];
    const activeSegment = selectedChild.segments[selectedChild.segments.length - 1];

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const totals = useMemo(() => categories.map((category) => ({
        ...category,
        duration: selectedChild.segments.reduce((total, segment) => (
            segment.category === category.name ? total + (segment.endedAt ?? currentTime) - segment.startedAt : total
        ), 0),
    })), [selectedChild, currentTime]);

    function switchCategory(category: Category) {
        if (activeSegment.category === category) return;
        const timestamp = Date.now();
        setCurrentTime(timestamp);
        setChildren((currentChildren) => currentChildren.map((child) => {
            if (child.id !== selectedChild.id) return child;
            const segments = child.segments.map((segment, index) => (
                index === child.segments.length - 1 ? { ...segment, endedAt: timestamp } : segment
            ));
            return { ...child, segments: [...segments, { category, startedAt: timestamp }] };
        }));
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <View>
                            <ThemedText style={styles.kicker}>
                                SETTIME / TODAY
                            </ThemedText>
                            <ThemedText style={styles.heading}>
                                On set
                            </ThemedText>
                        </View>
                        <View style={styles.datePill}>
                            <ThemedText style={styles.dateText}>SAT 22 AUG</ThemedText>
                        </View>
                    </View>

                    <ChildTabs 
                        children={children}
                        selectedChild={selectedChild}
                        setSelectedChildId={setSelectedChildId}
                    />

                    <CurrentActivityCard
                        activeSegment={activeSegment}
                        currentTime={currentTime}
                    />

                    <View style={styles.sectionHeader}>
                        <ThemedText style={styles.sectionTitle}>Switch activity</ThemedText>
                        <ThemedText style={styles.sectionHint}>Tap once to log</ThemedText>
                    </View>

                    <View style={styles.categoryGrid}>
                        {categories.map((category) => {
                            const isActive = category.name === activeSegment.category;

                            return (
                                <Pressable
                                    key={category.name}
                                    onPress={() => switchCategory(category.name)}
                                    style={({ pressed }) => [
                                        styles.categoryButton,
                                        isActive && {
                                            borderColor: category.color,
                                            backgroundColor: `${category.color}18`,
                                        },
                                        pressed && styles.pressed,
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.categoryDot,
                                            { backgroundColor: category.color },
                                        ]}
                                    />
                                    <ThemedText
                                        style={[
                                            styles.categoryText,
                                            isActive && styles.categoryTextActive,
                                        ]}
                                    >
                                        {category.shortName}
                                    </ThemedText>
                                    {isActive && (
                                        <ThemedText
                                            style={[styles.check, { color: category.color }]}
                                        >
                                            ✓
                                        </ThemedText>
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>

                    <View style={styles.sectionHeader}>
                        <ThemedText style={styles.sectionTitle}>Today&apos;s totals</ThemedText>
                        <ThemedText style={styles.sectionHint}>
                            {selectedChild.name}
                        </ThemedText>
                    </View>

                    <View style={styles.totalsCard}>
                        {totals
                            .filter((total) => total.duration > 0)
                            .map((total) => (
                                <View key={total.name} style={styles.totalRow}>
                                    <View style={styles.totalName}>
                                        <View
                                            style={[
                                                styles.categoryDot,
                                                { backgroundColor: total.color },
                                            ]}
                                        />
                                        <ThemedText style={styles.totalLabel}>
                                            {total.shortName}
                                        </ThemedText>
                                    </View>
                                    <ThemedText style={styles.totalValue}>
                                        {formatDuration(total.duration)}
                                    </ThemedText>
                                </View>
                            ))}
                    </View>

                    <View style={styles.sectionHeader}>
                        <ThemedText style={styles.sectionTitle}>Activity log</ThemedText>
                        <ThemedText style={styles.sectionHint}>Latest first</ThemedText>
                    </View>

                    <View style={styles.logCard}>
                        {[...selectedChild.segments]
                            .reverse()
                            .slice(0, 5)
                            .map((segment, index) => (
                                <View
                                    key={`${segment.startedAt}-${segment.category}`}
                                    style={styles.logRow}
                                >
                                    <View
                                        style={[
                                            styles.logLine,
                                            index === 0 && {
                                                backgroundColor: selectedChild.color,
                                            },
                                        ]}
                                    />
                                    <ThemedText style={styles.logTime}>
                                        {formatClock(segment.startedAt)}
                                    </ThemedText>
                                    <ThemedText
                                        style={[
                                            styles.logActivity,
                                            index === 0 && styles.logActivityActive,
                                        ]}
                                    >
                                        {segment.category}
                                    </ThemedText>
                                </View>
                            ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}