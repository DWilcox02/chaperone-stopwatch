import { fireEvent, render } from "@testing-library/react-native";
import { describe, expect, it, jest } from "@jest/globals";

import categories from "@/constants/categories";
import type { Category, Child, Group } from "@/constants/types";
import { ActivityLogCard } from "../../src/components/activity-log/activity-log-card";
import { ActivityLogHeader } from "../../src/components/activity-log/activity-log-header";
import { ActivityColumn } from "../../src/components/group-activity/activity-column";
import { GroupActivityModal } from "../../src/components/group-activity/group-activity-modal";
import { ChildActivityCard } from "../../src/components/child-activity/child-activity-card";
import { ChildActivityPicker } from "../../src/components/child-activity/child-activity-picker";
import { ChildActivityModal } from "../../src/components/child-activity/child-activity-modal";
import { TotalsCard } from "../../src/components/totals-card";

const child = (overrides: Partial<Child> = {}): Child => ({
    id: "child-1",
    name: "Ava",
    role: "Child",
    color: "#4B9B91",
    segments: [{ category: "Performance", startedAt: 0 }],
    allowedHours: 9,
    ...overrides,
});

const group: Group = { id: "group-1", name: "Group 1", childIds: ["child-1"] };
const performance = categories.find((category) => category.name === "Performance")!;

describe("activity components", () => {
    it("renders child picker columns and sends the selected activity", async () => {
        const onAssignActivity = jest.fn();
        const view = await render(<ChildActivityPicker children={[child()]} currentTime={3_600_000} onAssignActivity={onAssignActivity} />);

        fireEvent.press(view.getByText(performance.shortName));

        expect(view.getByText("Ava")).toBeOnTheScreen();
        expect(onAssignActivity).toHaveBeenCalledWith("child-1", "Performance");
    });

    it("renders active child totals and invokes the child card action", async () => {
        const onPress = jest.fn();
        const view = await render(<ChildActivityCard child={child()} activeSegment={child().segments[0]} category={performance} currentTime={3_600_000} onPress={onPress} />);

        fireEvent.press(view.getByText("Ava"));

        expect(view.getByText("01hrs 00mins / 9hrs")).toBeOnTheScreen();
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("selects a child activity in the modal and closes through the callback", async () => {
        const onAssignActivity = jest.fn();
        const onClose = jest.fn();
        const view = await render(<ChildActivityModal child={child()} children={[child()]} groups={[]} onClose={onClose} onAssignActivity={onAssignActivity} />);

        fireEvent.press(view.getByText(performance.shortName));

        expect(onAssignActivity).toHaveBeenCalledWith("Performance");
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("selects a group activity and reports the group", async () => {
        const onAssignActivity = jest.fn();
        const view = await render(<GroupActivityModal group={group} children={[child()]} onClose={jest.fn()} onAssignActivity={onAssignActivity} />);

        fireEvent.press(view.getByText(performance.shortName));

        expect(onAssignActivity).toHaveBeenCalledWith("Performance");
    });

    it("opens an activity column group card and selects the group", async () => {
        const onSelectGroup = jest.fn();
        const onSelectChild = jest.fn();
        const view = await render(
            <ActivityColumn
                category={performance}
                children={[child()]}
                groups={[group]}
                currentTime={3_600_000}
                onSelectGroup={onSelectGroup}
                onSelectChild={onSelectChild}
                onMergeActivity={jest.fn()}
            />,
        );

        fireEvent.press(view.getByRole("button", { name: "Open group activity options" }));

        expect(onSelectGroup).toHaveBeenCalledWith(group);
    });

    it("filters the log and shows only the selected child", async () => {
        const secondChild = child({ id: "child-2", name: "Ben", segments: [{ category: "Rest", startedAt: 1_000 }] });
        const view = await render(<ActivityLogHeader children={[child(), secondChild]} selectedChildId={null} onSelectChild={jest.fn()} />);
        await fireEvent.press(view.getByRole("button", { name: "Choose a child's activity history" }));
        expect(view.getByText("Ben")).toBeOnTheScreen();
    });

    it("renders recent log entries and category totals", async () => {
        const secondChild = child({ id: "child-2", name: "Ben", segments: [{ category: "Rest", startedAt: 1_000, endedAt: 2_000 }] });
        const view = await render(
            <>
                <ActivityLogCard children={[child(), secondChild]} selectedChildId={null} />
                <TotalsCard children={[child(), secondChild]} currentTime={3_600_000} />
            </>,
        );

        expect(view.getByText("Ava / Performance")).toBeOnTheScreen();
        expect(view.getByText("Ben / Rest")).toBeOnTheScreen();
        expect(view.getByText("1h 00m")).toBeOnTheScreen();
    });
});