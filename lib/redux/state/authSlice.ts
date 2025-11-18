import { createSlice } from "@reduxjs/toolkit";
import { Session, User } from "@supabase/supabase-js";

interface authState {
  user: User | null;
  session: Session | null;
}

export const initialState: authState = {
  user: null,
  session: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserSession: (state, action) => {
      const { user, session } = action.payload;
      state.user = user;
      state.session = session;
    },

    setClearUserSession: (state) => {
      state.session = null;
      state.user = null;
    },
  },
});

export const { setUserSession, setClearUserSession } = authSlice.actions;
export const authReducer = authSlice.reducer;
