import { View } from "react-native";
import { SymbolView } from "expo-symbols";

import { ThemedText } from "@/components/themed-text";
import styles from "@/constants/styles";
import categories from "@/constants/categories";
import { formatDuration } from "@/constants/utils";

import type { Child } from "@/constants/types";

type TotalsCardProps = {
    children: Child[];
    currentTime: number;
};

export function TotalsCard({ children, currentTime }: TotalsCardProps) {
    return (
        <View style={styles.totalsCard}>
            {categories.map((category) => {
                const duration = children.reduce((total, child) => total + child.segments.reduce((childTotal, segment) => (
                    segment.category === category.name ? childTotal + (segment.endedAt ?? currentTime) - segment.startedAt : childTotal
                ), 0), 0);
                return duration > 0 ? (
                    <View key={category.name} style={styles.totalRow}>
                        <View style={styles.totalName}>
                            <SymbolView name={category.icon} size={18} tintColor={category.color} />
                            <ThemedText style={styles.totalLabel}>{category.shortName}</ThemedText>
                        </View>
                        <ThemedText style={styles.totalValue}>{formatDuration(duration)}</ThemedText>
                    </View>
                ) : null;
            })}
        </View>
    );
}