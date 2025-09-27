import { fireEvent, renderWithApollo, screen } from "../../../tests/apolloMock";
import { expect, test } from "vitest";
import "@testing-library/jest-dom";
import { DeleteTask } from "./DeleteTask";
import type { MockedResponse } from "@apollo/client/testing";
import { DELETE_TASK, TASKS } from "../../../api/graphql/queries.graphql";

const mocks: MockedResponse[] = [
  {
    request: {
      query: TASKS,
      variables: {},
    },
    result: {
      data: {
        task: [{ id: "1", name: "Usuario 1" }],
      },
    },
  },
];
test("render modal delete", () => {
  const modalRoot = document.createElement("div");
  modalRoot.setAttribute("id", "modal-root");
  document.body.appendChild(modalRoot);

  renderWithApollo(<DeleteTask onClose={() => {}} id="123" />, mocks);

  const modalTitle = screen.getByText(/Delete Task/i);
  expect(modalTitle).toBeInTheDocument();

  const deleteButton = screen.getByRole("button", { name: /Delete/i });
  expect(deleteButton).toBeInTheDocument();
});

// Mock para la mutación DELETE_TASK
const mocksDelete: MockedResponse[] = [
  {
    request: {
      query: DELETE_TASK,
      variables: { input: { id: "123" } },
    },
    result: {
      data: { deleteTask: { __typename: "Task", id: "123" } },
    },
  },
];

test("render modal delete and delete task", async () => {
  const modalRoot = document.createElement("div");
  modalRoot.setAttribute("id", "modal-root");
  document.body.appendChild(modalRoot);

  renderWithApollo(<DeleteTask onClose={() => {}} id="123" />, mocksDelete);

  const deleteButton = screen.getByRole("button", { name: /Delete/i });
  fireEvent.click(deleteButton);
});
