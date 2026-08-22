import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from "react";

import categories from "@/constants/categories";
import { initialChildren } from "@/constants/children";
import type { Category, Child, Group } from "@/constants/types";

type StopwatchSession = {
    children: Child[];
    groups: Group[];
    currentTime: number;
    totalDuration: number;
    assignChildActivity: (childId: string, category: Category) => void;
    assignGroupActivity: (groupId: string, category: Category) => void;
    mergeActivity: (category: Category) => void;
    addChildToGroup: (childId: string, groupId: string) => void;
    createGroup: (childId: string) => string;
    sessionError: string | null;
    clearSessionError: () => void;
};

const StopwatchSessionContext = createContext<StopwatchSession | null>(null);
const validCategories = new Set<Category>(categories.map((category) => category.name));

type SessionState = { children: Child[]; groups: Group[]; sessionError: string | null };
type SessionAction =
    | { type: "assign-child"; childId: string; category: Category; timestamp: number; groupId: string }
    | { type: "assign-group"; groupId: string; category: Category; timestamp: number }
    | { type: "assign-activity"; childIds: string[]; category: Category; timestamp: number }
    | { type: "merge-activity"; category: Category }
    | { type: "move-child"; childId: string; groupId: string; timestamp: number }
    | { type: "create-group"; childId: string; groupId: string }
    | { type: "error"; message: string }
    | { type: "clear-error" };

function initialState(): SessionState {
    return {
        children: initialChildren,
        groups: initialChildren.map((child, index) => ({
            id: `group-${index + 1}`,
            name: `Group ${index + 1}`,
            childIds: [child.id],
        })),
        sessionError: null,
    };
}

function updateActivity(children: Child[], childIds: string[], category: Category, timestamp: number): Child[] {
    const selectedIds = new Set(childIds);
    return children.map((child) => {
        if (!selectedIds.has(child.id)) return child;
        const activeSegment = child.segments[child.segments.length - 1];
        if (activeSegment?.category === category && activeSegment.endedAt === undefined) return child;
        const segments = activeSegment
            ? [...child.segments.slice(0, -1), { ...activeSegment, endedAt: timestamp }]
            : [];
        return { ...child, segments: [...segments, { category, startedAt: timestamp }] };
    });
}

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
    try {
        if (action.type === "assign-child") {
            if (!validCategories.has(action.category))
                return { ...state, sessionError: "Unable to assign that activity." };
            if (!state.children.some((child) => child.id === action.childId))
                return { ...state, sessionError: "That child is no longer available." };
            const groups = state.groups
                .map((group) => ({ ...group, childIds: group.childIds.filter((id) => id !== action.childId) }))
                .filter((group) => group.childIds.length > 0);
            return {
                ...state,
                children: updateActivity(state.children, [action.childId], action.category, action.timestamp),
                groups: [
                    ...groups,
                    { id: action.groupId, name: `Group ${groups.length + 1}`, childIds: [action.childId] },
                ],
                sessionError: null,
            };
        }
        if (action.type === "assign-group") {
            const group = state.groups.find((candidate) => candidate.id === action.groupId);
            if (!group) return { ...state, sessionError: "That group is no longer available." };
            if (!validCategories.has(action.category))
                return { ...state, sessionError: "Unable to assign that activity." };
            return {
                ...state,
                children: updateActivity(state.children, group.childIds, action.category, action.timestamp),
                sessionError: null,
            };
        }
        if (action.type === "assign-activity") {
            if (!action.childIds.length || !validCategories.has(action.category))
                return { ...state, sessionError: "Unable to assign that activity." };
            const knownIds = new Set(state.children.map((child) => child.id));
            const childIds = action.childIds.filter((childId) => knownIds.has(childId));
            if (!childIds.length) return { ...state, sessionError: "That child is no longer available." };
            return {
                ...state,
                children: updateActivity(state.children, childIds, action.category, action.timestamp),
                sessionError: null,
            };
        }
        if (action.type === "merge-activity") {
            const activityChildIds = state.children
                .filter((child) => child.segments[child.segments.length - 1]?.category === action.category)
                .map((child) => child.id);
            if (activityChildIds.length < 2) return { ...state, sessionError: null };
            const targetGroup = state.groups.find((group) =>
                group.childIds.some((childId) => activityChildIds.includes(childId)),
            );
            if (!targetGroup) return { ...state, sessionError: "Those children are not assigned to a group." };
            const activityIds = new Set(activityChildIds);
            const groups = state.groups
                .map((group) => ({
                    ...group,
                    childIds: group.childIds.filter((childId) => !activityIds.has(childId)),
                }))
                .map((group) =>
                    group.id === targetGroup.id
                        ? { ...group, childIds: [...group.childIds, ...activityChildIds] }
                        : group,
                )
                .filter((group) => group.childIds.length > 0);
            return { ...state, groups, sessionError: null };
        }
        if (action.type === "move-child") {
            const child = state.children.find((candidate) => candidate.id === action.childId);
            const targetGroup = state.groups.find((group) => group.id === action.groupId);
            if (!child || !targetGroup)
                return { ...state, sessionError: "That child or group is no longer available." };
            if (targetGroup.childIds.includes(child.id)) return { ...state, sessionError: null };
            const groups = state.groups
                .map((group) => ({ ...group, childIds: group.childIds.filter((id) => id !== child.id) }))
                .filter((group) => group.childIds.length > 0)
                .map((group) =>
                    group.id === targetGroup.id ? { ...group, childIds: [...group.childIds, child.id] } : group,
                );
            const targetChild = state.children.find((candidate) => targetGroup.childIds.includes(candidate.id));
            const targetCategory = targetChild?.segments[targetChild.segments.length - 1]?.category;
            return {
                ...state,
                groups,
                children: targetCategory
                    ? updateActivity(state.children, [child.id], targetCategory, action.timestamp)
                    : state.children,
                sessionError: null,
            };
        }
        if (action.type === "create-group") {
            if (!state.children.some((child) => child.id === action.childId))
                return { ...state, sessionError: "That child is no longer available." };
            const groups = state.groups
                .map((group) => ({ ...group, childIds: group.childIds.filter((id) => id !== action.childId) }))
                .filter((group) => group.childIds.length > 0);
            return {
                ...state,
                groups: [
                    ...groups,
                    { id: action.groupId, name: `Group ${groups.length + 1}`, childIds: [action.childId] },
                ],
                sessionError: null,
            };
        }
        if (action.type === "error") return { ...state, sessionError: action.message };
        return { ...state, sessionError: null };
    } catch (error) {
        console.error("Stopwatch session update failed", error);
        return { ...state, sessionError: "The stopwatch could not update. Please try again." };
    }
}

function useStopwatchSessionState(): StopwatchSession {
    const [state, dispatch] = useReducer(sessionReducer, undefined, initialState);
    const [currentTime, setCurrentTime] = useReducer((_: number, timestamp: number) => timestamp, Date.now());
    const lastTimestamp = useRef(currentTime);
    const sequence = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            lastTimestamp.current = Math.max(Date.now(), lastTimestamp.current);
            setCurrentTime(lastTimestamp.current);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const nextTimestamp = useCallback(() => {
        lastTimestamp.current = Math.max(Date.now(), lastTimestamp.current + 1);
        setCurrentTime(lastTimestamp.current);
        return lastTimestamp.current;
    }, []);
    const safeDispatch = useCallback((action: SessionAction) => {
        try {
            dispatch(action);
        } catch (error) {
            console.error("Stopwatch session action failed", error);
            dispatch({ type: "error", message: "The stopwatch could not update. Please try again." });
        }
    }, []);
    const assignChildActivity = useCallback(
        (childId: string, category: Category) => {
            safeDispatch({
                type: "assign-child",
                childId,
                category,
                timestamp: nextTimestamp(),
                groupId: `group-${Date.now()}-${sequence.current++}`,
            });
        },
        [nextTimestamp, safeDispatch],
    );
    const assignGroupActivity = useCallback(
        (groupId: string, category: Category) => {
            safeDispatch({ type: "assign-group", groupId, category, timestamp: nextTimestamp() });
        },
        [nextTimestamp, safeDispatch],
    );
    const mergeActivity = useCallback(
        (category: Category) => {
            safeDispatch({ type: "merge-activity", category });
        },
        [safeDispatch],
    );
    const addChildToGroup = useCallback(
        (childId: string, groupId: string) => {
            safeDispatch({ type: "move-child", childId, groupId, timestamp: nextTimestamp() });
        },
        [nextTimestamp, safeDispatch],
    );
    const createGroup = useCallback(
        (childId: string) => {
            const groupId = `group-${Date.now()}-${sequence.current++}`;
            safeDispatch({ type: "create-group", childId, groupId });
            return groupId;
        },
        [safeDispatch],
    );
    const clearSessionError = useCallback(() => dispatch({ type: "clear-error" }), []);
    const totalDuration = useMemo(
        () =>
            state.children.reduce(
                (total, child) =>
                    total +
                    child.segments.reduce(
                        (childTotal, segment) =>
                            childTotal + Math.max(0, (segment.endedAt ?? currentTime) - segment.startedAt),
                        0,
                    ),
                0,
            ),
        [currentTime, state.children],
    );
    return {
        ...state,
        currentTime,
        totalDuration,
        assignChildActivity,
        assignGroupActivity,
        mergeActivity,
        addChildToGroup,
        createGroup,
        clearSessionError,
    };
}

export function StopwatchSessionProvider({ children }: { children: React.ReactNode }) {
    return createElement(StopwatchSessionContext.Provider, { value: useStopwatchSessionState() }, children);
}

export function useStopwatchSession(): StopwatchSession {
    const session = useContext(StopwatchSessionContext);
    if (!session) throw new Error("useStopwatchSession must be used within StopwatchSessionProvider");
    return session;
}
