import { ActivityLogCard } from "@/components/activity-log-card";
import { ActivityLogHeader } from "@/components/activity-log-header";
import { ScreenShell } from "@/components/screen-shell";
import { useStopwatchSession } from "@/hooks/use-stopwatch-session";

export default function LogScreen() {
    const { children } = useStopwatchSession();

    return (
        <ScreenShell>
            <ActivityLogHeader />
            <ActivityLogCard children={children} />
        </ScreenShell>
    );
}