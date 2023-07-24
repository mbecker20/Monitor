import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout } from "@layouts/layout";
import { Login } from "@pages/auth/login";
import { Signup } from "@pages/auth/signup";
import { Dashboard } from "@pages/dashboard";
import { Server } from "@pages/server";
import { Deployment } from "@pages/deployment";
import { Servers } from "@pages/servers";
import { Deployments } from "@pages/deployments";
import { Builds } from "@pages/builds";
import { Build } from "@pages/build";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },

      {
        path: "deployments",
        children: [
          { path: "", element: <Deployments /> },
          { path: ":deploymentId", element: <Deployment /> },
        ],
      },
      {
        path: "builds",
        children: [
          { path: "", element: <Builds /> },
          { path: ":buildId", element: <Build /> },
        ],
      },
      {
        path: "servers",
        children: [
          { path: "", element: <Servers /> },
          { path: ":serverId", element: <Server /> },
        ],
      },
    ],
  },
]);

const Router = () => <RouterProvider router={router} />;
export default Router;
