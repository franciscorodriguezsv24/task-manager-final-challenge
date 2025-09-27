import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { MockedProvider, type MockedResponse } from "@apollo/client/testing";

export function renderWithApollo(
  ui: React.ReactElement,
  mocks: MockedResponse[] = [],
) {
  return rtlRender(
    <MockedProvider mocks={mocks} addTypename={false}>
      {ui}
    </MockedProvider>,
  );
}

// eslint-disable-next-line
export * from "@testing-library/react";
