import { useEffect, useMemo, useState } from "react";

import { initialChildren } from "@/constants/children";
import type { Category, Child, Group } from "@/constants/types";

type StopwatchSession = {
    children: Child[];
    groups: Group[];
    currentTime: number;
    totalDuration: number;
    assignChildActivity: (childId: string, category: Category) => void;
    assignGroupActivity: (groupId: string, category: Category) => void;
    addChildToGroup: (childId: string, groupId: string) => void;
    createGroup: (childId: string) => string;
};

export function useStopwatchSession(): StopwatchSession {
    const [children, setChildren] = useState(initialChildren);
    const [groups, setGroups] = useState<Group[]>(() =>
        initialChildren.map((child, index) => ({
            id: `group-${index + 1}`,
            name: `Group ${index + 1}`,
            childIds: [child.id],
        })),
    );
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const totalDuration = useMemo(
        () =>
            children.reduce(
                (total, child) =>
                    total +
                    child.segments.reduce(
                        (childTotal, segment) => childTotal + (segment.endedAt ?? currentTime) - segment.startedAt,
                        0,
                    ),
                0,
            ),
        [children, currentTime],
    );

    function updateChildrenActivity(childIds: string[], category: Category) {
        const timestamp = Date.now();
        setCurrentTime(timestamp);
        setChildren((currentChildren) =>
            currentChildren.map((child) => {
                if (!childIds.includes(child.id)) return child;
                const activeSegment = child.segments[child.segments.length - 1];
                if (activeSegment.category === category) return child;
                return {
                    ...child,
                    segments: [
                        ...child.segments.slice(0, -1),
                        { ...activeSegment, endedAt: timestamp },
                        { category, startedAt: timestamp },
                    ],
                };
            }),
        );
    }

    function assignChildActivity(childId: string, category: Category) {
        setGroups((currentGroups) => {
            const groupsWithoutChild = currentGroups
                .map((group) => ({
                    ...group,
                    childIds: group.childIds.filter((id) => id !== childId),
                }))
                .filter((group) => group.childIds.length > 0);

            return [
                ...groupsWithoutChild,
                { id: `group-${Date.now()}`, name: `Group ${groupsWithoutChild.length + 1}`, childIds: [childId] },
            ];
        });
        updateChildrenActivity([childId], category);
    }

    function assignGroupActivity(groupId: string, category: Category) {
        const group = groups.find((candidate) => candidate.id === groupId);
        if (group) updateChildrenActivity(group.childIds, category);
    }

    function addChildToGroup(childId: string, groupId: string) {
        const targetGroup = groups.find((group) => group.id === groupId);
        if (!targetGroup) return;
        const targetChild = children.find((child) => targetGroup.childIds.includes(child.id));
        setGroups((currentGroups) =>
            currentGroups
                .map((group) => ({
                    ...group,
                    childIds: group.childIds.filter((id) => id !== childId),
                }))
                .filter((group) => group.childIds.length > 0)
                .map((group) => (group.id === groupId ? { ...group, childIds: [...group.childIds, childId] } : group)),
        );
        if (targetChild)
            updateChildrenActivity([childId], targetChild.segments[targetChild.segments.length - 1].category);
    }

    function createGroup(childId: string): string {
        let newGroupId = "";
        setGroups((currentGroups) => {
            const groupsWithoutChild = currentGroups
                .map((group) => ({
                    ...group,
                    childIds: group.childIds.filter((id) => id !== childId),
                }))
                .filter((group) => group.childIds.length > 0);

            newGroupId = `group-${Date.now()}`;
            groupsWithoutChild.push({
                id: newGroupId,
                name: `Group ${currentGroups.length + 1}`,
                childIds: [childId],
            });

            return groupsWithoutChild;
        });
        return newGroupId;
    }

    return {
        children,
        groups,
        currentTime,
        totalDuration,
        assignChildActivity,
        assignGroupActivity,
        addChildToGroup,
        createGroup,
    };
}
