import { combineReducers, configureStore } from "@reduxjs/toolkit";
import apiInstance from "./apis/createApiInstance";

const rootReducer = combineReducers({
  [apiInstance.reducerPath]: apiInstance.reducer,
});

const reducer = (state, action) => {
  if (action.type === "logout") {
    state = { theme: state.theme };
  }
  return rootReducer(state, action);
};

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      apiInstance.middleware
    ),
});
