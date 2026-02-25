import { createSlice } from "@reduxjs/toolkit";

interface notificationState {
  notification: boolean;
}

const initialState: notificationState = {
  notification: false,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
  },
});

export const { setNotification } = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;
