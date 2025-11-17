import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({});

export const apis = [];
export const apisReducerPath = apis.map((api) => api.reducerPath);

export default rootReducer;
