import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import MembershipCard from "../pages/MembershipCard/MembershipCard";
import MembershipProgram from "../pages/MembershipProgram/MembershipProgram";
import Home from "../pages/Home/Home";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Profile from "../pages/Profile/Profile";
import Dashboard from "../pages/Dashboard/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/membership-card",
        element: <MembershipCard />,
      },
      {
        path: "/membership-program",
        element: <MembershipProgram />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/profile",
        element: <Profile />,
      }
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
