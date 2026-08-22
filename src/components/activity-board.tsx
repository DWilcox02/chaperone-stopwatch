import { useState } from "react";
import { Modal, Pressable, View } from "react-native";

import { ChildActivityCard } from "@/components/child-activity-card";
import { ThemedText } from "@/components/themed-text";
import categories from "@/constants/categories";
import styles from "@/constants/styles";
import { formatDuration } from "@/constants/utils";

import type { Category, Child } from "@/constants/types";

type ActivityBoardProps = {
    children: Child[];
    currentTime: number;
    totalDuration: number;
    onMoveChild: (childId: string, category: Category) => void;
};

export function ActivityBoard({
    children,
    currentTime,
    totalDuration,
    onMoveChild,
}: ActivityBoardProps) {
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);

    function selectActivity(category: Category) {
        if (!selectedChild) return;
        onMoveChild(selectedChild.id, category);
        setSelectedChild(null);
    }

    return (
        <>
            <View style={styles.boardIntro}>
                <View>
                    <ThemedText style={styles.sectionTitle}>Live board</ThemedText>
                    <ThemedText style={styles.sectionHint}>Tap a child to change their activity</ThemedText>
                </View>
                <ThemedText style={styles.boardTotal}>{formatDuration(totalDuration)} tracked</ThemedText>
            </View>

            <View style={styles.board}>
                {categories.map((category) => {
                    const columnChildren = children.filter((child) => (
                        child.segments[child.segments.length - 1].category === category.name
                    ));

                    return (
                        <View
                            key={category.name}
                            style={styles.activityColumn}
                        >
                            <View style={styles.activityHeader}>
                                <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                                <ThemedText style={styles.activityTitle}>{category.shortName}</ThemedText>
                                <ThemedText style={styles.activityCount}>{columnChildren.length}</ThemedText>
                            </View>
                            <View style={[styles.activityGroup, !columnChildren.length && styles.activityGroupEmpty]}>
                                {columnChildren.map((child) => (
                                    <ChildActivityCard
                                        key={child.id}
                                        child={child}
                                        activeSegment={child.segments[child.segments.length - 1]}
                                        category={category}
                                        currentTime={currentTime}
                                        onPress={() => setSelectedChild(child)}
                                    />
                                ))}
                                {!columnChildren.length && (
                                    <ThemedText style={[styles.emptyColumn, styles.emptyColumnCompact]}>No children</ThemedText>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
            <Modal visible={selectedChild !== null} transparent animationType="fade" onRequestClose={() => setSelectedChild(null)}>
                <Pressable style={styles.modalOverlay} onPress={() => setSelectedChild(null)}>
                    <Pressable style={styles.activityMenu} onPress={(event) => event.stopPropagation()}>
                        <ThemedText style={styles.activityMenuTitle}>{selectedChild?.name}&apos;s activity</ThemedText>
                        {categories.map((category) => (
                            <Pressable
                                key={category.name}
                                style={({ pressed }) => [styles.activityOption, pressed && styles.pressed]}
                                onPress={() => selectActivity(category.name)}
                            >
                                <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                                <ThemedText style={styles.activityOptionText}>{category.shortName}</ThemedText>
                                {selectedChild?.segments[selectedChild.segments.length - 1].category === category.name && (
                                    <ThemedText style={[styles.activityOptionCheck, { color: category.color }]}>Current</ThemedText>
                                )}
                            </Pressable>
                        ))}
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}