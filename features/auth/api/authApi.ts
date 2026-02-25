import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { SignInResponse, UserGetProfileQueryResponse } from "./interface";
import { supabase } from "@/lib/supabase";

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

        if (data.user) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          if (profileError) {
            return {
              error: {
                message: profileError.message,
              },
            };
          }

          return {
            data: {
              user: data.user,
              session: data.session,
              profile: profileData,
              success: true,
              message: "Sign in successfully",
            },
          };
        }

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

    sendPasswordResetEmail: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      { email: string }
    >({
      queryFn: async ({ email }) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) return { error: { message: error.message } };
        return {
          data: {
            success: true,
            message: "Password reset email sent successfully",
          },
        };
      },
    }),

    updatePassword: builder.mutation<
      { success: boolean; message?: string },
      { password: string }
    >({
      queryFn: async ({ password }) => {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) return { error: { message: error.message } };
        return {
          data: {
            success: true,
            message: "Password updated successfully",
          },
        };
      },
    }),
  }),
});

export const {
  useSignInMutation,
  useGetUserProfileQuery,
  useSendPasswordResetEmailMutation,
  useUpdatePasswordMutation,
} = authApi;
