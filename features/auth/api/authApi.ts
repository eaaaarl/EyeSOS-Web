import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { SignInResponse, UserGetProfileQueryResponse } from "./interface";

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

    getUserProfile: builder.query<
      UserGetProfileQueryResponse,
      { user_id: string }
    >({
      queryFn: async ({ user_id }) => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user_id)
          .single();

        if (error) {
          return {
            error: {
              message: error.message,
            },
          };
        }

        return {
          data: {
            profile: data,
            meta: {
              success: true,
              message: "FETCHED",
            },
          },
        };
      },
    }),
  }),
});

export const { useSignInMutation, useGetUserProfileQuery } = authApi;
