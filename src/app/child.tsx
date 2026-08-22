import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { ThemedText } from "@/components/themed-text";
import categories from "@/constants/categories";
import styles from "@/constants/styles";
import { useStopwatchSession } from "@/hooks/use-stopwatch-session";

const pickerStyles = StyleSheet.create({
    table: { flexDirection: "row", marginBottom: 20 },
    categoryLabels: { width: 88, paddingTop: 48 },
    categoryLabel: {
        height: 46,
        justifyContent: "center",
        paddingRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E0D8",
    },
    categoryLabelText: { color: "#716D65", fontSize: 10, fontWeight: "800" },
    childColumns: { flexDirection: "row", gap: 8 },
    childColumn: { width: 112 },
    childHeader: {
        height: 48,
        justifyContent: "center",
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#B8B1A6",
    },
    childName: { color: "#252A27", fontSize: 13, fontWeight: "800" },
    categoryButton: {
        height: 46,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E0D8",
        backgroundColor: "#FBF9F5",
    },
    categoryButtonActive: { backgroundColor: "#FFFDF9" },
    categoryDot: { width: 8, height: 8, borderRadius: 4, marginRight: 7 },
    check: { fontSize: 10, fontWeight: "800" },
});

export default function ChildScreen() {
	const { children, assignChildActivity } = useStopwatchSession();

	return (
        <ScreenShell keyboardShouldPersistTaps="handled">
            <ScrollView horizontal showsHorizontalScrollIndicator={true} bounces={false}>
                <View style={pickerStyles.table}>
                    <View style={pickerStyles.categoryLabels}>
                        {categories.map((category) => (
                            <View key={category.name} style={pickerStyles.categoryLabel}>
                                <ThemedText style={pickerStyles.categoryLabelText}>{category.shortName}</ThemedText>
                            </View>
                        ))}
                    </View>
                    <View style={pickerStyles.childColumns}>
                        {children.map((child) => {
                            const activeCategory = child.segments[child.segments.length - 1]?.category;
                            return (
                                <View key={child.id} style={pickerStyles.childColumn}>
                                    <View style={pickerStyles.childHeader}>
                                        <ThemedText style={pickerStyles.childName}>{child.name}</ThemedText>
                                    </View>
                                    {categories.map((category) => {
                                        const isActive = activeCategory === category.name;
                                        return (
                                            <Pressable
                                                key={category.name}
                                                onPress={() => assignChildActivity(child.id, category.name)}
                                                style={({ pressed }) => [
                                                    pickerStyles.categoryButton,
                                                    isActive && pickerStyles.categoryButtonActive,
                                                    pressed && styles.pressed,
                                                ]}
                                            >
                                                <View style={[pickerStyles.categoryDot, { backgroundColor: category.color }]} />
                                                {isActive && (
                                                    <ThemedText style={[pickerStyles.check, { color: category.color }]}>OK</ThemedText>
                                                )}
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </ScreenShell>
	);
}