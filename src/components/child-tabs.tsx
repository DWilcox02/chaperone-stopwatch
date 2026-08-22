import { SetStateAction, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth } from '@/constants/theme';
import type { Category, Segment, Child } from "../constants/types";
import styles from '@/constants/styles';
import { formatClock, formatDuration } from '@/constants/utils';
import { Dispatch } from 'react';

interface ChildCardProps {
    child: Child,
    selectedChild: Child,
    setSelectedChildId: Dispatch<SetStateAction<string>>
}

interface ChildTabsProps {
    children: Child[],
    selectedChild: Child,
    setSelectedChildId: Dispatch<SetStateAction<string>>
}


function ChildCard({
    child,
    selectedChild,
    setSelectedChildId
} : ChildCardProps) {
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
            <View>
                <ThemedText style={styles.childName}>
                    {child.name}
                </ThemedText>
                <ThemedText style={styles.childRole}>
                    {child.role}
                </ThemedText>
            </View>
        </Pressable>
    )

}


export default function ChildTabs({
    children,
    selectedChild,
    setSelectedChildId
} : ChildTabsProps) {
    return (
        <View style={styles.childTabs}>
            {children.map((child) => (
                <ChildCard
                    key={child.id}
                    child={child}
                    selectedChild={selectedChild}
                    setSelectedChildId={setSelectedChildId}
                />
            ))}
        </View>
    )
}