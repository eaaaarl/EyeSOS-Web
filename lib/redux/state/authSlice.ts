import { createSlice } from "@reduxjs/toolkit";
import { Session, User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  name: string;
  email: string;
  mobileNo: string;
  avatarUrl: string;
  user_type: "blgu" | "lgu" | "admin";
  created_at?: string;
  updated_at?: string;
  organizations_id?: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  birthdate?: string;
  bio?: string;
  permanent_address: string;
}

interface authState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
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
