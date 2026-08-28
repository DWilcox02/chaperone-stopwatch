import { View } from "react-native";
import { Modal, Pressable } from "react-native";
import { useState } from "react";
import { SymbolView } from "expo-symbols";

import { ThemedText } from "@/components/themed-text";
import styles from "@/constants/styles";
import type { Child } from "@/constants/types";

type ActivityLogHeaderProps = {
    children: Child[];
    selectedChildId: string | null;
    onSelectChild: (childId: string | null) => void;
};

export function ActivityLogHeader({ children, selectedChildId, onSelectChild }: ActivityLogHeaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedChild = children.find((child) => child.id === selectedChildId);

    return (
        <>
            <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>
                    {selectedChild ? `${selectedChild.name}'s recent activities` : "All recent activity"}
                </ThemedText>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Choose a child's activity history"
                    onPress={() => setIsOpen(true)}
                    style={({ pressed }) => [styles.logFilter, pressed && styles.pressed]}
                >
                    <ThemedText style={styles.logFilterText}>{selectedChild?.name ?? "All children"}</ThemedText>
                    <SymbolView name="chevron.down" size={17} />
                </Pressable>
            </View>
            <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
                <Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
                    <View style={styles.logFilterMenu}>
                        <Pressable
                            style={({ pressed }) => [styles.logFilterOption, pressed && styles.pressed]}
                            onPress={() => {
                                onSelectChild(null);
                                setIsOpen(false);
                            }}
                        >
                            <ThemedText style={styles.logFilterOptionText}>All children</ThemedText>
                            {!selectedChildId && <ThemedText style={styles.logFilterCheck}>Selected</ThemedText>}
                        </Pressable>
                        {children.map((child) => (
                            <Pressable
                                key={child.id}
                                style={({ pressed }) => [styles.logFilterOption, pressed && styles.pressed]}
                                onPress={() => {
                                    onSelectChild(child.id);
                                    setIsOpen(false);
                                }}
                            >
                                <View style={[styles.logFilterDot, { backgroundColor: child.color }]} />
                                <ThemedText style={styles.logFilterOptionText}>{child.name}</ThemedText>
                                {selectedChildId === child.id && <ThemedText style={styles.logFilterCheck}>Selected</ThemedText>}
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}