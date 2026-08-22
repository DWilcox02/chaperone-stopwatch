import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActivityBoard } from "@/components/activity-board";
import { ActivityLogCard } from "@/components/activity-log-card";
import { ThemedText } from "@/components/themed-text";
import { TotalsCard } from "@/components/totals-card";
import styles from "@/constants/styles";
import { useStopwatchSession } from "@/hooks/use-stopwatch-session";

// interface StopwatchScreenProps {
//     children: Child[]
// }

export default function StopwatchScreen() {
    const {
        children,
        groups,
        currentTime,
        totalDuration,
        assignChildActivity,
        assignGroupActivity,
        addChildToGroup,
        createGroup,
    } = useStopwatchSession();

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={true}
                >
                    <View style={styles.header}>
                        <View>
                            <ThemedText style={styles.kicker}>SETTIME / TODAY</ThemedText>
                            <ThemedText style={styles.heading}>On set</ThemedText>
                        </View>
                        <View style={styles.datePill}>
                            <ThemedText style={styles.dateText}>SAT 22 AUG</ThemedText>
                        </View>
                    </View>

                    <ActivityBoard
                        children={children}
                        groups={groups}
                        currentTime={currentTime}
                        totalDuration={totalDuration}
                        onAssignChildActivity={assignChildActivity}
                        onAssignGroupActivity={assignGroupActivity}
                        onAddChildToGroup={addChildToGroup}
                        onCreateGroup={createGroup}
                    />

                    <View style={styles.sectionHeader}>
                        <ThemedText style={styles.sectionTitle}>Today&apos;s totals</ThemedText>
                        <ThemedText style={styles.sectionHint}>All children</ThemedText>
                    </View>
                    <TotalsCard children={children} currentTime={currentTime} />

                    <View style={styles.sectionHeader}>
                        <ThemedText style={styles.sectionTitle}>Activity log</ThemedText>
                        <ThemedText style={styles.sectionHint}>Latest first</ThemedText>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
