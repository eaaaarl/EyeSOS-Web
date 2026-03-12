import {
  Report,
  ReportsResponse,
} from "@/features/maps/interfaces/get-all-reports-bystander.interface";
import { supabase } from "@/lib/supabase";
import { fakeBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  AvailableResponders,
  DispatcherStatsResponse,
  ResponderTeamResponse,
} from "./inteface";

export const dispatcherApi = createApi({
  reducerPath: "dispatcherApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["getAccidents"],
  endpoints: (builder) => ({
    getAllReportsBystander: builder.query<ReportsResponse, void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from("accidents")
          .select("*, accident_images(*), accident_responses(*)")
          .neq("accident_status", "RESOLVED");
        if (error) {
          return {
            error: {
              message: error.message,
            },
          };
        }

        return {
          data: {
            reports: data,
            meta: {
              success: true,
              message: "All reports fetched.",
            },
          },
        };
      },
      providesTags: ["getAccidents"],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        try {
          await cacheDataLoaded;

          const channel = supabase
            .channel("lgu-blgu-accidents-realtime")
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: "accidents" },
              async (payload) => {
                if (payload.eventType === "INSERT") {
                  // Re-fetch the full record with accident_images
                  const { data, error } = await supabase
                    .from("accidents")
                    .select("*, accident_images(*), accident_responses(*)")
                    .eq("id", payload.new.id)
                    .single();

                  if (!error && data) {
                    updateCachedData((draft) => {
                      draft.reports.unshift(data);
                    });
                  }
                } else if (payload.eventType === "UPDATE") {
                  // Same issue — re-fetch on UPDATE too
                  const { data, error } = await supabase
                    .from("accidents")
                    .select("*, accident_images(*), accident_responses(*)")
                    .eq("id", payload.new.id)
                    .single();

                  if (!error && data) {
                    updateCachedData((draft) => {
                      const index = draft.reports.findIndex(
                        (r) => r.id === data.id,
                      );
                      if (index !== -1) {
                        draft.reports[index] = data;
                      } else {
                        draft.reports.unshift(data);
                      }
                    });
                  }
                } else if (payload.eventType === "DELETE") {
                  updateCachedData((draft) => {
                    draft.reports = draft.reports.filter(
                      (r) => r.id !== (payload.old as Report).id,
                    );
                  });
                }
              },
            )
            .subscribe();

          await cacheEntryRemoved;
          supabase.removeChannel(channel);
        } catch (error) {
          console.error("❌ RTK Query realtime error:", error);
        }
      },
    }),

    getAvailableResponders: builder.query<AvailableResponders, void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from("responder_details")
          .select("*, profiles(*)")
          .eq("is_available", true);

        if (error) return { error: { message: error.message } };

        return {
          data: {
            responders: data,
            meta: { success: true, message: "Available responders fetched." },
          },
        };
      },

      async onCacheEntryAdded(
        args,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        // Wait for initial query to finish
        await cacheDataLoaded;

        const channel = supabase
          .channel("responder_details_changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "responder_details",
            },
            async (payload) => {
              if (payload.eventType === "DELETE") {
                updateCachedData((draft) => {
                  draft.responders = draft.responders.filter(
                    (r) => r.id !== payload.old.id,
                  );
                });
              } else {
                // INSERT or UPDATE — refetch to get profiles joined
                const { data } = await supabase
                  .from("responder_details")
                  .select("*, profiles(*)")
                  .eq("is_available", true);

                if (data) {
                  updateCachedData((draft) => {
                    draft.responders = data;
                  });
                }
              }
            },
          )
          .subscribe();

        // Cleanup when cache entry is removed
        await cacheEntryRemoved;
        supabase.removeChannel(channel);
      },
    }),

    getDispatcherStats: builder.query<
      DispatcherStatsResponse,
      { userId: string }
    >({
      queryFn: async ({ userId }) => {
        try {
          const now = new Date();
          const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1,
          ).toISOString();

          // 1. Get all dispatches by this user
          const { data: dispatches, error: dispatchError } = await supabase
            .from("accident_responses")
            .select("accident_id, responded_at")
            .eq("dispatched_by", userId)
            .eq("response_type", "dispatched");

          if (dispatchError) throw dispatchError;

          const totalManaged = dispatches?.length || 0;
          const thisMonth =
            dispatches?.filter((d) => d.responded_at >= startOfMonth).length ||
            0;

          // 2. Get the resolution status for those accidents
          if (totalManaged === 0) {
            return {
              data: {
                stats: { totalManaged: 0, thisMonth: 0, efficiency: null },
                meta: {
                  success: true,
                  message: "No stats found for this dispatcher.",
                },
              },
            };
          }

          const accidentIds = [
            ...new Set(dispatches.map((d) => d.accident_id)),
          ];
          const { data: accidents, error: accidentError } = await supabase
            .from("accidents")
            .select("id, accident_status")
            .in("id", accidentIds);

          if (accidentError) throw accidentError;

          const resolvedCount =
            accidents?.filter((a) => a.accident_status === "RESOLVED").length ||
            0;
          const efficiency = Math.round(
            (resolvedCount / accidentIds.length) * 100,
          );

          return {
            data: {
              stats: {
                totalManaged,
                thisMonth,
                efficiency,
              },
              meta: {
                success: true,
                message: "Dispatcher stats fetched successfully.",
              },
            },
          };
        } catch (error: unknown) {
          return {
            error: {
              message:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch dispatcher stats",
            },
          };
        }
      },
    }),

    dispatchResponder: builder.mutation<
      { meta: { success: boolean; message: string } },
      {
        accidentId: string;
        responderId: string;
        dispatchedBy?: string;
        actionTaken?: string;
      }
    >({
      queryFn: async ({
        accidentId,
        responderId,
        dispatchedBy,
        actionTaken,
      }) => {
        const [responseResult, availabilityResult] = await Promise.all([
          supabase.from("accident_responses").insert({
            accident_id: accidentId,
            responder_id: responderId,
            response_type: "dispatched",
            action_taken: actionTaken || "Dispatched by admin",
            responded_at: new Date().toISOString(),
            dispatched_by: dispatchedBy,
          }),
          supabase
            .from("responder_details")
            .update({ is_available: false })
            .eq("profile_id", responderId),
        ]);

        if (responseResult.error)
          return { error: { message: responseResult.error.message } };
        if (availabilityResult.error)
          return { error: { message: availabilityResult.error.message } };

        return {
          data: { meta: { success: true, message: "Responder dispatched." } },
        };
      },
      invalidatesTags: ["getAccidents"],
    }),

    getResponderTeams: builder.query<ResponderTeamResponse, void>({
      queryFn: async () => {
        try {
          const { data, error } = await supabase
            .from("teams")
            .select(
              "*,leader:profiles!teams_leader_id_fkey(*,leader_info:responder_details(*)), members:team_members(*, profiles(*, responder_info:responder_details(*)))",
            );

          if (error) throw error;

          return {
            data: {
              teams: data || [],
              meta: {
                success: true,
                message: "Responder teams fetched successfully.",
              },
            },
          };
        } catch (error: unknown) {
          return {
            error: {
              message:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch responder teams",
            },
          };
        }
      },
    }),
  }),
});

export const {
  useGetAllReportsBystanderQuery,
  useGetAvailableRespondersQuery,
  useGetDispatcherStatsQuery,
  useDispatchResponderMutation,
  useGetResponderTeamsQuery,
} = dispatcherApi;
