import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import styles from "@/constants/styles";

export function ActivityLogHeader() {
    return (
        <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Recent activity</ThemedText>
        </View>
    );
}