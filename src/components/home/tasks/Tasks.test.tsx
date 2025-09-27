// Tasks.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithApollo, screen } from "../../../tests/apolloMock";
import { Tasks } from "./Tasks";
import * as graphqlHooks from "../../../generated/graphql";

vi.mock("../../ui/loading/Loading", () => ({
  LoadingComponent: () => <div>Loading...</div>,
}));

vi.mock("../../../hooks/UseCustomToast", () => ({
  useCustomToast: () => ({ showToast: vi.fn() }),
}));

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("Tasks component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders loading component when queries are loading", () => {
    vi.spyOn(graphqlHooks, "useGetColumnsQuery").mockReturnValue({
      loading: true,

      // eslint-disable-next-line
    } as any);

    vi.spyOn(graphqlHooks, "useGetTasksQuery").mockReturnValue({
      loading: true,

      // eslint-disable-next-line
    } as any);

    renderWithApollo(<Tasks />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error message when queries fail", () => {
    vi.spyOn(graphqlHooks, "useGetColumnsQuery").mockReturnValue({
      loading: false,
      error: new Error("Columns error"),

      // eslint-disable-next-line
    } as any);

    vi.spyOn(graphqlHooks, "useGetTasksQuery").mockReturnValue({
      loading: false,
      error: new Error("Tasks error"),
      // eslint-disable-next-line
    } as any);

    renderWithApollo(<Tasks />);
    expect(screen.getByText("Unexpected Error")).toBeInTheDocument();
  });
});
