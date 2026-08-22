import { useState } from "react";
import { View } from "react-native";

import { ActivityColumn } from "@/components/activity-column";
import { ChildActivityModal } from "@/components/child-activity-modal";
import { GroupActivityModal } from "@/components/group-activity-modal";
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
                    return (
                        <ActivityColumn
                            key={category.name}
                            category={category}
                            children={children}
                            groups={groups}
                            currentTime={currentTime}
                            onSelectGroup={setSelectedGroup}
                            onSelectChild={setSelectedChild}
                        />
                    );
                })}
            </View>
            <ChildActivityModal
                child={selectedChild}
                groups={groups}
                onClose={() => setSelectedChild(null)}
                onAssignActivity={(category) => {
                    if (selectedChild) onAssignChildActivity(selectedChild.id, category);
                }}
                onAddToGroup={(groupId) => {
                    if (selectedChild) onAddChildToGroup(selectedChild.id, groupId);
                }}
                onCreateGroup={() => {
                    if (selectedChild) onCreateGroup(selectedChild.id);
                }}
            />
            <GroupActivityModal
                group={selectedGroup}
                onClose={() => setSelectedGroup(null)}
                onAssignActivity={(category) => {
                    if (selectedGroup) onAssignGroupActivity(selectedGroup.id, category);
                }}
            />
        </>
    );
}