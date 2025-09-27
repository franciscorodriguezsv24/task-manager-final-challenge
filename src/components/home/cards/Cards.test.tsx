import { render, screen } from "@testing-library/react";
import { Cards } from "./Cards";
import type {
  PointEstimate,
  Status,
  Task,
  TaskTag,
} from "../../../generated/graphql";
import { expect, test } from "vitest";

const taskMock: Task = {
  __typename: "Task",
  id: "123",
  name: "Test Task",
  status: "todo" as Status,
  dueDate: new Date("2025-09-24"),
  pointEstimate: "ONE" as PointEstimate,
  tags: ["REACT"] as TaskTag[],
  position: 0,
  createdAt: new Date("2025-09-23"),
  creator: {
    __typename: "User",
    id: "2",
    avatar: "creator-avatar-url",
    createdAt: new Date(),
    email: "creator@example.com",
    fullName: "Task Creator",
    type: "CANDIDATE",
    updatedAt: new Date(),
  },
  assignee: {
    __typename: "User",
    id: "1",
    avatar: "avatar-url",
    createdAt: new Date(),
    email: "test@example.com",
    fullName: "Test User",
    type: "CANDIDATE",
    updatedAt: new Date(),
  },
};

test("renders task card correctly", () => {
  render(<Cards task={taskMock} />);

  expect(screen.getByText(/Test Task/i)).toBeInTheDocument();
  expect(screen.getByText(/1 Point/i)).toBeInTheDocument();
  expect(screen.getByText(/React/i)).toBeInTheDocument();
  expect(screen.getByText(/Sep. 23 2025/i)).toBeInTheDocument();
});
