import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActivityBoard } from "@/components/activity-board";
import { ActivityLogCard } from "@/components/activity-log-card";
import { ThemedText } from "@/components/themed-text";
import { TotalsCard } from "@/components/totals-card";
import { initialChildren } from "@/constants/children";
import styles from "@/constants/styles";
import type { Category } from "@/constants/types";

export default function StopwatchScreen() {
    const [children, setChildren] = useState(initialChildren);
    const [currentTime, setCurrentTime] = useState(Date.now());

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

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={true}>
                    <View style={styles.header}>
                        <View>
                            <ThemedText style={styles.kicker}>SETTIME / TODAY</ThemedText>
                            <ThemedText style={styles.heading}>On set</ThemedText>
                        </View>
                        <View style={styles.datePill}>
                            <ThemedText style={styles.dateText}>SAT 22 AUG</ThemedText>
                        </View>
                    </View>

                    <ActivityBoard
                        children={children}
                        currentTime={currentTime}
                        totalDuration={totals}
                        onMoveChild={moveChild}
                    />

                    <View style={styles.sectionHeader}>
                        <ThemedText style={styles.sectionTitle}>Today&apos;s totals</ThemedText>
                        <ThemedText style={styles.sectionHint}>All children</ThemedText>
                    </View>
                    <TotalsCard children={children} currentTime={currentTime} />

                    <View style={styles.sectionHeader}>
                        <ThemedText style={styles.sectionTitle}>Activity log</ThemedText>
                        <ThemedText style={styles.sectionHint}>Latest first</ThemedText>
                    </View>
                    <ActivityLogCard children={children} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
