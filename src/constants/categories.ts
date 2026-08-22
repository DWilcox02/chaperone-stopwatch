import type { Category, Segment, Child } from "./types";

const categories: { name: Category; shortName: string; color: string; prominent: boolean }[] = [
    { name: "Performance", shortName: "Performance", color: "#E7684A", prominent: true },
    { name: "Rehearsal", shortName: "Rehearsal", color: "#C47D55", prominent: true },
    { name: "Standby", shortName: "Standby", color: "#D89B32", prominent: true },
    { name: "Rest", shortName: "Rest", color: "#5bd526", prominent: true },
    { name: "Meal", shortName: "Meal", color: "#6B8FC9", prominent: false },
    { name: "Travel", shortName: "Travel", color: "#7E8B83", prominent: false },
    { name: "Costume", shortName: "Costume", color: "#A879C9", prominent: false },
    { name: "Hair & Makeup", shortName: "HMU", color: "#A879C9", prominent: false },
    { name: "Tutoring", shortName: "Tutoring", color: "#4B9B91", prominent: false },
    { name: "Wrap", shortName: "Wrap", color: "#5E6974", prominent: false },
];

export default categories;
