import { Report } from "@/features/maps/interfaces/get-all-reports-bystander.interface";
import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { GetResponderDetailsResponse, ResponderDetail } from "./interface";

export const responderApi = createApi({
  reducerPath: "responderApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["ResponderDispatch", "ResponderDetails", "ResponderStats"],
  endpoints: (builder) => ({
    getResponderDispatch: builder.query<
      { accident: Report | null; status: string | null },
      string
    >({
      queryFn: async (responderId) => {
        const { data, error } = await supabase
          .from("accident_responses")
          .select("*, accidents(*, accident_images(*))")
          .eq("responder_id", responderId)
          .in("response_type", ["dispatched", "accepted"])
          .order("responded_at", { ascending: false })
          .limit(1)
          .single();

        if (error) return { data: { accident: null, status: null } };

        return {
          data: {
            accident: (data?.accidents as Report) ?? null,
            status: data?.response_type ?? null,
          },
        };
      },

      async onCacheEntryAdded(
        responderId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        await cacheDataLoaded;

        const channel = supabase
          .channel(`dispatch_${responderId}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "accident_responses",
              filter: `responder_id=eq.${responderId}`,
            },
            async (payload) => {
              if (payload.eventType === "DELETE") {
                updateCachedData((draft) => {
                  draft.accident = null;
                });
                return;
              }

              const responseType = payload.new.response_type;
              if (
                responseType !== "dispatched" &&
                responseType !== "accepted"
              ) {
                updateCachedData((draft) => {
                  draft.accident = null;
                });
                return;
              }

              const { data: accident } = await supabase
                .from("accidents")
                .select("*, accident_images(*)")
                .eq("id", payload.new.accident_id)
                .single();

              if (accident) {
                updateCachedData((draft) => {
                  draft.accident = accident as Report;
                  draft.status = payload.new.response_type;
                });
              }
            },
          )
          .subscribe();

        await cacheEntryRemoved;
        supabase.removeChannel(channel);
      },
      providesTags: ["ResponderDispatch"],
    }),

    updateAccidentResponseStatus: builder.mutation<
      { meta: { success: boolean; message: string } },
      { responderId: string; accidentId: string; status: string }
    >({
      queryFn: async ({ responderId, accidentId, status }) => {
        const updateData: Record<string, string> = { response_type: status };

        if (status === "resolved") {
          updateData.resolved_at = new Date().toISOString();
        }

        const { error } = await supabase
          .from("accident_responses")
          .update(updateData)
          .eq("responder_id", responderId)
          .eq("accident_id", accidentId);

        if (error) return { error: { message: error.message } };
        return {
          data: { meta: { success: true, message: "Update Responder Status" } },
        };
      },
      invalidatesTags: ["ResponderStats"],
    }),

    updateAccidentStatus: builder.mutation<
      { meta: { success: boolean; message: string } },
      { accidentId: string; status: string }
    >({
      queryFn: async ({ accidentId, status }) => {
        const { error } = await supabase
          .from("accidents")
          .update({ accident_status: status })
          .eq("id", accidentId);

        if (error) return { error: { message: error.message } };
        return {
          data: { meta: { success: true, message: "Update Accident Status" } },
        };
      },
    }),

    updateResponderAvailability: builder.mutation<
      { meta: { success: boolean; message: string } },
      { responderId: string; is_available: boolean }
    >({
      queryFn: async ({ responderId, is_available }) => {
        const { error } = await supabase
          .from("responder_details")
          .update({ is_available })
          .eq("profile_id", responderId);

        if (error) return { error: { message: error.message } };
        return {
          data: { meta: { success: true, message: "Update Available Status" } },
        };
      },
      invalidatesTags: ["ResponderDetails"],
    }),

    getResponderDetails: builder.query<
      GetResponderDetailsResponse,
      { responderId: string }
    >({
      queryFn: async ({ responderId }) => {
        const { data, error } = await supabase
          .from("responder_details")
          .select("*")
          .eq("profile_id", responderId);

        if (error) return { error: { message: error.message } };
        return {
          data: {
            responderDetails: data as unknown as ResponderDetail[],
            meta: { success: true, message: "Get Responder Details" },
          },
        };
      },
      providesTags: ["ResponderDetails"],
    }),

    getResponderStats: builder.query<
      { total: number; thisMonth: number; avgTime: string },
      string
    >({
      queryFn: async (responderId) => {
        try {
          // 1. Get all resolved responses for this responder
          const { data, error } = await supabase
            .from("accident_responses")
            .select("responded_at, resolved_at")
            .eq("responder_id", responderId)
            .eq("response_type", "resolved");

          if (error) throw error;

          if (!data || data.length === 0) {
            return {
              data: { total: 0, thisMonth: 0, avgTime: "-" },
            };
          }

          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

          let totalResolved = 0;
          let thisMonthResolved = 0;
          let totalTimeMs = 0;
          let countsForAvg = 0;

          data.forEach((res) => {
            totalResolved++;

            if (res.resolved_at) {
              const resolvedDate = new Date(res.resolved_at);
              if (resolvedDate >= startOfMonth) {
                thisMonthResolved++;
              }

              if (res.responded_at) {
                const diff =
                  resolvedDate.getTime() - new Date(res.responded_at).getTime();
                if (diff > 0) {
                  totalTimeMs += diff;
                  countsForAvg++;
                }
              }
            }
          });

          // Calculate average time in minutes
          let avgTimeStr = "-";
          if (countsForAvg > 0) {
            const avgMinutes = Math.round(totalTimeMs / countsForAvg / 60000);
            avgTimeStr = avgMinutes > 0 ? `${avgMinutes}m` : "< 1m";
            if (avgMinutes >= 60) {
              const hours = Math.floor(avgMinutes / 60);
              const mins = avgMinutes % 60;
              avgTimeStr = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
            }
          }

          return {
            data: {
              total: totalResolved,
              thisMonth: thisMonthResolved,
              avgTime: avgTimeStr,
            },
          };
        } catch (error: unknown) {
          const message =
            error instanceof Error
              ? error.message
              : "An unknown error occurred";
          return { error: { message } };
        }
      },
      providesTags: ["ResponderStats"],
    }),
  }),
});

export const {
  useGetResponderDispatchQuery,
  useUpdateAccidentResponseStatusMutation,
  useUpdateAccidentStatusMutation,
  useUpdateResponderAvailabilityMutation,
  useGetResponderDetailsQuery,
  useGetResponderStatsQuery,
} = responderApi;
