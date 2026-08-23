import { Pressable, View } from "react-native";
import { SymbolView } from "expo-symbols";
import type { SFSymbol } from "sf-symbols-typescript";

import { ThemedText } from "@/components/themed-text";
import styles from "@/constants/styles";
import { formatDuration, formatHoursMinutes, formatHoursRounded } from "@/constants/utils";

import type { Category, Child } from "@/constants/types";

type ChildActivityPickerButtonProps = {
    child: Child;
    category: { name: Category; shortName: string; icon: SFSymbol; color: string; darkColor: string };
    currentTime: number;
    isActive: boolean;
    onAssignActivity: (childId: string, category: Category) => void;
};

export function ChildActivityPickerButton({
    child,
    category,
    currentTime,
    isActive,
    onAssignActivity,
}: ChildActivityPickerButtonProps) {
    const duration = child.segments.reduce(
        (total, segment) =>
            segment.category === category.name
                ? total + Math.max(0, (segment.endedAt ?? currentTime) - segment.startedAt)
                : total,
        0,
    );

    return (
        <Pressable
            onPress={() => onAssignActivity(child.id, category.name)}
            style={({ pressed }) => [
                styles.pickerButton,
                { borderColor: category.darkColor },
                isActive && [styles.pickerButtonActive, { backgroundColor: category.color }],
                pressed && styles.pressed,
            ]}
        >
            <View style={styles.pickerLabelRow}>
                <SymbolView
                    name={category.icon}
                    size={13}
                    tintColor={isActive ? "#FFFFFF" : category.darkColor}
                />
                <ThemedText style={[styles.pickerLabel, { color: isActive ? "#FFFFFF" : category.darkColor }]}>
                    {category.shortName}
                </ThemedText>
            </View>
            <ThemedText style={[styles.pickerDuration, { color: isActive ? "#FFFFFF" : "#716D65" }]}>
                {formatDuration(duration)}
                {category.name === "Performance" &&
                    ` / ${formatHoursRounded(child.allowedHours * 60 * 60 * 1000)}`}
            </ThemedText>
        </Pressable>
    );
}