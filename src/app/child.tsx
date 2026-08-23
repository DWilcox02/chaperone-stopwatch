import { ChildActivityPicker } from "@/components/child-activity-picker";
import { ScreenShell } from "@/components/screen-shell";
import { useStopwatchSession } from "@/hooks/use-stopwatch-session";

export default function ChildScreen() {
	const { children, currentTime, assignChildActivity } = useStopwatchSession();

	return (
        <ScreenShell keyboardShouldPersistTaps="handled" verticalScrollEnabled={false}>
            <ChildActivityPicker
                children={children}
                currentTime={currentTime}
                onAssignActivity={assignChildActivity}
            />
        </ScreenShell>
	);
}