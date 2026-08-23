import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth } from '@/constants/theme';
import type { Category, Segment, Child } from "../constants/types";
import styles from '@/constants/styles';
import { formatClock, formatDuration } from '@/constants/utils';

interface CurrentActivityCardProps {
    activeSegment: Segment,
    currentTime: number
}

export default function CurrentActivityCard({
    activeSegment,
    currentTime
} : CurrentActivityCardProps) {

    return (
        <View style={styles.currentCard}>
            <View style={styles.currentTop}>
                <ThemedText style={styles.cardLabel}>
                    CURRENT ACTIVITY
                </ThemedText>
                <View style={styles.live}>
                    <View style={styles.liveDot} />
                    <ThemedText style={styles.liveText}>LIVE</ThemedText>
                </View>
            </View>
            <ThemedText style={styles.activityName}>
                {activeSegment.category}
            </ThemedText>
            <ThemedText style={styles.elapsed}>
                {formatDuration(currentTime - activeSegment.startedAt)}
            </ThemedText>
            <ThemedText style={styles.started}>
                Started at {formatClock(activeSegment.startedAt)}
            </ThemedText>
        </View>
    )
}