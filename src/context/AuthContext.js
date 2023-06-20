import React, { useState } from "react";

import { PropTypes } from "prop-types";
import {
  deleteAllCookies,
  getCookie,
  setCookie,
} from "../utils/commonFunctions";
import { useDispatch } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const oldRefToken = getCookie("refresh")
  ? JSON.parse(getCookie("refresh"))
  : false;
const AuthContext = React.createContext({});

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [auth, setAuth] = useState({ refToken: oldRefToken });

  const removeAuth = () => {
    dispatch({ type: "logout" });
    deleteAllCookies();
    setAuth(undefined);
    navigate("/sign-in");
  };
  const addAuth = ({ token, refToken, superToken }) => {
    setCookie("token", token);
    setCookie("refresh", refToken);
    if (superToken) {
      setCookie("superToken", superToken);
    }
    setAuth({ token, refToken });
  };
  const value = {
    authenticated: auth?.token || auth?.refToken,
    setAuth: addAuth,
    removeAuth,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
AuthProvider.propTypes = {
  children: PropTypes.element,
};

export default function useAuth() {
  return React.useContext(AuthContext);
}

export function AuthRedirect({ children, authenticatedRoute = true }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth?.authenticated && authenticatedRoute) {
    return <Navigate to="/log-in" state={{ from: location }} />;
  } else if (auth?.authenticated && !authenticatedRoute) {
    return <Navigate to="/home" state={{ from: location }} />;
  }

  return children;
}
AuthRedirect.propTypes = {
  children: PropTypes.element,
  authenticatedRoute: PropTypes.bool,
};
