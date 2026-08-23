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
};

export function ChildActivityModal({
    child,
    children,
    groups,
    onClose,
    onAssignActivity,
}: ChildActivityModalProps) {
    const activeCategory = child?.segments[child.segments.length - 1]?.category;

    return (
        <Modal visible={child !== null} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={styles.activityMenu} onPress={(event) => event.stopPropagation()}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <ThemedText style={styles.activityMenuTitle}>{child?.name}</ThemedText>
                        {categories.map((category) => (
                            <ActivityOption
                                key={category.name}
                                category={category}
                                child={child}
                                children={children}
                                groups={groups}
                                activeCategory={activeCategory}
                                onSelect={() => {
                                    onAssignActivity(category.name);
                                    onClose();
                                }}
                            />
                        ))}
                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

function ActivityOption({
    category,
    child,
    children,
    groups,
    activeCategory,
    onSelect,
}: {
    category: (typeof categories)[number];
    child: Child | null;
    children: Child[];
    groups: Group[];
    activeCategory: Category | undefined;
    onSelect: () => void;
}) {
    const group = groups.find((candidate) => candidate.childIds.some((childId) => {
        const groupChild = children.find((candidateChild) => candidateChild.id === childId);
        return groupChild?.segments[groupChild.segments.length - 1]?.category === category.name;
    }));
    const groupLabel = group?.childIds
        .map((childId) => children.find((groupChild) => groupChild.id === childId)?.name)
        .filter((name): name is string => name !== undefined)
        .join(", ");

    return (
        <Pressable
            style={({ pressed }) => [styles.activityOption, pressed && styles.pressed]}
            onPress={onSelect}
        >
            <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
            <View style={styles.activityOptionLabels}>
                <ThemedText style={styles.activityOptionText}>
                    {category.shortName}
                </ThemedText>
                {groupLabel && (
                    <ThemedText style={styles.groupOptionText}>{groupLabel}</ThemedText>
                )}
            </View>
            {child && activeCategory === category.name && (
                <ThemedText style={[styles.activityOptionCheck, { color: category.color }]}>Current</ThemedText>
            )}
        </Pressable>
    );
}
