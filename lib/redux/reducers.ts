import { authApi } from "@/features/auth/api/authApi";
import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./state/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,

  [authApi.reducerPath]: authApi.reducer,
});

export const apis = [authApi];
export const apisReducerPath = apis.map((api) => api.reducerPath);

export default rootReducer;
