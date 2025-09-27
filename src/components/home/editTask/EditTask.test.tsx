import { expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { EditTask } from "./EditTask";
import { renderWithApollo } from "../../../tests/apolloMock";
import {
  GET_LABELS_TAGS,
  GET_POINT_ESTIMATES,
  GET_USERS,
} from "../../../api/graphql/queries.graphql";
import type { MockedResponse } from "@apollo/client/testing";

const mocks: MockedResponse[] = [
  {
    request: { query: GET_USERS },
    result: { data: { users: [{ id: "1", fullName: "testing name" }] } },
  },
  {
    request: { query: GET_POINT_ESTIMATES },
    result: {
      data: { __type: { enumValues: [{ name: "ONE" }, { name: "TWO" }] } },
    },
  },
  {
    request: { query: GET_LABELS_TAGS },
    result: {
      data: { __type: { enumValues: [{ name: "BUG" }, { name: "FEATURE" }] } },
    },
  },
];

vi.mock("../../../hooks/UseMediaQuery", () => ({
  UseMediaQuery: vi.fn(() => false),
}));

const showToastMock = vi.fn();
vi.mock("../../../hooks/UseCustomToast", () => ({
  useCustomToast: () => ({ showToast: showToastMock }),
}));

const selectedCardMock = {
  id: "1",
  name: "Test Task",
  pointEstimate: "ONE",
  assigneeId: { id: "user1" },
  tags: ["REACT"],
  dueDate: new Date("2025-09-24"),
  status: "TODO",
};

vi.mock("../../../store/useEditManager", () => ({
  __esModule: true,
  default: vi.fn(() => ({ selectedCard: selectedCardMock })),
}));

vi.mock("../../../generated/graphql", () => ({
  useGetUsersQuery: vi.fn(() => ({
    loading: false,
    data: { users: [{ id: "user1", fullName: "User 1" }] },
  })),
  useGetPointEstimatesQuery: vi.fn(() => ({
    loading: false,
    data: { __type: { enumValues: [{ name: "ONE" }] } },
  })),
  useGetLabelsQuery: vi.fn(() => ({
    loading: false,
    data: { __type: { enumValues: [{ name: "URGENT" }] } },
  })),
  useGetStatusQuery: vi.fn(() => ({
    loading: false,
    data: { __type: { enumValues: [{ name: "todo" }] } },
  })),
  EDIT_TASK: {},
}));

test("renders EditTask modal with prefilled data", () => {
  const modalRoot = document.createElement("div");
  modalRoot.setAttribute("id", "modal-root");
  document.body.appendChild(modalRoot);

  renderWithApollo(<EditTask onClose={vi.fn()} />, mocks);

  expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();

  expect(screen.getByText("1 points")).toBeInTheDocument();

  expect(screen.getByText("User 1")).toBeInTheDocument();

  expect(screen.getByText("REACT")).toBeInTheDocument();

  expect(screen.getByText("Status")).toBeInTheDocument();

  expect(screen.getByText("Sep. 23 2025")).toBeInTheDocument();

  expect(screen.getByText("Cancel")).toBeInTheDocument();
  expect(screen.getByText("Edit")).toBeInTheDocument();
});

test("Update EditTask create", async () => {
  renderWithApollo(<EditTask onClose={vi.fn()} />, mocks);

  const editButton = screen.getByText("Edit");

  fireEvent.click(editButton);
});
