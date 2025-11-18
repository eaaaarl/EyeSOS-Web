import { User, AuthTokenResponsePassword } from "@supabase/supabase-js";

export interface SignInResponse {
  user: User;
  session: AuthTokenResponsePassword["data"]["session"];
  success: boolean;
  message: string;
}

export interface UserGetProfileQueryResponse {
  profile: Profile;
  meta: {
    success: boolean;
    message: string;
  };
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  mobileNo: string;
  avatarUrl?: string;
  created_at: string;
}
