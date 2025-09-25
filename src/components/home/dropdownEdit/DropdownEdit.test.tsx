import { screen, fireEvent, renderWithApollo } from "../../../tests/apolloMock";
import { expect, test, vi } from "vitest";
import "@testing-library/jest-dom";
import { DropdownEdit } from "./DropdownEdit";
import { DELETE_TASK } from "../../../api/graphql/queries.graphql";

// Mock de DeleteTask para que no ejecute realmente la mutation
vi.mock("../../../store/useEditManager", () => ({
  default: () => ({
    selectCard: vi.fn(),
  }),
}));

const mockTaskElement = {
  id: "1",
  assigneeId: { id: "user1" },
  dueDate: new Date(),
  name: "Test Task",
  pointEstimate: "5",
  status: "BACKLOG",
  tags: [],
};

const mocks = [
  {
    request: { query: DELETE_TASK, variables: { id: "1" } },
    result: { data: { deleteTask: { id: "1" } } },
  },
];

test("opens delete modal from dropdown", async () => {
  const modalRoot = document.createElement("div");
  modalRoot.setAttribute("id", "modal-root");
  document.body.appendChild(modalRoot);
  renderWithApollo(
    <DropdownEdit task={{ id: "1" }} taskElement={mockTaskElement} />,
    mocks,
  );

  const menuButton = screen.getByRole("button");
  fireEvent.click(menuButton);

  const deleteOption = screen.getByText("Delete");
  fireEvent.click(deleteOption);

  expect(await screen.findByText("Delete Task")).toBeInTheDocument();
});
