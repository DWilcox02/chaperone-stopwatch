import type { Category, Segment, Child } from "./types";
import type { SFSymbol } from "sf-symbols-typescript";

const categories: {
    name: Category;
    shortName: string;
    icon: SFSymbol;
    color: string;
    darkColor: string;
    prominent: boolean;
}[] = [
    {
        name: "Performance",
        shortName: "Performance",
        icon: "theatermasks.fill",
        color: "#E7684A",
        darkColor: "#B74632",
        prominent: true,
    },
    {
        name: "Rehearsal",
        shortName: "Rehearsal",
        icon: "figure.dance",
        color: "#C47D55",
        darkColor: "#965632",
        prominent: true,
    },
    {
        name: "Standby",
        shortName: "Standby",
        icon: "clock.fill",
        color: "#D89B32",
        darkColor: "#9A690D",
        prominent: true,
    },
    {
        name: "Rest",
        shortName: "Rest",
        icon: "bed.double.fill",
        color: "#5bd526",
        darkColor: "#2E7D18",
        prominent: true,
    },
    { name: "Meal", shortName: "Meal", icon: "fork.knife", color: "#6B8FC9", darkColor: "#3E5E9D", prominent: false },
    { name: "Travel", shortName: "Travel", icon: "car.fill", color: "#7E8B83", darkColor: "#536159", prominent: false },
    {
        name: "Costume",
        shortName: "Costume",
        icon: "tshirt.fill",
        color: "#A879C9",
        darkColor: "#70458F",
        prominent: false,
    },
    {
        name: "Hair & Makeup",
        shortName: "HMU",
        icon: "comb.fill",
        color: "#A879C9",
        darkColor: "#70458F",
        prominent: false,
    },
    {
        name: "Tutoring",
        shortName: "Tutoring",
        icon: "book.fill",
        color: "#4B9B91",
        darkColor: "#276F68",
        prominent: false,
    },
    {
        name: "Wrap",
        shortName: "Wrap",
        icon: "flag.checkered",
        color: "#5E6974",
        darkColor: "#3E4851",
        prominent: false,
    },
];

export default categories;
