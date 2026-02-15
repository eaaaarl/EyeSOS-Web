import { createSlice } from "@reduxjs/toolkit";
import { Session, User } from "@supabase/supabase-js";

interface authState {
  user: User | null;
  session: Session | null;
  redirecting?: boolean;
}

export const initialState: authState = {
  user: null,
  session: null,
  redirecting: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserSession: (state, action) => {
      const { user, session } = action.payload;
      state.user = user;
      state.session = session;
      state.redirecting = false;
    },
    setClearUserSession: (state) => {
      state.session = null;
      state.user = null;
      state.redirecting = false;
    },
    setRedirecting: (state, action) => {
      state.redirecting = action.payload;
    },
  },
});

export const { setUserSession, setClearUserSession, setRedirecting } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
