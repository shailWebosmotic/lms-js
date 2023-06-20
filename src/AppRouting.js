import React from "react";

import { getCookie } from "./utils/commonFunctions";
import { Navigate, useRoutes } from "react-router-dom";
import { AuthProvider, AuthRedirect } from "./context/AuthContext";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const PublicPageLayout = React.lazy(() => import("./layouts/PublicPageLayout"));
const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));

const Login = React.lazy(() => import("./pages/log-in/LogIn.js"));
const Home = React.lazy(() => import("./pages/home/Home.js"));

export default function AppRouting() {
  const userToken = getCookie("token");

  const defaultNavigate = <Navigate to={userToken ? "./home" : "./log-in"} />;

  const getRouteWrapper = (component, authRoute = true) => {
    return (
      <AuthRedirect authenticatedRoute={authRoute}>
        <React.Suspense
          fallback={
            <Box
              width="100%"
              height="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress />
            </Box>
          }
        >
          {component}
        </React.Suspense>
      </AuthRedirect>
    );
  };

  const routes = [
    {
      path: "/home",
      element: getRouteWrapper(<AuthLayout />),
      children: [
        {
          index: true,
          element: getRouteWrapper(<Home />),
        },
      ],
    },
    {
      path: "/",
      element: getRouteWrapper(<PublicPageLayout />, false),
      children: [
        {
          path: "/log-in",
          element: getRouteWrapper(<Login />, false),
        },

        {
          index: true,
          element: defaultNavigate,
        },
      ],
    },
    {
      path: "*",
      element: defaultNavigate,
    },
  ];

  const routing = useRoutes(routes);

  return (
    <AuthProvider>
      <>{routing}</>
    </AuthProvider>
  );
}
