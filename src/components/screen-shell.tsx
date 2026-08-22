import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "@/constants/styles";

type ScreenShellProps = {
    children: ReactNode;
    keyboardShouldPersistTaps?: "always" | "never" | "handled";
    verticalScrollEnabled?: boolean;
};

export function ScreenShell({ children, keyboardShouldPersistTaps, verticalScrollEnabled = true }: ScreenShellProps) {
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                    scrollEnabled={verticalScrollEnabled}
                    showsVerticalScrollIndicator={true}
                >
                    {children}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}