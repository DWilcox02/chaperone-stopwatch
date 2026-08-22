import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Dropdown from "react-native-input-select";

import { ThemedText } from "@/components/themed-text";
import categories from "@/constants/categories";
import styles from "@/constants/styles";
import type { Child } from "@/constants/types";
import { useStopwatchSession } from "@/hooks/use-stopwatch-session";

const pickerStyles = StyleSheet.create({
	picker: { marginBottom: 28 },
	pickerLabel: { color: "#9A948A", fontSize: 10, fontWeight: "800", letterSpacing: 1.1, marginBottom: 9 },
    dropdown: {
        minHeight: 52,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "#D8D1C6",
        borderRadius: 12,
        backgroundColor: "#FFFDF9",
    },
    dropdownContainer: { marginBottom: 0 },
	selectedMeta: { color: "#716D65", fontSize: 12, marginTop: 8 },
});

export default function ChildScreen() {
	const { children, assignChildActivity } = useStopwatchSession();
	const [selectedChildId, setSelectedChildId] = useState(children[0]?.id ?? "");

	const selectedChild = children.find((child) => child.id === selectedChildId) ?? children[0];
    const childOptions = children.map((child) => ({
        label: `${child.name}`,
        value: child.id,
    }));

	return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

                <View style={pickerStyles.picker}>
                    <ThemedText style={pickerStyles.pickerLabel}>CHILD</ThemedText>
                    <Dropdown
                        options={childOptions}
                        selectedValue={selectedChildId}
                        onValueChange={(value) => setSelectedChildId(String(value))}
                        placeholder="Select a child"
                        primaryColor="#E7684A"
                        dropdownStyle={pickerStyles.dropdown}
                        dropdownContainerStyle={pickerStyles.dropdownContainer}
                    />
                </View>

                <View style={styles.categoryGrid}>
                    {categories.map((category) => {
                        const activeCategory = selectedChild?.segments[selectedChild.segments.length - 1]?.category;
                        const isActive = activeCategory === category.name;
                        const prominent = category.prominent ?? false;
                        return (
                            <Pressable
                                key={category.name}
                                disabled={!selectedChild}
                                onPress={() => selectedChild && assignChildActivity(selectedChild.id, category.name)}
                                style={({ pressed }) => [
                                    styles.categoryButton,
                                    isActive && { borderColor: category.color, backgroundColor: "#FFFDF9" },
                                    pressed && styles.pressed,
                                    prominent && styles.categoryProminent
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