import { Modal, Pressable, View } from "react-native";
import { SymbolView } from "expo-symbols";

import { ThemedText } from "@/components/themed-text";
import categories from "@/constants/categories";
import styles from "@/constants/styles";
import type { Category, Child, Group } from "@/constants/types";

type GroupActivityModalProps = {
    group: Group | null;
    children: Child[];
    onClose: () => void;
    onAssignActivity: (category: Category) => void;
};

export function GroupActivityModal({ group, children, onClose, onAssignActivity }: GroupActivityModalProps) {
    const childNames = group?.childIds
        .map((childId) => children.find((child) => child.id === childId)?.name)
        .filter((name): name is string => name !== undefined)
        .join(", ");

    return (
        <Modal visible={group !== null} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={styles.activityMenu} onPress={(event) => event.stopPropagation()}>
                    <ThemedText style={styles.activityMenuTitle}>{childNames}</ThemedText>
                    {categories.map((category) => (
                        <Pressable
                            key={category.name}
                            style={({ pressed }) => [styles.activityOption, pressed && styles.pressed]}
                            onPress={() => {
                                onAssignActivity(category.name);
                                onClose();
                            }}
                        >
                            <SymbolView name={category.icon} size={18} tintColor={category.color} />
                            <ThemedText style={styles.activityOptionText}>{category.shortName}</ThemedText>
                        </Pressable>
                    ))}
                </Pressable>
            </Pressable>
        </Modal>
    );
}
