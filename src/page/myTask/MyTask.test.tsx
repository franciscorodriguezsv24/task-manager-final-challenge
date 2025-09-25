import { screen, waitFor, renderWithApollo } from "../../tests/apolloMock";
import { MyTask } from "./MyTask";
import { TASKS } from "../../api/graphql/queries.graphql";
import { expect, test, vi } from "vitest";

vi.mock("../../store/useEditManager", () => ({
  __esModule: true,
  default: () => ({
    searchCardElement: null,
  }),
}));

vi.mock("../../components/ui/loading/Loading", () => ({
  LoadingComponent: () => <div>Loading...</div>,
}));

vi.mock("../../components/myTask/ListCard/ListCard", () => ({
  // eslint-disable-next-line
  ListCard: ({ task }: any) => <div>{task.name}</div>,
}));

const tasksMock = {
  request: {
    query: TASKS,
    variables: {
      input: { assigneeId: import.meta.env.VITE_PROFILE_ID },
    },
  },
  result: {
    data: {
      tasks: [
        { id: "1", name: "Task 1", status: "todo" },
        { id: "2", name: "Task 2", status: "todo" },
      ],
    },
  },
};

const emptyMock = {
  request: {
    query: TASKS,
    variables: {
      input: { assigneeId: import.meta.env.VITE_PROFILE_ID },
    },
  },
  result: {
    data: {
      tasks: [],
    },
  },
};

test("muestra LoadingComponent mientras carga", () => {
  renderWithApollo(<MyTask />, [tasksMock]);
  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
});

test("muestra No tasks available cuando no hay tareas", async () => {
  renderWithApollo(<MyTask />, [emptyMock]);

  await waitFor(() => {
    expect(screen.getAllByText(/\(0\)/i).length).toBeGreaterThan(0);
  });
});
