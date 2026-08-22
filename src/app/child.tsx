import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { ThemedText } from "@/components/themed-text";
import categories from "@/constants/categories";
import styles from "@/constants/styles";
import { formatDuration, formatTimer } from "@/constants/utils";
import { useStopwatchSession } from "@/hooks/use-stopwatch-session";

const pickerStyles = StyleSheet.create({
    table: { flexDirection: "row", marginBottom: 20 },
    childColumns: { flexDirection: "row", gap: 8 },
    childColumn: { width: 112 },
    childHeader: {
        height: 52,
        justifyContent: "center",
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#B8B1A6",
    },
    childName: { color: "#252A27", fontSize: 13, fontWeight: "800" },
    categoryButton: {
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 7,
        gap: 2,
        marginBottom: 6,
        borderWidth: 1.5,
        borderColor: "#D8D1C6",
        borderRadius: 8,
        backgroundColor: "#FBF9F5",
    },
    categoryButtonActive: { borderBottomColor: "transparent" },
    categoryButtonText: { fontSize: 10, fontWeight: "800" },
    categoryDuration: { fontSize: 9, fontWeight: "600" },
    childTimer: {
        height: 44,
        justifyContent: "center",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#B8B1A6",
    },
    childTimerLabel: { color: "#716D65", fontSize: 9, fontWeight: "700" },
    childTimerValue: { color: "#252A27", fontSize: 13, fontWeight: "800" },
});

export default function ChildScreen() {
	const { children, currentTime, assignChildActivity } = useStopwatchSession();

	return (
        <ScreenShell keyboardShouldPersistTaps="handled" verticalScrollEnabled={false}>
            <ScrollView horizontal showsHorizontalScrollIndicator={true} bounces={false}>
                <View style={pickerStyles.table}>
                    <View style={pickerStyles.childColumns}>
                        {children.map((child) => {
                            const activeSegment = child.segments[child.segments.length - 1];
                            const activeCategory = activeSegment?.category;
                            const activeDuration = activeSegment
                                ? (activeSegment.endedAt ?? currentTime) - activeSegment.startedAt
                                : 0;
                            return (
                                <View key={child.id} style={pickerStyles.childColumn}>
                                    <View style={pickerStyles.childHeader}>
                                        <ThemedText style={pickerStyles.childName}>{child.name}</ThemedText>
                                    </View>
                                    {categories.map((category) => {
                                        const isActive = activeCategory === category.name;
                                        const categoryDuration = child.segments.reduce(
                                            (total, segment) =>
                                                segment.category === category.name
                                                    ? total + Math.max(0, (segment.endedAt ?? currentTime) - segment.startedAt)
                                                    : total,
                                            0,
                                        );
                                        return (
                                            <Pressable
                                                key={category.name}
                                                onPress={() => assignChildActivity(child.id, category.name)}
                                                style={({ pressed }) => [
                                                    pickerStyles.categoryButton,
                                                    { borderColor: category.darkColor },
                                                    isActive && [pickerStyles.categoryButtonActive, { backgroundColor: category.color }],
                                                    pressed && styles.pressed,
                                                ]}
                                            >
                                                    <ThemedText
                                                        style={[
                                                            pickerStyles.categoryButtonText,
                                                            { color: isActive ? "#FFFFFF" : category.darkColor },
                                                        ]}
                                                    >
                                                        {category.shortName}
                                                    </ThemedText>
                                                    <ThemedText
                                                        style={[
                                                            pickerStyles.categoryDuration,
                                                            { color: isActive ? "#FFFFFF" : "#716D65" },
                                                        ]}
                                                    >
                                                        {formatDuration(categoryDuration)}
                                                    </ThemedText>
                                            </Pressable>
                                        );
                                    })}
                                    <View style={pickerStyles.childTimer}>
                                        <ThemedText style={pickerStyles.childTimerValue}>{formatTimer(activeDuration)}</ThemedText>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </ScreenShell>
	);
}