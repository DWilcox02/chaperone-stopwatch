import { ActivityLogCard } from "@/components/activity-log-card";
import { useStopwatchSession } from "@/hooks/use-stopwatch-session";

export default function LogScreen() {
    const { children } = useStopwatchSession();

    return (
        <ActivityLogCard children={children} />
    )
}