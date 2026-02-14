import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllUsersResponse } from "./interface";
import { UserFormValues } from "../components/edit-user-dialog";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["getAllUsers"],
  endpoints: (builder) => ({
    //GET ALL USERS
    getAllUsers: builder.query<AllUsersResponse, void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("updated_at", { ascending: false });

        if (error) {
          return { error: error.message };
        }
        return {
          data: {
            users: data,
            meta: {
              success: true,
              message: "All users fetched.",
            },
          },
        };
      },
      providesTags: ["getAllUsers"],
    }),

    // USERS MUTATIONS UPDATE
    updateUser: builder.mutation<
      unknown,
      { id: string; payload: UserFormValues }
    >({
      queryFn: async ({ id, payload }) => {
        const { data, error } = await supabase
          .from("profiles")
          .update({
            name: payload.name,
            email: payload.email,
            mobileNo: payload.mobileNo,
            bio: payload.bio,
            user_type: payload.user_type,
            permanent_address: payload.permanent_address,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .select()
          .single();
        if (error) {
          return { error: error.message };
        }
        return {
          data: {
            users: data,
            meta: {
              success: true,
              message: "User updated successfully.",
            },
          },
        };
      },
      invalidatesTags: ["getAllUsers"],
    }),
  }),
});

export const { useGetAllUsersQuery, useUpdateUserMutation } = adminApi;
