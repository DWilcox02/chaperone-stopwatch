import { Animated, PanResponder, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { formatClock, formatDuration } from "@/constants/utils";
import styles from "@/constants/styles";

import type { Category, Child, Segment } from "@/constants/types";

type ChildActivityCardProps = {
    child: Child;
    activeSegment: Segment;
    category: { name: Category; color: string };
    currentTime: number;
    isDragging: boolean;
    dragPosition: Animated.ValueXY;
    responder: ReturnType<typeof PanResponder.create>;
};

export function ChildActivityCard({
    child,
    activeSegment,
    category,
    currentTime,
    isDragging,
    dragPosition,
    responder,
}: ChildActivityCardProps) {
    return (
        <Animated.View
            {...responder.panHandlers}
            style={[
                styles.childCard,
                { borderLeftColor: child.color },
                isDragging && styles.childCardDragging,
                isDragging && { transform: dragPosition.getTranslateTransform() },
            ]}
        >
            <View style={styles.childCardTop}>
                <ThemedText style={styles.childCardName}>{child.name}</ThemedText>
                <ThemedText style={[styles.childCardTime, { color: category.color }]}> 
                    {formatDuration((activeSegment.endedAt ?? currentTime) - activeSegment.startedAt)}
                </ThemedText>
            </View>
            <ThemedText style={styles.childCardRole}>{child.role}</ThemedText>
            <ThemedText style={styles.childCardStarted}>Since {formatClock(activeSegment.startedAt)}</ThemedText>
        </Animated.View>
    );
}