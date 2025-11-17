import { User, AuthTokenResponsePassword } from "@supabase/supabase-js";

export interface SignInResponse {
  user: User;
  session: AuthTokenResponsePassword["data"]["session"];
  success: boolean;
  message: string;
}
