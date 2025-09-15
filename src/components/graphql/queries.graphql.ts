import { gql } from "@apollo/client";

export const COLUMNS = gql`
  query GetColumns {
    __type(name: "Status") {
      enumValues {
        name
      }
    }
  }
`;

export const TASKS = gql`
  query GetTasks {
    tasks(input: {}) {
      id
      name
      status
      assignee {
        id
        fullName
      }
      dueDate
      pointEstimate
      tags
    }
  }
`;
