import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from "react";

import categories from "@/constants/categories";
import { initialChildren } from "@/constants/children";
import type { Category, Child, Group } from "@/constants/types";
import { type CategoryCode, type DatabaseAdapter, type LogEntry } from "@/services/database";
import { getChildTime } from "@/services/child-time";
import { useDatabase } from "@/services/service-context";
import type { Segment } from "@/constants/types";

type StopwatchSession = {
    children: Child[];
    groups: Group[];
    sessionDate: string;
    currentTime: number;
    totalDuration: number;
    refreshSession: () => Promise<{ children: Child[]; sessionDate: string }>;
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
    | { type: "hydrate"; children: Child[]; groups: Group[] }
    | { type: "update-times"; times: Record<string, Awaited<ReturnType<typeof getChildTime>>> }
    | { type: "assign-child"; childId: string; category: Category; timestamp: number; groupId: string }
    | { type: "assign-group"; groupId: string; category: Category; timestamp: number }
    | { type: "assign-activity"; childIds: string[]; category: Category; timestamp: number }
    | { type: "merge-activity"; category: Category }
    | { type: "move-child"; childId: string; groupId: string; timestamp: number }
    | { type: "create-group"; childId: string; groupId: string }
    | { type: "error"; message: string }
    | { type: "clear-error" };

function initialState(): SessionState {
    return createState(initialChildren);
}

function createState(children: Child[]): SessionState {
    const groups = children.reduce<Group[]>((result, child) => {
        const activeCategory = getActiveCategory(child);
        const existingGroup = activeCategory
            ? result.find((group) => getGroupCategory(group, children) === activeCategory)
            : undefined;
        if (existingGroup) {
            existingGroup.childIds.push(child.id);
        } else {
            result.push({
                id: `group-${result.length + 1}`,
                name: `Group ${result.length + 1}`,
                childIds: [child.id],
            });
        }
        return result;
    }, []);
    return {
        children,
        groups,
        sessionError: null,
    };
}

const ACTIVE_SESSION_ID = "active-session";
const categoryCodesByName: Record<Category, CategoryCode> = {
    Performance: "P",
    Rehearsal: "Rh",
    Standby: "S",
    Rest: "R",
    Meal: "M",
    Travel: "T",
    Costume: "Cs",
    "Hair & Makeup": "HMU",
    Tutoring: "Tt",
    Wrap: "W",
};
const categoryNamesByCode: Record<CategoryCode, Category> = {
    P: "Performance",
    Rh: "Rehearsal",
    S: "Standby",
    R: "Rest",
    C: "Standby",
    M: "Meal",
    T: "Travel",
    Cs: "Costume",
    HMU: "Hair & Makeup",
    Tt: "Tutoring",
    W: "Wrap",
    O: "Rest",
    A: "Standby",
    D: "Wrap",
};

function getPersistedSegments(childId: string, entries: LogEntry[]): Segment[] {
    const childEntries = entries
        .filter((entry) => entry.childId === childId)
        .sort((first, second) => first.timestamp - second.timestamp);
    return childEntries.map((entry, index) => ({
        category: categoryNamesByCode[entry.categoryCode],
        startedAt: entry.timestamp,
        endedAt: childEntries[index + 1]?.timestamp,
    }));
}

async function loadPersistedChildren(database: DatabaseAdapter): Promise<Child[]> {
    if (!(await database.getSession(ACTIVE_SESSION_ID, true))) {
        await database.createSession({ id: ACTIVE_SESSION_ID, date: new Date().toISOString().slice(0, 10) });
    }

    let databaseChildren = await database.listChildren(ACTIVE_SESSION_ID);
    if (!databaseChildren.length) {
        for (const child of initialChildren) {
            await database.createChild({
                id: child.id,
                sessionId: ACTIVE_SESSION_ID,
                name: child.name,
                ageGroup: "9+",
            });
            for (const segment of child.segments) {
                await database.createLogEntry({
                    id: `${child.id}-${segment.startedAt}`,
                    childId: child.id,
                    timestamp: segment.startedAt,
                    categoryCode: categoryCodesByName[segment.category],
                });
            }
        }
        databaseChildren = await database.listChildren(ACTIVE_SESSION_ID);
    }

    const entries = await database.listLogEntries();
    return Promise.all(
        databaseChildren.map(async (databaseChild) => {
            const template = initialChildren.find((child) => child.id === databaseChild.id);
            const time = await getChildTime(databaseChild.id, databaseChild.ageGroup, Date.now(), database);
            return {
                id: databaseChild.id,
                name: databaseChild.name,
                role: template?.role ?? "Child",
                color: template?.color ?? "#4B9B91",
                segments: getPersistedSegments(databaseChild.id, entries),
                allowedHours: time.totalHoursLimit,
                time,
            };
        }),
    );
}

function getActiveCategory(child: Child): Category | undefined {
    return child.segments[child.segments.length - 1]?.category;
}

function getGroupCategory(group: Group, children: Child[]): Category | undefined {
    const groupCategories = group.childIds
        .map((childId) => children.find((child) => child.id === childId))
        .map((child) => child && getActiveCategory(child));
    const category = groupCategories[0];
    return category && groupCategories.every((groupCategory) => groupCategory === category) ? category : undefined;
}

function consolidateActivity(
    children: Child[],
    groups: Group[],
    category: Category,
    childIds: string[],
    preferredGroupId?: string,
): Group[] {
    const activityChildIds = children.filter((child) => getActiveCategory(child) === category).map((child) => child.id);
    const childIdSet = new Set([...childIds, ...activityChildIds]);
    const consolidatedChildIds = [...childIdSet];
    const targetGroup =
        groups.find((group) => group.id === preferredGroupId) ??
        groups.find((group) => getGroupCategory(group, children) === category);
    const groupsWithoutChildren = groups
        .map((group) => ({ ...group, childIds: group.childIds.filter((childId) => !childIdSet.has(childId)) }))
        .filter((group) => group.childIds.length > 0 || group.id === targetGroup?.id);
    const targetId = targetGroup?.id;
    if (!targetId) return groupsWithoutChildren;
    return groupsWithoutChildren.map((group) =>
        group.id === targetId ? { ...group, childIds: [...group.childIds, ...consolidatedChildIds] } : group,
    );
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
        if (action.type === "hydrate") return { children: action.children, groups: action.groups, sessionError: null };
        if (action.type === "update-times") {
            return {
                ...state,
                children: state.children.map((child) => ({ ...child, time: action.times[child.id] ?? child.time })),
            };
        }
        if (action.type === "assign-child") {
            if (!validCategories.has(action.category))
                return { ...state, sessionError: "Unable to assign that activity." };
            if (!state.children.some((child) => child.id === action.childId))
                return { ...state, sessionError: "That child is no longer available." };
            const children = updateActivity(state.children, [action.childId], action.category, action.timestamp);
            const groups = state.groups
                .map((group) => ({ ...group, childIds: group.childIds.filter((id) => id !== action.childId) }))
                .filter((group) => group.childIds.length > 0);
            const existingGroup = groups.find((group) => getGroupCategory(group, children) === action.category);
            return {
                ...state,
                children,
                groups: existingGroup
                    ? consolidateActivity(children, groups, action.category, [action.childId], existingGroup.id)
                    : [
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
            const children = updateActivity(state.children, group.childIds, action.category, action.timestamp);
            return {
                ...state,
                children,
                groups: consolidateActivity(children, state.groups, action.category, group.childIds, group.id),
                sessionError: null,
            };
        }
        if (action.type === "assign-activity") {
            if (!action.childIds.length || !validCategories.has(action.category))
                return { ...state, sessionError: "Unable to assign that activity." };
            const knownIds = new Set(state.children.map((child) => child.id));
            const childIds = action.childIds.filter((childId) => knownIds.has(childId));
            if (!childIds.length) return { ...state, sessionError: "That child is no longer available." };
            const children = updateActivity(state.children, childIds, action.category, action.timestamp);
            return {
                ...state,
                children,
                groups: consolidateActivity(children, state.groups, action.category, childIds),
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
            const groups = consolidateActivity(
                state.children,
                state.groups,
                action.category,
                activityChildIds,
                targetGroup.id,
            );
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
            const targetCategory = getGroupCategory(targetGroup, state.children);
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
            const child = state.children.find((candidate) => candidate.id === action.childId);
            if (!child) return { ...state, sessionError: "That child is no longer available." };
            if (getActiveCategory(child)) return { ...state, sessionError: "Each activity can only have one group." };
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
    const database = useDatabase();
    const [state, dispatch] = useReducer(sessionReducer, undefined, initialState);
    const [sessionDate, setSessionDate] = useReducer(
        (_: string, date: string) => date,
        new Date().toISOString().slice(0, 10),
    );
    const [currentTime, setCurrentTime] = useReducer((_: number, timestamp: number) => timestamp, Date.now());
    const lastTimestamp = useRef(currentTime);
    const sequence = useRef(0);

    const refreshFromDatabase = useCallback(async () => {
        const session = await database.getSession(ACTIVE_SESSION_ID, true);
        const children = await loadPersistedChildren(database);
        const nextSessionDate = session?.date ?? new Date().toISOString().slice(0, 10);
        if (session) setSessionDate(nextSessionDate);
        const nextState = createState(children);
        dispatch({ type: "hydrate", children: nextState.children, groups: nextState.groups });
        return { children: nextState.children, sessionDate: nextSessionDate };
    }, [database]);

    useEffect(() => {
        void refreshFromDatabase().catch((error) => {
            console.error("Unable to load stopwatch data", error);
            dispatch({ type: "error", message: "The stopwatch data could not be loaded." });
        });
    }, [refreshFromDatabase]);

    useEffect(() => {
        if (!state.children.length) return;
        void Promise.all(
            state.children.map(
                async (child) =>
                    [
                        child.id,
                        await getChildTime(child.id, child.time?.ageGroup ?? "9+", currentTime, database),
                    ] as const,
            ),
        )
            .then((results) => {
                dispatch({ type: "update-times", times: Object.fromEntries(results) });
            })
            .catch((error) => console.error("Unable to refresh child time", error));
    }, [currentTime, state.children.length, database]);

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
    const persistActivity = useCallback(
        async (childIds: string[], category: Category) => {
            const timestamp = nextTimestamp();
            await Promise.all(
                childIds.map((childId) =>
                    database.createLogEntry({
                        id: `${childId}-${timestamp}`,
                        childId,
                        timestamp,
                        categoryCode: categoryCodesByName[category],
                    }),
                ),
            );
            await refreshFromDatabase();
        },
        [database, nextTimestamp, refreshFromDatabase],
    );
    const assignChildActivity = useCallback(
        (childId: string, category: Category) => {
            if (state.children.find((child) => child.id === childId)?.segments.at(-1)?.category === category) return;
            void persistActivity([childId], category).catch((error) => {
                console.error("Unable to save child activity", error);
                dispatch({ type: "error", message: "The activity could not be saved." });
            });
        },
        [persistActivity, state.children],
    );
    const assignGroupActivity = useCallback(
        (groupId: string, category: Category) => {
            const group = state.groups.find((candidate) => candidate.id === groupId);
            if (!group) return;
            void persistActivity(
                group.childIds.filter(
                    (childId) =>
                        state.children.find((child) => child.id === childId)?.segments.at(-1)?.category !== category,
                ),
                category,
            ).catch((error) => {
                console.error("Unable to save group activity", error);
                dispatch({ type: "error", message: "The activity could not be saved." });
            });
        },
        [persistActivity, state.children, state.groups],
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
        sessionDate,
        currentTime,
        totalDuration,
        refreshSession: refreshFromDatabase,
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
