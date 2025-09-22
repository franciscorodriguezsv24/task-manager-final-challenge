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

export const GET_POINT_ESTIMATES = gql`
  query GetPointEstimates {
    __type(name: "PointEstimate") {
      enumValues {
        name
      }
    }
  }
`;

export const GET_STATUS = gql`
  query GetStatus {
    __type(name: "Status") {
      enumValues {
        name
      }
    }
  }
`;

export const GET_LABELS_TAGS = gql`
  query GetLabels {
    __type(name: "TaskTag") {
      enumValues {
        name
      }
    }
  }
`;

export const GET_PROFILE = gql`
  query GetProfile {
    profile {
      id
      fullName
      email
      avatar
      type
      createdAt
      updatedAt
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      fullName
      email
      avatar
      type
    }
  }
`;

export const TASKS = gql`
  query GetTasks($input: FilterTaskInput!) {
    tasks(input: $input) {
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

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      assignee {
        id
        fullName
      }
      dueDate
      name
      pointEstimate
      status
      tags
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($input: DeleteTaskInput!) {
    deleteTask(input: $input) {
      id
    }
  }
`;

export const EDIT_TASK = gql`
  mutation EditTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      assignee {
        id
        fullName
      }
      dueDate
      id
      name
      pointEstimate
      status
      tags
    }
  }
`;
