import { fireEvent, renderWithApollo, screen } from "../../../tests/apolloMock";
import { type MockedResponse } from "@apollo/client/testing";
import { expect, test } from "vitest";
import "@testing-library/jest-dom";
import { CreateTask } from "./CreateTask";
import {
  GET_LABELS_TAGS,
  GET_POINT_ESTIMATES,
  GET_USERS,
} from "../../../api/graphql/queries.graphql";

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

test("render create button", async () => {
  renderWithApollo(<CreateTask />, mocks);

  const addButton = screen.getByRole("button");

  expect(addButton).toBeDisabled();
});

test("render modal component", async () => {
  const modalRoot = document.createElement("div");
  modalRoot.setAttribute("id", "modal-root");
  document.body.appendChild(modalRoot);

  renderWithApollo(<CreateTask />, mocks);

  const addButton = await screen.findByRole("button");

  fireEvent.click(addButton);

  expect(screen.getByRole("button")).toBeInTheDocument();
});
