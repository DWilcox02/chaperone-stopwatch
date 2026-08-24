import { useState } from "react";
import { Pressable, View } from "react-native";
import { SymbolView } from "expo-symbols";

import { ActivityLogCard } from "@/components/activity-log/activity-log-card";
import { ActivityLogHeader } from "@/components/activity-log/activity-log-header";
import { ActivityLogChart } from "@/components/activity-log/activity-log-chart";
import { ScreenShell } from "@/components/screen-shell";
import { useStopwatchSession } from "@/hooks/use-stopwatch-session";
import { useExportServices } from "@/services/service-context";
import styles from "@/constants/styles";
import { ThemedText } from "@/components/themed-text";

export default function LogScreen() {
    const { children, currentTime, sessionDate } = useStopwatchSession();
    const exportServices = useExportServices();
    const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const selectedChild = children.find((child) => child.id === selectedChildId);

    async function handleCsvExport() {
        setIsExporting(true);
        try {
            await exportServices.csv.export(sessionDate);
        } finally {
            setIsExporting(false);
        }
    }

    async function handlePdfExport() {
        if (!selectedChild) return;
        setIsExporting(true);
        try {
            await exportServices.pdf.export(selectedChild.id, selectedChild.name, sessionDate);
        } finally {
            setIsExporting(false);
        }
    }

    return (
        <ScreenShell>
            <View style={styles.exportActions}>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Export session as CSV"
                    disabled={isExporting}
                    onPress={() => void handleCsvExport()}
                    style={({ pressed }) => [styles.exportButton, pressed && styles.pressed, isExporting && styles.exportButtonDisabled]}
                >
                    <SymbolView name="tablecells" size={17} tintColor="#FFFDF9" />
                    <ThemedText style={styles.exportButtonText}>CSV</ThemedText>
                </Pressable>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={selectedChild ? `Export ${selectedChild.name} as PDF` : "Select a child to export a PDF"}
                    disabled={!selectedChild || isExporting}
                    onPress={() => void handlePdfExport()}
                    style={({ pressed }) => [
                        styles.exportButton,
                        styles.exportButtonSecondary,
                        pressed && styles.pressed,
                        (!selectedChild || isExporting) && styles.exportButtonDisabled,
                    ]}
                >
                    <SymbolView name="doc.text" size={17} tintColor="#4B9B91" />
                    <ThemedText style={[styles.exportButtonText, styles.exportButtonSecondaryText]}>PDF</ThemedText>
                </Pressable>
            </View>
            <ActivityLogHeader
                children={children}
                selectedChildId={selectedChildId}
                onSelectChild={setSelectedChildId}
            />
            <ActivityLogCard children={children} selectedChildId={selectedChildId} />
            <ActivityLogChart children={children} selectedChildId={selectedChildId} currentTime={currentTime} />
        </ScreenShell>
    );
}