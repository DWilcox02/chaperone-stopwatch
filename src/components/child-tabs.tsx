import { SetStateAction } from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { Child } from "../constants/types";
import styles from '@/constants/styles';
import { formatHoursMinutes, formatHoursRounded } from '@/constants/utils';
import { Dispatch } from 'react';

interface ChildCardProps {
    child: Child,
    selectedChild: Child,
    setSelectedChildId: Dispatch<SetStateAction<string>>,
    currentTime: number,
}

interface ChildTabsProps {
    children: Child[],
    selectedChild: Child,
    setSelectedChildId: Dispatch<SetStateAction<string>>,
    currentTime: number,
}


function ChildCard({
    child,
    selectedChild,
    setSelectedChildId,
    currentTime,
} : ChildCardProps) {
    const workedMilliseconds = child.segments.reduce((total, segment) => (
        total + (segment.endedAt ?? currentTime) - segment.startedAt
    ), 0);

    return (
        <Pressable
            onPress={() => setSelectedChildId(child.id)}
            style={[
                styles.childTab,
                selectedChild.id === child.id && styles.childTabSelected,
            ]}
        >
            <View style={[styles.avatar, { backgroundColor: child.color }]}>
                <ThemedText style={styles.avatarText}>
                    {child.name[0]}
                </ThemedText>
            </View>
            <View style={styles.childDetails}>
                <ThemedText style={styles.childHours}>
                    {formatHoursMinutes(workedMilliseconds)} / {formatHoursRounded(child.allowedHours * 60 * 60 * 1000)}
                </ThemedText>
                <View>
                    <ThemedText style={styles.childName}>
                        {child.name}
                    </ThemedText>
                    <ThemedText style={styles.childRole}>
                        {child.role}
                    </ThemedText>
                </View>
            </View>
        </Pressable>
    )

}


export default function ChildTabs({
    children,
    selectedChild,
    setSelectedChildId,
    currentTime,
} : ChildTabsProps) {
    return (
        <View style={styles.childTabs}>
            {children.map((child) => (
                <ChildCard
                    key={child.id}
                    child={child}
                    selectedChild={selectedChild}
                    setSelectedChildId={setSelectedChildId}
                    currentTime={currentTime}
                />
            ))}
        </View>
    )
}