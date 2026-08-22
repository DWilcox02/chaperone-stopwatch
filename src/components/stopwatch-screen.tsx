import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActivityBoard } from "@/components/activity-board";
import { ActivityLogCard } from "@/components/activity-log-card";
import { ThemedText } from "@/components/themed-text";
import { TotalsCard } from "@/components/totals-card";
import { initialChildren } from "@/constants/children";
import styles from "@/constants/styles";
import type { Category, Group } from "@/constants/types";

export default function StopwatchScreen() {
    const [children, setChildren] = useState(initialChildren);
    const [groups, setGroups] = useState<Group[]>(() => initialChildren.map((child, index) => ({
        id: `group-${index + 1}`,
        name: `Group ${index + 1}`,
        childIds: [child.id],
    })));
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

    function updateChildrenActivity(childIds: string[], category: Category) {
        const timestamp = Date.now();
        setCurrentTime(timestamp);
        setChildren((currentChildren) => currentChildren.map((child) => {
            if (!childIds.includes(child.id)) return child;
            const activeSegment = child.segments[child.segments.length - 1];
            if (activeSegment.category === category) return child;
            return { ...child, segments: [
                ...child.segments.slice(0, -1),
                { ...activeSegment, endedAt: timestamp },
                { category, startedAt: timestamp },
            ] };
        }));
    }

    function assignChildActivity(childId: string, category: Category) {
        setGroups((currentGroups) => [
            ...currentGroups.filter((group) => !group.childIds.includes(childId)),
            { id: `group-${Date.now()}`, name: `Group ${currentGroups.length + 1}`, childIds: [childId] },
        ]);
        updateChildrenActivity([childId], category);
    }

    function assignGroupActivity(groupId: string, category: Category) {
        const group = groups.find((candidate) => candidate.id === groupId);
        if (group) updateChildrenActivity(group.childIds, category);
    }

    function addChildToGroup(childId: string, groupId: string) {
        const targetGroup = groups.find((group) => group.id === groupId);
        if (!targetGroup) return;
        const targetChild = children.find((child) => targetGroup.childIds.includes(child.id));
        setGroups((currentGroups) => currentGroups
            .filter((group) => !group.childIds.includes(childId) || group.id === groupId)
            .map((group) => group.id === groupId ? { ...group, childIds: [...group.childIds, childId] } : group));
        if (targetChild) updateChildrenActivity([childId], targetChild.segments[targetChild.segments.length - 1].category);
    }

    function createGroup(childId: string) {
        setGroups((currentGroups) => [
            ...currentGroups.filter((group) => !group.childIds.includes(childId)),
            { id: `group-${Date.now()}`, name: `Group ${currentGroups.length + 1}`, childIds: [childId] },
        ]);
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
                            <ThemedText style={styles.kicker}>SETTIME / TODAY</ThemedText>
                            <ThemedText style={styles.heading}>On set</ThemedText>
                        </View>
                        <View style={styles.datePill}>
                            <ThemedText style={styles.dateText}>SAT 22 AUG</ThemedText>
                        </View>
                    </View>

                    <ActivityBoard
                        children={children}
                        groups={groups}
                        currentTime={currentTime}
                        totalDuration={totals}
                        onAssignChildActivity={assignChildActivity}
                        onAssignGroupActivity={assignGroupActivity}
                        onAddChildToGroup={addChildToGroup}
                        onCreateGroup={createGroup}
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
