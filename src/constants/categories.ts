import type { Category, Segment, Child } from "./types";

const categories: { name: Category; shortName: string; color: string }[] = [
    { name: "Performance", shortName: "Performance", color: "#E7684A" },
    { name: "Rehearsal", shortName: "Rehearsal", color: "#C47D55" },
    { name: "Standby", shortName: "Standby", color: "#D89B32" },
    { name: "Hair & Makeup", shortName: "Hair & makeup", color: "#A879C9" },
    { name: "Tutoring", shortName: "Tutoring", color: "#4B9B91" },
    { name: "Meal", shortName: "Meal", color: "#6B8FC9" },
    { name: "Travel", shortName: "Travel", color: "#7E8B83" },
    { name: "Wrap", shortName: "Wrap", color: "#5E6974" },
];

export default categories;
