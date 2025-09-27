import { renderWithApollo, screen } from "../../tests/apolloMock";
import { type MockedResponse } from "@apollo/client/testing";

import { expect, test } from "vitest";
import "@testing-library/jest-dom";
import { Home } from "./Home";
import { GET_USERS } from "../../api/graphql/queries.graphql";

const mocks: MockedResponse[] = [
  {
    request: {
      query: GET_USERS,
      variables: {},
    },
    result: {
      data: {
        users: [{ id: "1", name: "Usuario 1" }],
      },
    },
  },
];

test("render a container filters ", async () => {
  renderWithApollo(<Home />, mocks);

  const filterButtons = screen.getByTestId("action-container");
  expect(filterButtons).toBeInTheDocument();
});

test("render a container tasks", async () => {
  renderWithApollo(<Home />, mocks);

  const taskContainer = screen.getByTestId("action-tasks");
  expect(taskContainer).toBeInTheDocument();
});
