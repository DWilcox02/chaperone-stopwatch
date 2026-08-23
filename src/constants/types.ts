import type { ChildTimeCalculation } from "@/services/child-time";

type Category =
    | "Performance"
    | "Rehearsal"
    | "Standby"
    | "Rest"
    | "Meal"
    | "Travel"
    | "Costume"
    | "Hair & Makeup"
    | "Tutoring"
    | "Wrap";
type Segment = { category: Category; startedAt: number; endedAt?: number };
type Child = {
    id: string;
    name: string;
    role: string;
    color: string;
    segments: Segment[];
    allowedHours: number;
    allowedHoursByCategory?: Partial<Record<Category, number>>;
    time?: ChildTimeCalculation;
};
type Group = {
    id: string;
    name: string;
    childIds: string[];
};

export type { Category, Segment, Child, Group };
