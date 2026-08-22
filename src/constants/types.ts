type Category = "Performance" | "Rehearsal" | "Standby" | "Hair & Makeup" | "Tutoring" | "Meal" | "Travel" | "Wrap";
type Segment = { category: Category; startedAt: number; endedAt?: number };
type Child = {
    id: string;
    name: string;
    role: string;
    color: string;
    segments: Segment[];
    allowedHours: number;
};
type Group = {
    id: string;
    name: string;
    childIds: string[];
};

export type { Category, Segment, Child, Group };
