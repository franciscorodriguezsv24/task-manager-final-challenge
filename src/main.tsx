import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Layout } from "./Layout.tsx";
import { Home } from "./page/home/Home.tsx";
import { MyTask } from "./page/myTask/MyTask.tsx";
import { User } from "./page/user/User.tsx";
import { NotFound } from "./page/notFound/NotFound.tsx";
import { ApolloProvider } from "@apollo/client/react";
import client from "./api/ApoloClient.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "my-task",
        element: <MyTask />,
      },
      {
        path: "user-info",
        element: <User />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </StrictMode>,
);
