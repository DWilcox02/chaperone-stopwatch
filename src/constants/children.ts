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
        name: "Chris",
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
        name: "Malcolm",
        role: "Child 01",
        color: "#E7684A",
        segments: [
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
        name: "Wayne",
        role: "Child 01",
        color: "#E7684A",
        segments: [],
        allowedHours: 9,
    },
    {
        id: "emma",
        name: "Emma",
        role: "Child 01",
        color: "#E7684A",
        segments: [
            {
                category: "Standby",
                startedAt: now - 5 * 60 * 60 * 1000,
                endedAt: now - 4 * 60 * 60 * 1000 - 12 * 60 * 1000,
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
        name: "Casper",
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
        name: "Dan",
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
        name: "Juliette",
        role: "Child 01",
        color: "#E7684A",
        segments: [
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
        name: "Tracey",
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
                endedAt: now - 2 * 60 * 60 * 1000 - 24 * 60 * 1000,
            },
            {
                category: "Performance",
                startedAt: now - 3 * 60 * 60 * 1000 - 24 * 60 * 1000,
                endedAt: now - 48 * 60 * 1000,
            },
            { category: "Tutoring", startedAt: now - 48 * 60 * 1000, endedAt: now - 18 * 60 * 1000 },
        ],
        allowedHours: 9,
    },
    {
        id: "claire",
        name: "Claire",
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
            { category: "Tutoring", startedAt: now - 48 * 60 * 1000, endedAt: now - 18 * 60 * 1000 },
            { category: "Standby", startedAt: now - 18 * 60 * 1000 },
        ],
        allowedHours: 9,
    },
    {
        id: "leslie",
        name: "Leslie",
        role: "Child 01",
        color: "#E7684A",
        segments: [
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
