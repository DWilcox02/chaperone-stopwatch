import { Modal, Pressable, ScrollView, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import categories from "@/constants/categories";
import styles from "@/constants/styles";
import type { Category, Child, Group } from "@/constants/types";

type ChildActivityModalProps = {
    child: Child | null;
    children: Child[];
    groups: Group[];
    onClose: () => void;
    onAssignActivity: (category: Category) => void;
    onAddToGroup: (groupId: string) => void;
    onCreateGroup: () => void;
};

export function ChildActivityModal({
    child,
    children,
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
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <ThemedText style={styles.activityMenuTitle}>{child?.name}</ThemedText>
                        <ThemedText style={styles.menuLabel}>GROUP</ThemedText>
                        {groups.filter((group) => !group.childIds.includes(child?.id ?? "")).map((group) => {
                            const groupChildren = group.childIds
                                .map((childId) => children.find((groupChild) => groupChild.id === childId)?.name)
                                .filter((name): name is string => name !== undefined);
                            const groupLabel = groupChildren.length > 2
                                ? `${groupChildren.slice(0, -1).join(", ")}, & ${groupChildren[groupChildren.length - 1]}`
                                : groupChildren.join(" & ");

                            return (
                                <Pressable
                                    key={group.id}
                                    style={({ pressed }) => [styles.activityOption, pressed && styles.pressed]}
                                    onPress={() => {
                                        if (child) onAddToGroup(group.id);
                                        onClose();
                                    }}
                                >
                                    <ThemedText style={styles.activityOptionText}>{groupLabel || group.name}</ThemedText>
                                </Pressable>
                            );
                        })}
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
                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
