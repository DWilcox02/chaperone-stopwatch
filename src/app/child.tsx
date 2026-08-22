import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import categories from "@/constants/categories";
import styles from "@/constants/styles";
import type { Child } from "@/constants/types";
import { useStopwatchSession } from "@/hooks/use-stopwatch-session";

const pickerStyles = StyleSheet.create({
	picker: { marginBottom: 28 },
	pickerLabel: { color: "#9A948A", fontSize: 10, fontWeight: "800", letterSpacing: 1.1, marginBottom: 9 },
	searchInput: {
		minHeight: 52,
		paddingHorizontal: 16,
		borderWidth: 1,
		borderColor: "#D8D1C6",
		borderRadius: 12,
		backgroundColor: "#FFFDF9",
		color: "#252A27",
		fontSize: 15,
		fontWeight: "700",
	},
	results: {
		marginTop: 6,
		padding: 6,
		borderWidth: 1,
		borderColor: "#E3DED5",
		borderRadius: 12,
		backgroundColor: "#FFFDF9",
	},
	result: { minHeight: 44, justifyContent: "center", paddingHorizontal: 10, borderRadius: 8 },
	resultSelected: { backgroundColor: "#F0EBE2" },
	resultName: { color: "#252A27", fontSize: 14, fontWeight: "700" },
	resultRole: { color: "#9A948A", fontSize: 10, marginTop: 2 },
	emptyResults: { color: "#9A948A", fontSize: 12, padding: 10 },
	selectedMeta: { color: "#716D65", fontSize: 12, marginTop: 8 },
});

export default function ChildScreen() {
	const { children, assignChildActivity } = useStopwatchSession();
	const [selectedChildId, setSelectedChildId] = useState(children[0]?.id ?? "");
	const [search, setSearch] = useState("");

	const selectedChild = children.find((child) => child.id === selectedChildId) ?? children[0];
	const normalizedSearch = search.trim().toLowerCase();
	const filteredChildren = children.filter((child) =>
		`${child.name} ${child.role}`.toLowerCase().includes(normalizedSearch),
	);

	function selectChild(child: Child) {
		setSelectedChildId(child.id);
		setSearch("");
	}

	return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <View>
                        <ThemedText style={styles.kicker}>SETTIME / CHILD</ThemedText>
                        <ThemedText style={styles.heading}>Choose activity</ThemedText>
                    </View>
                </View>

                <View style={pickerStyles.picker}>
                    <ThemedText style={pickerStyles.pickerLabel}>CHILD</ThemedText>
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder={selectedChild?.name ?? "Search children"}
                        placeholderTextColor="#9A948A"
                        style={pickerStyles.searchInput}
                        accessibilityLabel="Search children"
                    />
                    {search.length > 0 && (
                        <View style={pickerStyles.results}>
                            {filteredChildren.length > 0 ? (
                                filteredChildren.map((child) => (
                                    <Pressable
                                        key={child.id}
                                        onPress={() => selectChild(child)}
                                        style={({ pressed }) => [
                                            pickerStyles.result,
                                            child.id === selectedChild?.id && pickerStyles.resultSelected,
                                            pressed && styles.pressed,
                                        ]}
                                    >
                                        <ThemedText style={pickerStyles.resultName}>{child.name}</ThemedText>
                                        <ThemedText style={pickerStyles.resultRole}>{child.role}</ThemedText>
                                    </Pressable>
                                ))
                            ) : (
                                <ThemedText style={pickerStyles.emptyResults}>No children found</ThemedText>
                            )}
                        </View>
                    )}
                    {selectedChild && (
                        <ThemedText style={pickerStyles.selectedMeta}>
                            Selected: {selectedChild.name} - {selectedChild.role}
                        </ThemedText>
                    )}
                </View>

                <View style={styles.sectionHeader}>
                    <ThemedText style={styles.sectionTitle}>Activity</ThemedText>
                    <ThemedText style={styles.sectionHint}>Tap to start</ThemedText>
                </View>
                <View style={styles.categoryGrid}>
                    {categories.map((category) => {
                        const activeCategory = selectedChild?.segments[selectedChild.segments.length - 1]?.category;
                        const isActive = activeCategory === category.name;
                        return (
                            <Pressable
                                key={category.name}
                                disabled={!selectedChild}
                                onPress={() => selectedChild && assignChildActivity(selectedChild.id, category.name)}
                                style={({ pressed }) => [
                                    styles.categoryButton,
                                    isActive && { borderColor: category.color, backgroundColor: "#FFFDF9" },
                                    pressed && styles.pressed,
                                ]}
                            >
                                <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                                <ThemedText style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                                    {category.shortName}
                                </ThemedText>
                                {isActive && <ThemedText style={[styles.check, { color: category.color }]}>OK</ThemedText>}
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
	);
}