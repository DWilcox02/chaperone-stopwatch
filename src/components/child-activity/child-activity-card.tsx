import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { formatClock, formatDuration, formatHoursMinutes, formatHoursRounded } from "@/constants/utils";
import styles from "@/constants/styles";

import type { Category, Child, Segment } from "@/constants/types";

type ChildActivityCardProps = {
    child: Child;
    activeSegment?: Segment;
    category: { name: Category; color: string };
    currentTime: number;
    onPress: () => void;
};

export function ChildActivityCard({
    child,
    activeSegment,
    category,
    currentTime,
    onPress,
}: ChildActivityCardProps) {
    if (!activeSegment) return null;

    const totalTime = child.time?.totalMilliseconds ?? child.segments.reduce((total, segment) => (
        total + (segment.endedAt ?? currentTime) - segment.startedAt
    ), 0);

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [styles.childCard, { borderLeftColor: child.color }, pressed && styles.pressed]}
        >
            <View style={styles.childCardTop}>
                <ThemedText style={styles.childCardName}>{child.name}</ThemedText>
                <ThemedText style={[styles.childCardTime, { color: category.color }]}> 
                    {formatDuration((activeSegment.endedAt ?? currentTime) - activeSegment.startedAt)}
                </ThemedText>
            </View>
            <ThemedText style={styles.childCardHours}>
                {formatHoursMinutes(totalTime)} / {formatHoursRounded(child.allowedHours * 60 * 60 * 1000)}
            </ThemedText>
        </Pressable>
    );
}