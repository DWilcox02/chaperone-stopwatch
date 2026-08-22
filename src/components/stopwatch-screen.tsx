import { ActivityBoard } from "@/components/activity-board";
import { ScreenShell } from "@/components/screen-shell";
import { useStopwatchSession } from "@/hooks/use-stopwatch-session";


export default function StopwatchScreen() {
    const {
        children,
        groups,
        currentTime,
        totalDuration,
        assignChildActivity,
        assignGroupActivity,
        mergeActivity,
        addChildToGroup,
        createGroup,
    } = useStopwatchSession();

    return (
        <ScreenShell>
            <ActivityBoard
                children={children}
                groups={groups}
                currentTime={currentTime}
                totalDuration={totalDuration}
                onAssignChildActivity={assignChildActivity}
                onAssignGroupActivity={assignGroupActivity}
                onMergeActivity={mergeActivity}
                onAddChildToGroup={addChildToGroup}
                onCreateGroup={createGroup}
            />
        </ScreenShell>
    );
}
