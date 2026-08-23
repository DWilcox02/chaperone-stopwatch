import { ScrollView, StyleSheet, View } from "react-native";

import { ChildActivityColumn } from "@/components/child-activity-column";
import type { Category, Child } from "@/constants/types";

type ChildActivityPickerProps = {
    children: Child[];
    currentTime: number;
    onAssignActivity: (childId: string, category: Category) => void;
};

const styles = StyleSheet.create({
    table: { flexDirection: "row", marginBottom: 20 },
    columns: { flexDirection: "row", gap: 8 },
});

export function ChildActivityPicker({ children, currentTime, onAssignActivity }: ChildActivityPickerProps) {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator bounces={false}>
            <View style={styles.table}>
                <View style={styles.columns}>
                    {children.map((child) => (
                        <ChildActivityColumn
                            key={child.id}
                            child={child}
                            currentTime={currentTime}
                            onAssignActivity={onAssignActivity}
                        />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}