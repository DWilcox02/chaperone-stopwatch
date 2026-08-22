import type { Category, Segment, Child } from "./types";

const categories: { name: Category; shortName: string; color: string; darkColor: string; prominent: boolean }[] = [
    { name: "Performance", shortName: "Performance", color: "#E7684A", darkColor: "#B74632", prominent: true },
    { name: "Rehearsal", shortName: "Rehearsal", color: "#C47D55", darkColor: "#965632", prominent: true },
    { name: "Standby", shortName: "Standby", color: "#D89B32", darkColor: "#9A690D", prominent: true },
    { name: "Rest", shortName: "Rest", color: "#5bd526", darkColor: "#2E7D18", prominent: true },
    { name: "Meal", shortName: "Meal", color: "#6B8FC9", darkColor: "#3E5E9D", prominent: false },
    { name: "Travel", shortName: "Travel", color: "#7E8B83", darkColor: "#536159", prominent: false },
    { name: "Costume", shortName: "Costume", color: "#A879C9", darkColor: "#70458F", prominent: false },
    { name: "Hair & Makeup", shortName: "HMU", color: "#A879C9", darkColor: "#70458F", prominent: false },
    { name: "Tutoring", shortName: "Tutoring", color: "#4B9B91", darkColor: "#276F68", prominent: false },
    { name: "Wrap", shortName: "Wrap", color: "#5E6974", darkColor: "#3E4851", prominent: false },
];

export default categories;
