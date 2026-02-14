import { authApi } from "@/features/auth/api/authApi";
import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./state/authSlice";
import { mapApi } from "@/features/maps/api/mapApi";
import { adminApi } from "@/features/admin/api/adminApi";

const rootReducer = combineReducers({
  auth: authReducer,

  [authApi.reducerPath]: authApi.reducer,
  [mapApi.reducerPath]: mapApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
});

export const apis = [authApi, mapApi, adminApi];
export const apisReducerPath = apis.map((api) => api.reducerPath);

export default rootReducer;
