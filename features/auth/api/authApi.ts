import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { SignInResponse } from "./interface";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    signIn: builder.mutation<
      SignInResponse,
      { email: string; password: string }
    >({
      queryFn: async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          return {
            error: {
              message: error.message,
            },
          };
        }
        return {
          data: {
            user: data.user,
            session: data.session,
            success: true,
            message: "Sign in successfully",
          },
        };
      },
    }),
  }),
});

export const { useSignInMutation } = authApi;
