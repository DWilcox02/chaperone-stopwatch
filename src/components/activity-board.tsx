import { useState } from "react";
import { Modal, Pressable, View } from "react-native";

import { ChildActivityCard } from "@/components/child-activity-card";
import { ThemedText } from "@/components/themed-text";
import categories from "@/constants/categories";
import styles from "@/constants/styles";
import { formatDuration } from "@/constants/utils";

import type { Category, Child, Group } from "@/constants/types";

type ActivityBoardProps = {
    children: Child[];
    groups: Group[];
    currentTime: number;
    totalDuration: number;
    onAssignChildActivity: (childId: string, category: Category) => void;
    onAssignGroupActivity: (groupId: string, category: Category) => void;
    onAddChildToGroup: (childId: string, groupId: string) => void;
    onCreateGroup: (childId: string) => string;
};

export function ActivityBoard({
    children,
    groups,
    currentTime,
    totalDuration,
    onAssignChildActivity,
    onAssignGroupActivity,
    onAddChildToGroup,
    onCreateGroup,
}: ActivityBoardProps) {
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    function selectGroupActivity(category: Category, groupId?: string) {
        const groupIdToUse = selectedGroup?.id ?? groupId;
        if (!groupIdToUse) return;
        onAssignGroupActivity(groupIdToUse, category);
        setSelectedGroup(null);
    }

    function selectChildActivity(category: Category) {
        if (!selectedChild) return;
        onAssignChildActivity(selectedChild.id, category);
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
                    const columnGroups = groups.filter((group) => (
                        group.childIds.some((childId) => {
                            const child = children.find((candidate) => candidate.id === childId);
                            return child?.segments[child.segments.length - 1].category === category.name;
                        })
                    ));

                    return (
                        <View
                            key={category.name}
                            style={styles.activityColumn}
                        >
                            <View style={styles.activityHeader}>
                                <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                                <ThemedText style={styles.activityTitle}>{category.shortName}</ThemedText>
                                <ThemedText style={styles.activityCount}>{columnGroups.length} groups</ThemedText>
                            </View>
                            <View style={[styles.activityGroup, !columnGroups.length && styles.activityGroupEmpty]}>
                                {columnGroups.map((group) => {
                                    const groupChildren = group.childIds
                                        .map((childId) => children.find((child) => child.id === childId))
                                        .filter((child): child is Child => child !== undefined);
                                    return (
                                        <View key={group.id} style={styles.groupCard}>
                                            <Pressable
                                                style={({ pressed }) => [styles.groupHeader, pressed && styles.pressed]}
                                                onPress={() => setSelectedGroup(group)}
                                            >
                                                <ThemedText style={styles.groupName}>{group.name}</ThemedText>
                                                <ThemedText style={[styles.groupActivity, { color: category.color }]}>Change activity</ThemedText>
                                            </Pressable>
                                            {groupChildren.map((child) => (
                                                <ChildActivityCard
                                                    key={child.id}
                                                    child={child}
                                                    activeSegment={child.segments[child.segments.length - 1]}
                                                    category={category}
                                                    currentTime={currentTime}
                                                    onPress={() => setSelectedChild(child)}
                                                />
                                            ))}
                                        </View>
                                    );
                                })}
                                {!columnGroups.length && (
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
                        <ThemedText style={styles.activityMenuTitle}>{selectedChild?.name}</ThemedText>
                        <ThemedText style={styles.menuLabel}>GROUP</ThemedText>
                        {groups.filter((group) => !group.childIds.includes(selectedChild?.id ?? "")).map((group) => (
                            <Pressable
                                key={group.id}
                                style={({ pressed }) => [styles.activityOption, pressed && styles.pressed]}
                                onPress={() => {
                                    if (selectedChild) onAddChildToGroup(selectedChild.id, group.id);
                                    setSelectedChild(null);
                                }}
                            >
                                <ThemedText style={styles.activityOptionText}>{group.name}</ThemedText>
                                <ThemedText style={styles.activityOptionCheck}>{group.childIds.length} children</ThemedText>
                            </Pressable>
                        ))}
                        <Pressable
                            style={({ pressed }) => [styles.activityOption, pressed && styles.pressed]}
                            onPress={() => {
                                if (selectedChild) onCreateGroup(selectedChild.id);
                                setSelectedChild(null);
                            }}
                        >
                            <ThemedText style={styles.activityOptionText}>New group with {selectedChild?.name}</ThemedText>
                        </Pressable>
                        <ThemedText style={styles.menuLabel}>ACTIVITY</ThemedText>
                        {categories.map((category) => (
                            <Pressable
                                key={category.name}
                                style={({ pressed }) => [styles.activityOption, pressed && styles.pressed]}
                                onPress={() => selectChildActivity(category.name)}
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
            <Modal visible={selectedGroup !== null} transparent animationType="fade" onRequestClose={() => setSelectedGroup(null)}>
                <Pressable style={styles.modalOverlay} onPress={() => setSelectedGroup(null)}>
                    <Pressable style={styles.activityMenu} onPress={(event) => event.stopPropagation()}>
                        <ThemedText style={styles.activityMenuTitle}>{selectedGroup?.name}</ThemedText>
                        <ThemedText style={styles.menuLabel}>ASSIGN ACTIVITY TO GROUP</ThemedText>
                        {categories.map((category) => (
                            <Pressable
                                key={category.name}
                                style={({ pressed }) => [styles.activityOption, pressed && styles.pressed]}
                                onPress={() => selectGroupActivity(category.name)}
                            >
                                <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                                <ThemedText style={styles.activityOptionText}>{category.shortName}</ThemedText>
                            </Pressable>
                        ))}
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}