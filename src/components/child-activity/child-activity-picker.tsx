import { ScrollView, View } from "react-native";

import { ChildActivityColumn } from "@/components/child-activity/child-activity-column";
import type { Category, Child } from "@/constants/types";
import styles from "@/constants/styles";

type ChildActivityPickerProps = {
    children: Child[];
    currentTime: number;
    onAssignActivity: (childId: string, category: Category) => void;
};

export function ChildActivityPicker({ children, currentTime, onAssignActivity }: ChildActivityPickerProps) {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator bounces={false}>
            <View style={styles.activityTable}>
                <View style={styles.activityColumns}>
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