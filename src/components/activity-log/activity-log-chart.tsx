import { View } from "react-native";
import { SymbolView } from "expo-symbols";

import { ThemedText } from "@/components/themed-text";
import categories from "@/constants/categories";
import styles from "@/constants/styles";
import { formatDuration, formatHoursRounded } from "@/constants/utils";

import type { Category, Child } from "@/constants/types";

type ActivityLogChartProps = {
    children: Child[];
    selectedChildId: string | null;
    currentTime: number;
};

function getCategoryDuration(children: Child[], category: Category, currentTime: number) {
    return children.reduce(
        (total, child) =>
            total +
            child.segments.reduce(
                (childTotal, segment) =>
                    segment.category === category
                        ? childTotal + Math.max(0, (segment.endedAt ?? currentTime) - segment.startedAt)
                        : childTotal,
                0,
            ),
        0,
    );
}

function getAllowedHours(child: Child, category: Category) {
    return child.allowedHoursByCategory?.[category] ?? (category === "Performance" ? child.allowedHours : undefined);
}

export function ActivityLogChart({ children, selectedChildId, currentTime }: ActivityLogChartProps) {
    const chartChildren = selectedChildId === null ? children : children.filter((child) => child.id === selectedChildId);
    const selectedChild = selectedChildId === null ? undefined : chartChildren[0];
    const values = categories.map((category) => ({
        ...category,
        duration: getCategoryDuration(chartChildren, category.name, currentTime),
        allowedHours: selectedChild ? getAllowedHours(selectedChild, category.name) : undefined,
    }));
    const scale = Math.max(
        60 * 60 * 1000,
        ...values.map(({ duration, allowedHours }) => Math.max(duration, (allowedHours ?? 0) * 60 * 60 * 1000)),
    ) * 1.12;

    return (
        <View style={styles.logChartCard}>
            <View style={styles.logChart}>
                {values.map((category) => {
                    const durationRatio = Math.min(category.duration / scale, 1);
                    const allowedRatio = category.allowedHours === undefined
                        ? undefined
                        : Math.min((category.allowedHours * 60 * 60 * 1000) / scale, 1);
                    const limitLabelBottom = allowedRatio !== undefined && allowedRatio > 0.82
                        ? allowedRatio * 220 - 14
                        : (allowedRatio ?? 0) * 220 + 4;
                    return (
                        <View
                            key={category.name}
                            style={styles.logChartColumn}
                            accessible
                            accessibilityLabel={`${category.name}: ${formatDuration(category.duration)}${
                                category.allowedHours === undefined ? "" : `, ${category.allowedHours} hour limit`
                            }`}
                        >
                            <ThemedText style={styles.logChartValue}>{formatHoursRounded(category.duration)}</ThemedText>
                            <View style={styles.logChartTrack}>
                                <View
                                    style={[
                                        styles.logChartBar,
                                        { height: `${Math.max(durationRatio * 100, category.duration > 0 ? 3 : 0)}%`, backgroundColor: category.color },
                                    ]}
                                />
                                {allowedRatio !== undefined && (
                                    <>
                                        <View style={[styles.logChartLimit, { bottom: `${allowedRatio * 100}%` }]} />
                                        <ThemedText style={[styles.logChartLimitLabel, { bottom: limitLabelBottom }]}>
                                            {formatHoursRounded((category.allowedHours ?? 0) * 60 * 60 * 1000)}
                                        </ThemedText>
                                    </>
                                )}
                            </View>
                            <SymbolView name={category.icon} size={16} tintColor={category.color} />
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
