import { useRef, useState } from "react";
import { Animated, PanResponder, ScrollView, View } from "react-native";

import { ChildActivityCard } from "@/components/child-activity-card";
import { ThemedText } from "@/components/themed-text";
import categories from "@/constants/categories";
import styles from "@/constants/styles";
import { formatDuration } from "@/constants/utils";

import type { Category, Child } from "@/constants/types";

type ActivityBoardProps = {
    children: Child[];
    currentTime: number;
    totalDuration: number;
    onMoveChild: (childId: string, category: Category) => void;
};

export function ActivityBoard({ children, currentTime, totalDuration, onMoveChild }: ActivityBoardProps) {
    const [draggingChildId, setDraggingChildId] = useState<string | null>(null);
    const dragPosition = useRef(new Animated.ValueXY()).current;
    const categoryRefs = useRef<Record<Category, View | null>>({} as Record<Category, View | null>);

    function dropChild(childId: string, moveX: number, moveY: number) {
        const checks = categories.map((category) => new Promise<Category | null>((resolve) => {
            categoryRefs.current[category.name]?.measureInWindow((x, y, width, height) => {
                resolve(moveX >= x && moveX <= x + width && moveY >= y && moveY <= y + height ? category.name : null);
            });
        }));
        Promise.all(checks).then((matches) => {
            const category = matches.find(Boolean);
            if (category) onMoveChild(childId, category);
        });
    }

    function createDragResponder(child: Child) {
        return PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setDraggingChildId(child.id);
                dragPosition.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event([
                null,
                { dx: dragPosition.x, dy: dragPosition.y },
            ], { useNativeDriver: false }),
            onPanResponderRelease: (_, gestureState) => {
                dropChild(child.id, gestureState.moveX, gestureState.moveY);
                setDraggingChildId(null);
                Animated.spring(dragPosition, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
            },
            onPanResponderTerminate: () => {
                setDraggingChildId(null);
                Animated.spring(dragPosition, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
            },
        });
    }

    return (
        <>
            <View style={styles.boardIntro}>
                <View>
                    <ThemedText style={styles.sectionTitle}>Live board</ThemedText>
                    <ThemedText style={styles.sectionHint}>Drag a child to start their next activity</ThemedText>
                </View>
                <ThemedText style={styles.boardTotal}>{formatDuration(totalDuration)} tracked</ThemedText>
            </View>

            <ScrollView contentContainerStyle={styles.board}>
                {categories.map((category) => {
                    const columnChildren = children.filter((child) => (
                        child.segments[child.segments.length - 1].category === category.name
                    ));

                    return (
                        <View
                            key={category.name}
                            ref={(ref) => { categoryRefs.current[category.name] = ref; }}
                            style={styles.activityColumn}
                        >
                            <View style={styles.activityHeader}>
                                <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                                <ThemedText style={styles.activityTitle}>{category.shortName}</ThemedText>
                                <ThemedText style={styles.activityCount}>{columnChildren.length}</ThemedText>
                            </View>
                            <View style={[styles.dropZone, { borderColor: `${category.color}45` }]}> 
                                {columnChildren.map((child) => (
                                    <ChildActivityCard
                                        key={child.id}
                                        child={child}
                                        activeSegment={child.segments[child.segments.length - 1]}
                                        category={category}
                                        currentTime={currentTime}
                                        isDragging={draggingChildId === child.id}
                                        dragPosition={dragPosition}
                                        responder={createDragResponder(child)}
                                    />
                                ))}
                                {!columnChildren.length && <ThemedText style={styles.emptyColumn}>Drop here</ThemedText>}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </>
    );
}