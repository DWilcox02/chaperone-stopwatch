import { useState } from "react";
import { View } from "react-native";

import { ActivityColumn } from "@/components/group-activity/activity-column";
import { ChildActivityModal } from "@/components/child-activity/child-activity-modal";
import { GroupActivityModal } from "@/components/group-activity/group-activity-modal";
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
    onMergeActivity: (category: Category) => void;
};

export function ActivityBoard({
    children,
    groups,
    currentTime,
    totalDuration,
    onAssignChildActivity,
    onAssignGroupActivity,
    onMergeActivity,
}: ActivityBoardProps) {
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    return (
        <>
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
                            onMergeActivity={onMergeActivity}
                        />
                    );
                })}
            </View>
            <ChildActivityModal
                child={selectedChild}
                children={children}
                groups={groups}
                onClose={() => setSelectedChild(null)}
                onAssignActivity={(category) => {
                    if (selectedChild) onAssignChildActivity(selectedChild.id, category);
                }}
            />
            <GroupActivityModal
                group={selectedGroup}
                children={children}
                onClose={() => setSelectedGroup(null)}
                onAssignActivity={(category) => {
                    if (selectedGroup) onAssignGroupActivity(selectedGroup.id, category);
                }}
            />
        </>
    );
}