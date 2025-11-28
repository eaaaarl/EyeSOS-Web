import { authApi } from "@/features/auth/api/authApi";
import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./state/authSlice";
import { mapApi } from "@/features/maps/api/mapApi";

const rootReducer = combineReducers({
  auth: authReducer,

  [authApi.reducerPath]: authApi.reducer,
  [mapApi.reducerPath]: mapApi.reducer,
});

export const apis = [authApi, mapApi];
export const apisReducerPath = apis.map((api) => api.reducerPath);

export default rootReducer;
