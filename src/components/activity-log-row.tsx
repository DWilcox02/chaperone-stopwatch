import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { formatClock } from "@/constants/utils";
import styles from "@/constants/styles";

import type { Child, Segment } from "@/constants/types";

type ActivityLogRowProps = {
    child: Child;
    segment: Segment;
    isLatest: boolean;
};

export function ActivityLogRow({ child, segment, isLatest }: ActivityLogRowProps) {
    return (
        <View style={styles.logRow}>
            <View style={[styles.logLine, isLatest && { backgroundColor: child.color }]} />
            <ThemedText style={styles.logTime}>{formatClock(segment.startedAt)}</ThemedText>
            <ThemedText style={[styles.logActivity, isLatest && styles.logActivityActive]}>
                {child.name} / {segment.category}
            </ThemedText>
        </View>
    );
}