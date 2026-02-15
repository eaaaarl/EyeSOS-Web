import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AccidentReport,
  AllAccidentsResponse,
  AllUsersResponse,
} from "./interface";
import { UserFormValues } from "../components/users/edit-user-dialog";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["getAllUsers", "getAllAccidents"],
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

    // GET ALL ACCIDENTS
    getAllAccidents: builder.query<AllAccidentsResponse, void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from("accidents")
          .select("*")
          .order("updated_at", { ascending: false });

        if (error) {
          return { error: error.message };
        }

        return {
          data: {
            accidents: data,
            meta: {
              success: true,
              message: "All accidents fetched.",
            },
          },
        };
      },
      providesTags: ["getAllAccidents"],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        try {
          await cacheDataLoaded;
          const channel = supabase
            .channel("admin-accidents-realtime")
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: "accidents" },
              (payload) => {
                console.log("Payload", JSON.stringify(payload));

                updateCachedData((draft) => {
                  if (payload.eventType === "INSERT") {
                    draft.accidents.unshift(payload.new as AccidentReport);
                  } else if (payload.eventType === "UPDATE") {
                    const index = draft.accidents.findIndex(
                      (r) => r.id === (payload.new as AccidentReport).id,
                    );

                    if (index !== -1) {
                      draft.accidents[index] = payload.new as AccidentReport;
                    }
                  } else if (payload.eventType === "DELETE") {
                    draft.accidents = draft.accidents.filter(
                      (r) => r.id !== (payload.old as AccidentReport).id,
                    );
                  }
                });
              },
            )
            .subscribe((status) => {
              if (status === "SUBSCRIBED") {
                console.log("✅ RTK Query realtime active!");
              }
            });

          await cacheEntryRemoved;

          supabase.removeChannel(channel);
        } catch (error) {
          console.error("❌ RTK Query realtime error:", error);
        }
      },
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useGetAllAccidentsQuery,
} = adminApi;
