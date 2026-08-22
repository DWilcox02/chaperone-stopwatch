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

export type { Category, Segment, Child };
