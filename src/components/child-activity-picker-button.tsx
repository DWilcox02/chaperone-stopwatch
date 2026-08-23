import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import styles from "@/constants/styles";
import { formatDuration } from "@/constants/utils";

import type { Category, Child } from "@/constants/types";

type ChildActivityPickerButtonProps = {
    child: Child;
    category: { name: Category; shortName: string; color: string; darkColor: string };
    currentTime: number;
    isActive: boolean;
    onAssignActivity: (childId: string, category: Category) => void;
};

const pickerStyles = StyleSheet.create({
    button: {
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 7,
        gap: 2,
        marginBottom: 6,
        borderWidth: 1.5,
        borderRadius: 8,
        backgroundColor: "#FBF9F5",
    },
    active: { borderBottomColor: "transparent" },
    label: { fontSize: 10, fontWeight: "800" },
    duration: { fontSize: 9, fontWeight: "600" },
});

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
                pickerStyles.button,
                { borderColor: category.darkColor },
                isActive && [pickerStyles.active, { backgroundColor: category.color }],
                pressed && styles.pressed,
            ]}
        >
            <ThemedText style={[pickerStyles.label, { color: isActive ? "#FFFFFF" : category.darkColor }]}>
                {category.shortName}
            </ThemedText>
            <ThemedText style={[pickerStyles.duration, { color: isActive ? "#FFFFFF" : "#716D65" }]}>
                {formatDuration(duration)}
            </ThemedText>
        </Pressable>
    );
}