import { Modal, Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import categories from "@/constants/categories";
import styles from "@/constants/styles";
import type { Category, Child, Group } from "@/constants/types";

type ChildActivityModalProps = {
    child: Child | null;
    groups: Group[];
    onClose: () => void;
    onAssignActivity: (category: Category) => void;
    onAddToGroup: (groupId: string) => void;
    onCreateGroup: () => void;
};

export function ChildActivityModal({
    child,
    groups,
    onClose,
    onAssignActivity,
    onAddToGroup,
    onCreateGroup,
}: ChildActivityModalProps) {
    return (
        <Modal visible={child !== null} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={styles.activityMenu} onPress={(event) => event.stopPropagation()}>
                    <ThemedText style={styles.activityMenuTitle}>{child?.name}</ThemedText>
                    <ThemedText style={styles.menuLabel}>GROUP</ThemedText>
                    {groups.filter((group) => !group.childIds.includes(child?.id ?? "")).map((group) => (
                        <Pressable
                            key={group.id}
                            style={({ pressed }) => [styles.activityOption, pressed && styles.pressed]}
                            onPress={() => {
                                if (child) onAddToGroup(group.id);
                                onClose();
                            }}
                        >
                            <ThemedText style={styles.activityOptionText}>{group.name}</ThemedText>
                            <ThemedText style={styles.activityOptionCheck}>{group.childIds.length} children</ThemedText>
                        </Pressable>
                    ))}
                    <Pressable
                        style={({ pressed }) => [styles.activityOption, pressed && styles.pressed]}
                        onPress={() => {
                            if (child) onCreateGroup();
                            onClose();
                        }}
                    >
                        <ThemedText style={styles.activityOptionText}>New group with {child?.name}</ThemedText>
                    </Pressable>
                    <ThemedText style={styles.menuLabel}>ACTIVITY</ThemedText>
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
                            {child?.segments[child.segments.length - 1].category === category.name && (
                                <ThemedText style={[styles.activityOptionCheck, { color: category.color }]}>Current</ThemedText>
                            )}
                        </Pressable>
                    ))}
                </Pressable>
            </Pressable>
        </Modal>
    );
}
