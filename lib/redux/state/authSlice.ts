import { createSlice } from "@reduxjs/toolkit";
import { Session, User } from "@supabase/supabase-js";

interface authState {
  user: User | null;
  session: Session | null;
  profile: any | null;
  isLoading: boolean;
}

export const initialState: authState = {
  user: null,
  session: null,
  profile: null,
  isLoading: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserSession: (state, action) => {
      const { user, session, profile } = action.payload;
      state.user = user;
      state.session = session;
      state.profile = profile;
      state.isLoading = false;
    },

    setClearUserSession: (state) => {
      state.session = null;
      state.user = null;
      state.profile = null;
      state.isLoading = false;
    },
  },
});

export const { setUserSession, setClearUserSession } = authSlice.actions;
export const authReducer = authSlice.reducer;
