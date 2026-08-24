import { Pressable, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";

import { ChildActivityCard } from "@/components/child-activity/child-activity-card";
import type { Category, Child, Group } from "@/constants/types";
import styles from "@/constants/styles";

type GroupActivityCardProps = {
    group: Group;
    children: Child[];
    category: { name: Category; color: string };
    currentTime: number;
    onSelectGroup: (group: Group) => void;
    onSelectChild: (child: Child) => void;
};

export function GroupActivityCard({
    group,
    children,
    category,
    currentTime,
    onSelectGroup,
    onSelectChild,
}: GroupActivityCardProps) {
    const groupChildren = group.childIds
        .map((childId) => children.find((child) => child.id === childId))
        .filter((child): child is Child => child !== undefined);

    return (
        <View style={styles.groupCard}>
            <View style={styles.groupHeader}>
                <Text style={styles.groupName} numberOfLines={1} ellipsizeMode="tail">
                    {groupChildren.map((child) => child.name).join(", ")}
                </Text>
                <Pressable
                    accessibilityLabel="Open group activity options"
                    accessibilityRole="button"
                    style={({ pressed }) => [styles.mergeActivityButton, pressed && styles.pressed]}
                    onPress={() => onSelectGroup(group)}
                >
                    <SymbolView name="arrow.right.arrow.left.circle" size={30} tintColor={category.color} />
                </Pressable>
            </View>
            {groupChildren.map((child) => {
                const activeSegment = child.segments[child.segments.length - 1];
                if (!activeSegment) return null;
                return (
                    <ChildActivityCard
                        key={child.id}
                        child={child}
                        activeSegment={activeSegment}
                        category={category}
                        currentTime={currentTime}
                        onPress={() => onSelectChild(child)}
                    />
                );
            })}
        </View>
    );
}