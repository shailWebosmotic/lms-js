// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../config";
import {
  getCookie,
  setCookie,
  deleteAllCookies,
} from "../../utils/commonFunctions";

const refreshQuery = fetchBaseQuery({
  baseUrl: config.baseUrl,
  prepareHeaders: (headers) => {
    const token = getCookie("refresh")
      ? JSON.parse(getCookie("refresh"))
      : false;
    if (token) {
      headers.set("x-refresh-token", token);
    }
    return headers;
  },
});

const baseQuery = fetchBaseQuery({
  baseUrl: config.baseUrl,
  prepareHeaders: (headers) => {
    // const token = getState();
    const token = getCookie("token") ? JSON.parse(getCookie("token")) : false;
    // If we have a token set in state, let's assume that we should be passing it.
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const token = getCookie("refresh")
      ? JSON.parse(getCookie("refresh"))
      : false;
    if (token) {
      // try to get a new token
      const { data: refreshResult } = await refreshQuery(
        "/auth/refresh-token",
        api,
        extraOptions
      );
      if (
        refreshResult?.status === 200 &&
        refreshResult?.data &&
        refreshResult?.data?.token &&
        refreshResult?.data?.refToken
      ) {
        // const user = refreshResult.data.user;
        setCookie("token", refreshResult.data.token);
        setCookie("refresh", refreshResult.data.refToken);

        // store the new token
        // api.dispatch(setUserInfo(refreshResult.data.user));
        // retry original query with new token
        return await baseQuery(args, api, extraOptions);
      }
    }
    deleteAllCookies();
    api.dispatch({ type: "logout" });
    window.location = "/log-in";
  }
  if (result.error && result.error.status === 403) {
    console.log("You don not have permission to access", result.error);
  }
  return result;
};
// initialize an empty api service that we'll inject endpoints into later as needed
export const createApiInstance = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});

export default createApiInstance;
