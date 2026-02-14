import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllUsersResponse } from "./interface";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getAllUsers: builder.query<AllUsersResponse, void>({
      queryFn: async () => {
        const { data, error } = await supabase.from("profiles").select("*");
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
    }),
  }),
});

export const { useGetAllUsersQuery } = adminApi;
