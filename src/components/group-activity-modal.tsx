import { Modal, Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import categories from "@/constants/categories";
import styles from "@/constants/styles";
import type { Category, Group } from "@/constants/types";

type GroupActivityModalProps = {
    group: Group | null;
    onClose: () => void;
    onAssignActivity: (category: Category) => void;
};

export function GroupActivityModal({ group, onClose, onAssignActivity }: GroupActivityModalProps) {
    return (
        <Modal visible={group !== null} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={styles.activityMenu} onPress={(event) => event.stopPropagation()}>
                    <ThemedText style={styles.activityMenuTitle}>{group?.name}</ThemedText>
                    <ThemedText style={styles.menuLabel}>ASSIGN ACTIVITY TO GROUP</ThemedText>
                    {categories.map((category) => (
                        <Pressable
                            key={category.name}
                            style={({ pressed }) => [styles.activityOption, pressed && styles.pressed]}
                            onPress={() => {
                                onAssignActivity(category.name);
                                onClose();
                            }}
                        >
                            <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                            <ThemedText style={styles.activityOptionText}>{category.shortName}</ThemedText>
                        </Pressable>
                    ))}
                </Pressable>
            </Pressable>
        </Modal>
    );
}
