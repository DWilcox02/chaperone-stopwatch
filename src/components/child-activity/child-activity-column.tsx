import { View } from "react-native";

import { ChildActivityPickerButton } from "@/components/child-activity/child-activity-picker-button";
import { ThemedText } from "@/components/themed-text";
import categories from "@/constants/categories";
import type { Category, Child } from "@/constants/types";
import { formatTimer } from "@/constants/utils";
import styles from "@/constants/styles";

type ChildActivityColumnProps = {
    child: Child;
    currentTime: number;
    onAssignActivity: (childId: string, category: Category) => void;
};

export function ChildActivityColumn({ child, currentTime, onAssignActivity }: ChildActivityColumnProps) {
    const activeSegment = child.segments[child.segments.length - 1];
    const activeDuration = activeSegment
        ? (activeSegment.endedAt ?? currentTime) - activeSegment.startedAt
        : 0;

    return (
        <View style={styles.childActivityColumn}>
            <View style={styles.activityColumnHeader}>
                <ThemedText style={styles.activityColumnName}>{child.name}</ThemedText>
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
            <View style={styles.activityColumnTimer}>
                <ThemedText style={styles.activityColumnTimerValue}>{formatTimer(activeDuration)}</ThemedText>
            </View>
        </View>
    );
}