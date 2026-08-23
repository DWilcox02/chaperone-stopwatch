import { StyleSheet, View } from "react-native";

import { ChildActivityPickerButton } from "@/components/child-activity-picker-button";
import { ThemedText } from "@/components/themed-text";
import categories from "@/constants/categories";
import type { Category, Child } from "@/constants/types";
import { formatTimer } from "@/constants/utils";

type ChildActivityColumnProps = {
    child: Child;
    currentTime: number;
    onAssignActivity: (childId: string, category: Category) => void;
};

const styles = StyleSheet.create({
    column: { width: 112 },
    header: {
        height: 52,
        justifyContent: "center",
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#B8B1A6",
    },
    name: { color: "#252A27", fontSize: 13, fontWeight: "800" },
    timer: {
        height: 44,
        justifyContent: "center",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#B8B1A6",
    },
    timerValue: { color: "#252A27", fontSize: 13, fontWeight: "800" },
});

export function ChildActivityColumn({ child, currentTime, onAssignActivity }: ChildActivityColumnProps) {
    const activeSegment = child.segments[child.segments.length - 1];
    const activeDuration = activeSegment
        ? (activeSegment.endedAt ?? currentTime) - activeSegment.startedAt
        : 0;

    return (
        <View style={styles.column}>
            <View style={styles.header}>
                <ThemedText style={styles.name}>{child.name}</ThemedText>
            </View>
            {categories.map((category) => (
                <ChildActivityPickerButton
                    key={category.name}
                    child={child}
                    category={category}
                    currentTime={currentTime}
                    isActive={activeSegment?.category === category.name}
                    onAssignActivity={onAssignActivity}
                />
            ))}
            <View style={styles.timer}>
                <ThemedText style={styles.timerValue}>{formatTimer(activeDuration)}</ThemedText>
            </View>
        </View>
    );
}