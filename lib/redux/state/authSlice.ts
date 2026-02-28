import { createSlice } from "@reduxjs/toolkit";
import { Session, User } from "@supabase/supabase-js";

interface authState {
  user: User | null;
  session: Session | null;
  redirecting?: boolean;
  isSigningIn?: boolean;
}

export const initialState: authState = {
  user: null,
  session: null,
  redirecting: false,
  isSigningIn: false,
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
      state.isSigningIn = false;
    },
    setClearUserSession: (state) => {
      state.session = null;
      state.user = null;
      state.redirecting = false;
      state.isSigningIn = false;
    },
    setRedirecting: (state, action) => {
      state.redirecting = action.payload;
    },
    setSigningIn: (state, action) => {
      state.isSigningIn = action.payload;
    },
  },
});

export const { setUserSession, setClearUserSession, setRedirecting, setSigningIn } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
