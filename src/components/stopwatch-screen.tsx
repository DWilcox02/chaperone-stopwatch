import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth } from '@/constants/theme';

type Category = 'Performance' | 'Standby' | 'Hair & Makeup' | 'Tutoring' | 'Meal' | 'Travel' | 'Wrap';
type Segment = { category: Category; startedAt: number; endedAt?: number };
type Child = { id: string; name: string; role: string; color: string; segments: Segment[] };

const categories: { name: Category; shortName: string; color: string }[] = [
    { name: 'Performance', shortName: 'Performance', color: '#E7684A' },
    { name: 'Standby', shortName: 'Standby', color: '#D89B32' },
    { name: 'Hair & Makeup', shortName: 'Hair & makeup', color: '#A879C9' },
    { name: 'Tutoring', shortName: 'Tutoring', color: '#4B9B91' },
    { name: 'Meal', shortName: 'Meal', color: '#6B8FC9' },
    { name: 'Travel', shortName: 'Travel', color: '#7E8B83' },
    { name: 'Wrap', shortName: 'Wrap', color: '#5E6974' },
];

const now = Date.now();
const initialChildren: Child[] = [
    {
        id: 'emily', name: 'Emily', role: 'Child 01', color: '#E7684A', segments: [
            { category: 'Standby', startedAt: now - 5 * 60 * 60 * 1000, endedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000 },
            { category: 'Hair & Makeup', startedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000, endedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000 },
            { category: 'Performance', startedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000, endedAt: now - 48 * 60 * 1000 },
            { category: 'Tutoring', startedAt: now - 48 * 60 * 1000, endedAt: now - 18 * 60 * 1000 },
            { category: 'Standby', startedAt: now - 18 * 60 * 1000 },
        ]
    },
    { id: 'jack', name: 'Jack', role: 'Child 02', color: '#4B9B91', segments: [{ category: 'Standby', startedAt: now - 42 * 60 * 1000 }] },
];

function formatDuration(milliseconds: number) {
    const totalMinutes = Math.floor(Math.max(0, milliseconds) / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours ? `${hours}h ${minutes.toString().padStart(2, '0')}m` : `${minutes}m`;
}

function formatClock(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

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

                    <View style={styles.childTabs}>
                        {children.map((child) => (
                            <Pressable
                                key={child.id}
                                onPress={() => setSelectedChildId(child.id)}
                                style={[
                                    styles.childTab,
                                    selectedChild.id === child.id && styles.childTabSelected,
                                ]}
                            >
                                <View style={[styles.avatar, { backgroundColor: child.color }]}>
                                    <ThemedText style={styles.avatarText}>
                                        {child.name[0]}
                                    </ThemedText>
                                </View>
                                <View>
                                    <ThemedText style={styles.childName}>
                                        {child.name}
                                    </ThemedText>
                                    <ThemedText style={styles.childRole}>
                                        {child.role}
                                    </ThemedText>
                                </View>
                            </Pressable>
                        ))}
                    </View>

                    <View style={styles.currentCard}>
                        <View style={styles.currentTop}>
                            <ThemedText style={styles.cardLabel}>
                                CURRENT ACTIVITY
                            </ThemedText>
                            <View style={styles.live}>
                                <View style={styles.liveDot} />
                                <ThemedText style={styles.liveText}>LIVE</ThemedText>
                            </View>
                        </View>
                        <ThemedText style={styles.activityName}>
                            {activeSegment.category}
                        </ThemedText>
                        <ThemedText style={styles.elapsed}>
                            {formatDuration(currentTime - activeSegment.startedAt)}
                        </ThemedText>
                        <ThemedText style={styles.started}>
                            Started at {formatClock(activeSegment.startedAt)}
                        </ThemedText>
                    </View>

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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F2EC' },
    safeArea: { flex: 1, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
    content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: BottomTabInset + 32 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
    kicker: { color: '#8B877F', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
    heading: { color: '#202522', fontSize: 34, fontWeight: '800', marginTop: 3 },
    datePill: { backgroundColor: '#E8E3DA', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 20 },
    dateText: { color: '#716D65', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
    childTabs: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    childTab: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#E3DED5' },
    childTabSelected: { backgroundColor: '#FFFDF9', borderColor: '#B8B1A6' },
    avatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#FFFDF9', fontWeight: '800', fontSize: 16 },
    childName: { color: '#252A27', fontWeight: '800', fontSize: 15 },
    childRole: { color: '#938D84', fontSize: 10, marginTop: 2 },
    currentCard: { backgroundColor: '#252B28', borderRadius: 18, padding: 22, minHeight: 200, marginBottom: 26 },
    currentTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardLabel: { color: '#A4AAA3', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
    live: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    liveDot: { backgroundColor: '#8FD49A', width: 7, height: 7, borderRadius: 4 },
    liveText: { color: '#8FD49A', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
    activityName: { color: '#FFFDF9', fontSize: 28, fontWeight: '800', marginTop: 30 },
    elapsed: { color: '#FFFDF9', fontSize: 46, fontWeight: '300', marginTop: 3 },
    started: { color: '#A4AAA3', fontSize: 12, marginTop: 8 },
    sectionHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 },
    sectionTitle: { color: '#252A27', fontSize: 18, fontWeight: '800' },
    sectionHint: { color: '#9A948A', fontSize: 11 },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginBottom: 28 },
    categoryButton: { width: '31.8%', minHeight: 58, paddingHorizontal: 10, borderRadius: 12, borderWidth: 1, borderColor: '#E1DBD1', backgroundColor: '#FBF9F5', justifyContent: 'center', gap: 7 },
    categoryDot: { width: 8, height: 8, borderRadius: 4 },
    categoryText: { color: '#6F6B63', fontSize: 12, fontWeight: '700' },
    categoryTextActive: { color: '#252A27' },
    check: { position: 'absolute', right: 9, top: 9, fontSize: 13, fontWeight: '800' },
    totalsCard: { backgroundColor: '#FFFDF9', borderRadius: 14, paddingHorizontal: 16, marginBottom: 28 },
    totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EEEAE3' },
    totalName: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    totalLabel: { color: '#5E5C56', fontSize: 13, fontWeight: '600' },
    totalValue: { color: '#252A27', fontSize: 14, fontWeight: '800' },
    logCard: { backgroundColor: '#FFFDF9', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 4 },
    logRow: { flexDirection: 'row', alignItems: 'center', minHeight: 46, gap: 12, borderBottomWidth: 1, borderBottomColor: '#EEEAE3' },
    logLine: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D5D0C7' },
    logTime: { width: 48, color: '#9A948A', fontSize: 12, fontVariant: ['tabular-nums'] },
    logActivity: { color: '#6F6B63', fontSize: 13 },
    logActivityActive: { color: '#252A27', fontWeight: '800' },
    pressed: { opacity: 0.7 },
});
