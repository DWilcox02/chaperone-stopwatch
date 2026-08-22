import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActivityBoard } from "@/components/activity-board";
import { ActivityLogCard } from "@/components/activity-log-card";
import { ThemedText } from "@/components/themed-text";
import styles from "@/constants/styles";
import { useStopwatchSession } from "@/hooks/use-stopwatch-session";


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

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
