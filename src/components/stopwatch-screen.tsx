import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth } from '@/constants/theme';

import type { Category, Child } from "../constants/types";
import { formatClock, formatDuration } from '@/constants/utils';
import styles from '@/constants/styles';
import categories from '@/constants/categories';
import { initialChildren } from '@/constants/children';


export default function StopwatchScreen() {
    const [children, setChildren] = useState(initialChildren);
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [draggingChildId, setDraggingChildId] = useState<string | null>(null);
    const dragPosition = useRef(new Animated.ValueXY()).current;
    const categoryRefs = useRef<Record<Category, View | null>>({} as Record<Category, View | null>);

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const totals = useMemo(() => children.reduce((total, child) => (
        total + child.segments.reduce((childTotal, segment) => (
            childTotal + (segment.endedAt ?? currentTime) - segment.startedAt
        ), 0)
    ), 0), [children, currentTime]);

    function moveChild(childId: string, category: Category) {
        const timestamp = Date.now();
        setCurrentTime(timestamp);
        setChildren((currentChildren) => currentChildren.map((child) => {
            if (child.id !== childId) return child;
            const activeSegment = child.segments[child.segments.length - 1];
            if (activeSegment.category === category) return child;
            return { ...child, segments: [
                ...child.segments.slice(0, -1),
                { ...activeSegment, endedAt: timestamp },
                { category, startedAt: timestamp },
            ] };
        }));
    }

    function dropChild(childId: string, moveX: number, moveY: number) {
        const checks = categories.map((category) => new Promise<Category | null>((resolve) => {
            categoryRefs.current[category.name]?.measureInWindow((x, y, width, height) => {
                resolve(moveX >= x && moveX <= x + width && moveY >= y && moveY <= y + height ? category.name : null);
            });
        }));
        Promise.all(checks).then((matches) => {
            const category = matches.find(Boolean);
            if (category) moveChild(childId, category);
        });
    }

    function createDragResponder(child: Child) {
        return PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setDraggingChildId(child.id);
                dragPosition.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event([
                null,
                { dx: dragPosition.x, dy: dragPosition.y },
            ], { useNativeDriver: false }),
            onPanResponderRelease: (_, gestureState) => {
                dropChild(child.id, gestureState.moveX, gestureState.moveY);
                setDraggingChildId(null);
                Animated.spring(dragPosition, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
            },
            onPanResponderTerminate: () => {
                setDraggingChildId(null);
                Animated.spring(dragPosition, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
            },
        });
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={true}
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

                    <View style={styles.boardIntro}>
                        <View>
                            <ThemedText style={styles.sectionTitle}>Live board</ThemedText>
                            <ThemedText style={styles.sectionHint}>Drag a child to start their next activity</ThemedText>
                        </View>
                        <ThemedText style={styles.boardTotal}>{formatDuration(totals)} tracked</ThemedText>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.board}>
                        {categories.map((category) => {
                            const columnChildren = children.filter((child) => (
                                child.segments[child.segments.length - 1].category === category.name
                            ));

                            return (
                                <View
                                    key={category.name}
                                    ref={(ref) => { categoryRefs.current[category.name] = ref; }}
                                    style={styles.activityColumn}
                                >
                                    <View style={styles.activityHeader}>
                                        <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                                        <ThemedText style={styles.activityTitle}>{category.shortName}</ThemedText>
                                        <ThemedText style={styles.activityCount}>{columnChildren.length}</ThemedText>
                                    </View>
                                    <View style={[styles.dropZone, { borderColor: `${category.color}45` }]}>
                                        {columnChildren.map((child) => {
                                            const activeSegment = child.segments[child.segments.length - 1];
                                            const responder = createDragResponder(child);
                                            return (
                                                <Animated.View
                                                    key={child.id}
                                                    {...responder.panHandlers}
                                                    style={[
                                                        styles.childCard,
                                                        { borderLeftColor: child.color },
                                                        draggingChildId === child.id && styles.childCardDragging,
                                                        draggingChildId === child.id && { transform: dragPosition.getTranslateTransform() },
                                                    ]}
                                                >
                                                    <View style={styles.childCardTop}>
                                                        <ThemedText style={styles.childCardName}>{child.name}</ThemedText>
                                                        <ThemedText style={[styles.childCardTime, { color: category.color }]}>
                                                            {formatDuration((activeSegment.endedAt ?? currentTime) - activeSegment.startedAt)}
                                                        </ThemedText>
                                                    </View>
                                                    <ThemedText style={styles.childCardRole}>{child.role}</ThemedText>
                                                    <ThemedText style={styles.childCardStarted}>Since {formatClock(activeSegment.startedAt)}</ThemedText>
                                                </Animated.View>
                                            );
                                        })}
                                        {!columnChildren.length && <ThemedText style={styles.emptyColumn}>Drop here</ThemedText>}
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>

                    <View style={styles.sectionHeader}>
                        <ThemedText style={styles.sectionTitle}>Today&apos;s totals</ThemedText>
                        <ThemedText style={styles.sectionHint}>All children</ThemedText>
                    </View>

                    <View style={styles.totalsCard}>
                        {categories.map((category) => {
                            const duration = children.reduce((total, child) => total + child.segments.reduce((childTotal, segment) => (
                                segment.category === category.name ? childTotal + (segment.endedAt ?? currentTime) - segment.startedAt : childTotal
                            ), 0), 0);
                            return duration > 0 ? (
                                <View key={category.name} style={styles.totalRow}>
                                    <View style={styles.totalName}>
                                        <View
                                            style={[
                                                styles.categoryDot,
                                                { backgroundColor: category.color },
                                            ]}
                                        />
                                        <ThemedText style={styles.totalLabel}>
                                            {category.shortName}
                                        </ThemedText>
                                    </View>
                                    <ThemedText style={styles.totalValue}>
                                        {formatDuration(duration)}
                                    </ThemedText>
                                </View>
                            ) : null;
                        })}
                    </View>

                    <View style={styles.sectionHeader}>
                        <ThemedText style={styles.sectionTitle}>Activity log</ThemedText>
                        <ThemedText style={styles.sectionHint}>Latest first</ThemedText>
                    </View>

                    <View style={styles.logCard}>
                        {children.flatMap((child) => child.segments.map((segment) => ({ ...segment, child })))
                            .sort((a, b) => b.startedAt - a.startedAt)
                            .slice(0, 8)
                            .map((entry, index) => (
                                <View
                                    key={`${entry.child.id}-${entry.startedAt}-${entry.category}`}
                                    style={styles.logRow}
                                >
                                    <View
                                        style={[
                                            styles.logLine,
                                            index === 0 && {
                                                backgroundColor: entry.child.color,
                                            },
                                        ]}
                                    />
                                    <ThemedText style={styles.logTime}>
                                        {formatClock(entry.startedAt)}
                                    </ThemedText>
                                    <ThemedText
                                        style={[
                                            styles.logActivity,
                                            index === 0 && styles.logActivityActive,
                                        ]}
                                    >
                                        {entry.child.name} / {entry.category}
                                    </ThemedText>
                                </View>
                            ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}