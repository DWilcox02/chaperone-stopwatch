import { useState } from "react";

import { ActivityLogCard } from "@/components/activity-log-card";
import { ActivityLogHeader } from "@/components/activity-log-header";
import { ScreenShell } from "@/components/screen-shell";
import { useStopwatchSession } from "@/hooks/use-stopwatch-session";

export default function LogScreen() {
    const { children } = useStopwatchSession();
    const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

    return (
        <ScreenShell>
            <ActivityLogHeader
                children={children}
                selectedChildId={selectedChildId}
                onSelectChild={setSelectedChildId}
            />
            <ActivityLogCard children={children} selectedChildId={selectedChildId} />
        </ScreenShell>
    );
}