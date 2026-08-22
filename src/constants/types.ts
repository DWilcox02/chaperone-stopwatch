type Category = "Performance" | "Standby" | "Hair & Makeup" | "Tutoring" | "Meal" | "Travel" | "Wrap";
type Segment = { category: Category; startedAt: number; endedAt?: number };
type Child = { id: string; name: string; role: string; color: string; segments: Segment[] };

export type { Category, Segment, Child };
