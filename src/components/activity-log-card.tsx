import { View } from "react-native";

import { ActivityLogRow } from "@/components/activity-log-row";
import styles from "@/constants/styles";

import type { Child } from "@/constants/types";

type ActivityLogCardProps = {
    children: Child[];
};

export function ActivityLogCard({ children }: ActivityLogCardProps) {
    const entries = children
        .flatMap((child) => child.segments.map((segment) => ({ child, segment })))
        .sort((a, b) => b.segment.startedAt - a.segment.startedAt)
        .slice(0, 8);

    return (
        <View style={styles.logCard}>
            {entries.map((entry, index) => (
                <ActivityLogRow
                    key={`${entry.child.id}-${entry.segment.startedAt}-${entry.segment.category}`}
                    child={entry.child}
                    segment={entry.segment}
                    isLatest={index === 0}
                />
            ))}
        </View>
    );
}