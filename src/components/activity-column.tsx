import { Pressable, View } from "react-native";

import { ChildActivityCard } from "@/components/child-activity-card";
import { ThemedText } from "@/components/themed-text";
import type { Category, Child, Group } from "@/constants/types";
import styles from "@/constants/styles";

type ActivityColumnProps = {
    category: { name: Category; shortName: string; color: string };
    children: Child[];
    groups: Group[];
    currentTime: number;
    onSelectGroup: (group: Group) => void;
    onSelectChild: (child: Child) => void;
};

export function ActivityColumn({
    category,
    children,
    groups,
    currentTime,
    onSelectGroup,
    onSelectChild,
}: ActivityColumnProps) {
    const columnGroups = groups.filter((group) => (
        group.childIds.some((childId) => {
            const child = children.find((candidate) => candidate.id === childId);
            return child?.segments[child.segments.length - 1].category === category.name;
        })
    ));

    return (
        <View style={styles.activityColumn}>
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
                                onPress={() => onSelectGroup(group)}
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
                                    onPress={() => onSelectChild(child)}
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
}
