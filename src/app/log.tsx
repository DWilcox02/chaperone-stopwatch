import { View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ActivityLogCard } from "@/components/activity-log-card";
import { ScreenShell } from "@/components/screen-shell";
import { useStopwatchSession } from "@/hooks/use-stopwatch-session";
import styles from "@/constants/styles";

export default function LogScreen() {
    const { children } = useStopwatchSession();

    return (
        <ScreenShell>
            <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Recent activity</ThemedText>
            </View>
            <ActivityLogCard children={children} />
        </ScreenShell>
    );
}