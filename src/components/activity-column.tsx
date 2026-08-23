import { Pressable, View } from "react-native";

import { GroupActivityCard } from "@/components/group-activity-card";
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
    onMergeActivity: (category: Category) => void;
};

export function ActivityColumn({
    category,
    children,
    groups,
    currentTime,
    onSelectGroup,
    onSelectChild,
    onMergeActivity,
}: ActivityColumnProps) {
    const columnGroups = groups.filter((group) => (
        group.childIds.some((childId) => {
            const child = children.find((candidate) => candidate.id === childId);
            return (
                child && 
                child.segments &&
                child.segments.length > 0 &&
                child.segments[child.segments.length - 1].category === category.name
            );
        })
    ));

    return (
        (columnGroups.length > 0 &&
        <View style={styles.activityColumn}>
            <View style={styles.activityHeader}>
                <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                <ThemedText style={styles.activityTitle}>{category.shortName}</ThemedText>
                {/* <Pressable
                    accessibilityLabel={`Merge all children in ${category.name}`}
                    accessibilityRole="button"
                    hitSlop={8}
                    onPress={() => onMergeActivity(category.name)}
                    style={({ pressed }) => [styles.mergeActivityButton, pressed && styles.pressed]}
                >
                    <SymbolView name="person.3.fill" size={18} tintColor={category.color} />
                </Pressable> */}
            </View>
            <View style={[styles.activityGroup, !columnGroups.length && styles.activityGroupEmpty]}>
                {columnGroups.map((group) => {
                    return (
                        <GroupActivityCard
                            key={group.id}
                            group={group}
                            children={children}
                            category={category}
                            currentTime={currentTime}
                            onSelectGroup={onSelectGroup}
                            onSelectChild={onSelectChild}
                        />
                    );
                })}
            </View>
        </View>)
    );
}
