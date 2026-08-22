import { ScrollView, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ActivityLogCard } from "@/components/activity-log-card";
import { useStopwatchSession } from "@/hooks/use-stopwatch-session";
import { TotalsCard } from "@/components/totals-card";
import styles from "@/constants/styles";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LogScreen() {
    const { children, currentTime } = useStopwatchSession();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Activity log</ThemedText>
                <ThemedText style={styles.sectionHint}>Latest first</ThemedText>
            </View>
            <ActivityLogCard children={children} />

            <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Today&apos;s totals</ThemedText>
                <ThemedText style={styles.sectionHint}>All children</ThemedText>
            </View>
            <TotalsCard children={children} currentTime={currentTime} />
        </SafeAreaView>
    )
}