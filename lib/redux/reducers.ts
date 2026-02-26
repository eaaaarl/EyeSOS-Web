import { authApi } from "@/features/auth/api/authApi";
import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./state/authSlice";
import { mapApi } from "@/features/maps/api/mapApi";
import { adminApi } from "@/features/admin/api/adminApi";
import { notificationReducer } from "./state/notificationSlice";
import { responderApi } from "@/features/responder/api/responderApi";
import { dispatcherApi } from "@/features/dispatcher/api/dispatcherApi";

const rootReducer = combineReducers({
  auth: authReducer,
  notification: notificationReducer,

  [authApi.reducerPath]: authApi.reducer,
  [mapApi.reducerPath]: mapApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [responderApi.reducerPath]: responderApi.reducer,
  [dispatcherApi.reducerPath]: dispatcherApi.reducer,
});

export const apis = [authApi, mapApi, adminApi, responderApi, dispatcherApi];
export const apisReducerPath = apis.map((api) => api.reducerPath);

export default rootReducer;
