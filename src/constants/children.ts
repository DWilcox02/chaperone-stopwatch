import { Child } from "./types";
import { now } from "./utils";

const initialChildren: Child[] = [
    {
        id: "emily",
        name: "Emily",
        role: "Child 01",
        color: "#E7684A",
        segments: [
            {
                category: "Standby",
                startedAt: now - 5 * 60 * 60 * 1000,
                endedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
            },
            {
                category: "Hair & Makeup",
                startedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
                endedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
            },
            {
                category: "Performance",
                startedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
                endedAt: now - 48 * 60 * 1000,
            },
            { category: "Tutoring", startedAt: now - 48 * 60 * 1000, endedAt: now - 18 * 60 * 1000 },
            { category: "Standby", startedAt: now - 18 * 60 * 1000 },
        ],
        allowedHours: 9,
    },
    {
        id: "jack",
        name: "Jack",
        role: "Child 02",
        color: "#4B9B91",
        segments: [{ category: "Standby", startedAt: now - 42 * 60 * 1000 }],
        allowedHours: 4,
    },
    {
        id: "chris",
        name: "chris",
        role: "Child 01",
        color: "#E7684A",
        segments: [
            {
                category: "Standby",
                startedAt: now - 5 * 60 * 60 * 1000,
                endedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
            },
            {
                category: "Hair & Makeup",
                startedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
                endedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
            },
            {
                category: "Performance",
                startedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
                endedAt: now - 48 * 60 * 1000,
            },
            { category: "Tutoring", startedAt: now - 48 * 60 * 1000, endedAt: now - 18 * 60 * 1000 },
            { category: "Standby", startedAt: now - 18 * 60 * 1000 },
        ],
        allowedHours: 9,
    },
    {
        id: "malcolm",
        name: "malcolm",
        role: "Child 01",
        color: "#E7684A",
        segments: [
            {
                category: "Standby",
                startedAt: now - 5 * 60 * 60 * 1000,
                endedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
            },
            {
                category: "Hair & Makeup",
                startedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
                endedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
            },
            {
                category: "Performance",
                startedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
                endedAt: now - 48 * 60 * 1000,
            },
            { category: "Tutoring", startedAt: now - 48 * 60 * 1000, endedAt: now - 18 * 60 * 1000 },
            { category: "Standby", startedAt: now - 18 * 60 * 1000 },
        ],
        allowedHours: 9,
    },
    {
        id: "wayne",
        name: "wayne",
        role: "Child 01",
        color: "#E7684A",
        segments: [
            {
                category: "Standby",
                startedAt: now - 5 * 60 * 60 * 1000,
                endedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
            },
            {
                category: "Hair & Makeup",
                startedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
                endedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
            },
            {
                category: "Performance",
                startedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
                endedAt: now - 48 * 60 * 1000,
            },
            { category: "Tutoring", startedAt: now - 48 * 60 * 1000, endedAt: now - 18 * 60 * 1000 },
            { category: "Standby", startedAt: now - 18 * 60 * 1000 },
        ],
        allowedHours: 9,
    },
    {
        id: "emma",
        name: "emma",
        role: "Child 01",
        color: "#E7684A",
        segments: [
            {
                category: "Standby",
                startedAt: now - 5 * 60 * 60 * 1000,
                endedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
            },
            {
                category: "Hair & Makeup",
                startedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
                endedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
            },
            {
                category: "Performance",
                startedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
                endedAt: now - 48 * 60 * 1000,
            },
            { category: "Tutoring", startedAt: now - 48 * 60 * 1000, endedAt: now - 18 * 60 * 1000 },
            { category: "Standby", startedAt: now - 18 * 60 * 1000 },
        ],
        allowedHours: 9,
    },
    {
        id: "casper",
        name: "casper",
        role: "Child 01",
        color: "#E7684A",
        segments: [
            {
                category: "Standby",
                startedAt: now - 5 * 60 * 60 * 1000,
                endedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
            },
            {
                category: "Hair & Makeup",
                startedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
                endedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
            },
            {
                category: "Performance",
                startedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
                endedAt: now - 48 * 60 * 1000,
            },
            { category: "Tutoring", startedAt: now - 48 * 60 * 1000, endedAt: now - 18 * 60 * 1000 },
            { category: "Standby", startedAt: now - 18 * 60 * 1000 },
        ],
        allowedHours: 9,
    },
    {
        id: "dan",
        name: "dan",
        role: "Child 01",
        color: "#E7684A",
        segments: [
            {
                category: "Standby",
                startedAt: now - 5 * 60 * 60 * 1000,
                endedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
            },
            {
                category: "Hair & Makeup",
                startedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
                endedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
            },
            {
                category: "Performance",
                startedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
                endedAt: now - 48 * 60 * 1000,
            },
            { category: "Tutoring", startedAt: now - 48 * 60 * 1000, endedAt: now - 18 * 60 * 1000 },
            { category: "Standby", startedAt: now - 18 * 60 * 1000 },
        ],
        allowedHours: 9,
    },
    {
        id: "juliette",
        name: "juliette",
        role: "Child 01",
        color: "#E7684A",
        segments: [
            {
                category: "Standby",
                startedAt: now - 5 * 60 * 60 * 1000,
                endedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
            },
            {
                category: "Hair & Makeup",
                startedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
                endedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
            },
            {
                category: "Performance",
                startedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
                endedAt: now - 48 * 60 * 1000,
            },
            { category: "Tutoring", startedAt: now - 48 * 60 * 1000, endedAt: now - 18 * 60 * 1000 },
            { category: "Standby", startedAt: now - 18 * 60 * 1000 },
        ],
        allowedHours: 9,
    },
    {
        id: "tracey",
        name: "tracey",
        role: "Child 01",
        color: "#E7684A",
        segments: [
            {
                category: "Standby",
                startedAt: now - 5 * 60 * 60 * 1000,
                endedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
            },
            {
                category: "Hair & Makeup",
                startedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
                endedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
            },
            {
                category: "Performance",
                startedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
                endedAt: now - 48 * 60 * 1000,
            },
            { category: "Tutoring", startedAt: now - 48 * 60 * 1000, endedAt: now - 18 * 60 * 1000 },
            { category: "Standby", startedAt: now - 18 * 60 * 1000 },
        ],
        allowedHours: 9,
    },
    {
        id: "claire",
        name: "claire",
        role: "Child 01",
        color: "#E7684A",
        segments: [
            {
                category: "Standby",
                startedAt: now - 5 * 60 * 60 * 1000,
                endedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
            },
            {
                category: "Hair & Makeup",
                startedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
                endedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
            },
            {
                category: "Performance",
                startedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
                endedAt: now - 48 * 60 * 1000,
            },
            { category: "Tutoring", startedAt: now - 48 * 60 * 1000, endedAt: now - 18 * 60 * 1000 },
            { category: "Standby", startedAt: now - 18 * 60 * 1000 },
        ],
        allowedHours: 9,
    },
    {
        id: "leslie",
        name: "leslie",
        role: "Child 01",
        color: "#E7684A",
        segments: [
            {
                category: "Standby",
                startedAt: now - 5 * 60 * 60 * 1000,
                endedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
            },
            {
                category: "Hair & Makeup",
                startedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
                endedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
            },
            {
                category: "Performance",
                startedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
                endedAt: now - 48 * 60 * 1000,
            },
            { category: "Tutoring", startedAt: now - 48 * 60 * 1000, endedAt: now - 18 * 60 * 1000 },
            { category: "Standby", startedAt: now - 18 * 60 * 1000 },
        ],
        allowedHours: 9,
    },
];

export { initialChildren };
