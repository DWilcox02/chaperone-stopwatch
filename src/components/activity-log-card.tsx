import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { formatClock } from "@/constants/utils";
import styles from "@/constants/styles";

import type { Child } from "@/constants/types";

type ActivityLogCardProps = {
    children: Child[];
};

export function ActivityLogCard({ children }: ActivityLogCardProps) {
    return (
        <View style={styles.logCard}>
            {children.flatMap((child) => child.segments.map((segment) => ({ ...segment, child })))
                .sort((a, b) => b.startedAt - a.startedAt)
                .slice(0, 8)
                .map((entry, index) => (
                    <View key={`${entry.child.id}-${entry.startedAt}-${entry.category}`} style={styles.logRow}>
                        <View style={[styles.logLine, index === 0 && { backgroundColor: entry.child.color }]} />
                        <ThemedText style={styles.logTime}>{formatClock(entry.startedAt)}</ThemedText>
                        <ThemedText style={[styles.logActivity, index === 0 && styles.logActivityActive]}>
                            {entry.child.name} / {entry.category}
                        </ThemedText>
                    </View>
                ))}
        </View>
    );
}