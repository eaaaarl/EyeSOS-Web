import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ReportsResponse,
  Report,
} from "../interfaces/get-all-reports-bystander.interface";
import { AvailableResponders, sendAccidentResponse } from "./interface";

export const mapApi = createApi({
  reducerPath: "mapApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["getAccidents"],
  endpoints: (builder) => ({
    getAllReportsBystander: builder.query<ReportsResponse, void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from("accidents")
          .select("*, accident_images(*)");
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
              (payload) => {
                updateCachedData((draft) => {
                  if (payload.eventType === "INSERT") {
                    draft.reports.unshift(payload.new as Report);
                  } else if (payload.eventType === "UPDATE") {
                    const index = draft.reports.findIndex(
                      (r) => r.id === (payload.new as Report).id,
                    );

                    if (index !== -1) {
                      draft.reports[index] = payload.new as Report;
                    }
                  } else if (payload.eventType === "DELETE") {
                    draft.reports = draft.reports.filter(
                      (r) => r.id !== (payload.old as Report).id,
                    );
                  }
                });
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

    sendAccidentResponse: builder.mutation<
      { status: boolean; message: string },
      sendAccidentResponse
    >({
      queryFn: async ({
        accidentId,
        actionTaken,
        responderId,
        responseType,
      }) => {
        const { error } = await supabase.from("accident_responses").insert({
          accident_id: accidentId,
          responder_id: responderId,
          action_taken: actionTaken,
          response_type: responseType,
          response_notes: null,
          responded_at: new Date().toISOString(),
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
            status: true,
            message: "Accident response added.",
          },
        };
      },
      invalidatesTags: ["getAccidents"],
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

    updateResponderLocation: builder.mutation<
      { status: boolean; message: string },
      { userId: string; latitude: number; longitude: number }
    >({
      queryFn: async ({ userId, latitude, longitude }) => {
        const { error } = await supabase
          .from("responder_details")
          .update({
            latitude,
            longitude,
            last_location_updated_at: new Date().toISOString(),
          })
          .eq("profile_id", userId);

        if (error) {
          return {
            error: {
              message: error.message,
            },
          };
        }
        return {
          data: {
            status: true,
            message: "Location updated.",
          },
        };
      },
    }),

    dispatchResponder: builder.mutation<
      void,
      {
        accidentId: string;
        responderId: string;
      }
    >({
      queryFn: async ({ accidentId, responderId }) => {
        const [responseResult, availabilityResult] = await Promise.all([
          supabase.from("accident_responses").insert({
            accident_id: accidentId,
            responder_id: responderId,
            response_type: "dispatched",
            action_taken: "Dispatched by admin",
            responded_at: new Date().toISOString(),
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

        return { data: undefined };
      },
    }),
    getAccidentStatus: builder.query<
      {
        responseType: string | null;
        responderId: string | null;
        responseId: string | null;
        responderName: string | null;
      },
      { accidentId: string }
    >({
      queryFn: async ({ accidentId }) => {
        const { data, error } = await supabase
          .from("accident_responses")
          .select("id, response_type, responder_id, profiles(name)")
          .eq("accident_id", accidentId)
          .order("responded_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) return { error: { message: error.message } };

        return {
          data: {
            responderName: data?.profiles?.name ?? null,
            responseType: data?.response_type ?? null,
            responderId: data?.responder_id ?? null,
            responseId: data?.id ?? null,
          },
        };
      },

      async onCacheEntryAdded(
        { accidentId },
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        await cacheDataLoaded;

        const channel = supabase
          .channel(`accident_response_${accidentId}`)
          .on(
            "postgres_changes",
            {
              event: "*", // INSERT and UPDATE
              schema: "public",
              table: "accident_responses",
              filter: `accident_id=eq.${accidentId}`,
            },
            async (payload) => {
              // Refetch to get the profile and joined data
              const { data } = await supabase
                .from("accident_responses")
                .select("id, response_type, responder_id, profiles(name)")
                .eq("id", payload.new.id)
                .single();

              if (data) {
                updateCachedData((draft) => {
                  draft.responseType = data.response_type;
                  draft.responderId = data.responder_id;
                  draft.responseId = data.id;
                  draft.responderName =
                    (data.profiles as { name: string | null } | null)?.name ??
                    null;
                });
              }
            },
          )
          .subscribe();

        await cacheEntryRemoved;
        supabase.removeChannel(channel);
      },
    }),

    // RESPONDER CONTEXT
    getResponderDispatch: builder.query<{ accident: Report | null }, string>({
      queryFn: async (responderId) => {
        const { data, error } = await supabase
          .from("accident_responses")
          .select("*, accidents(*, accident_images(*))")
          .eq("responder_id", responderId)
          .eq("response_type", "dispatched")
          .order("responded_at", { ascending: false })
          .limit(1)
          .single();

        if (error) return { data: { accident: null } };

        return {
          data: {
            accident: (data?.accidents as Report) ?? null,
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
              event: "INSERT",
              schema: "public",
              table: "accident_responses",
              filter: `responder_id=eq.${responderId}`,
            },
            async (payload) => {
              const { data: accident } = await supabase
                .from("accidents")
                .select("*, accident_images(*)")
                .eq("id", payload.new.accident_id)
                .single();

              if (accident) {
                updateCachedData((draft) => {
                  draft.accident = accident as Report;
                });
              }
            },
          )
          .subscribe();

        await cacheEntryRemoved;
        supabase.removeChannel(channel);
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

    updateAccidentResponseStatus: builder.mutation<
      { meta: { success: boolean; message: string } },
      { responderId: string; accidentId: string; status: string }
    >({
      queryFn: async ({ responderId, accidentId, status }) => {
        const { error } = await supabase
          .from("accident_responses")
          .update({ response_type: status })
          .eq("responder_id", responderId)
          .eq("accident_id", accidentId);

        if (error) return { error: { message: error.message } };
        return {
          data: { meta: { success: true, message: "Update Responder Status" } },
        };
      },
    }),
  }),
});

export const {
  useGetAllReportsBystanderQuery,
  useSendAccidentResponseMutation,
  useGetAvailableRespondersQuery,
  useUpdateResponderLocationMutation,
  useDispatchResponderMutation,
  useGetResponderDispatchQuery,
  useGetAccidentStatusQuery,
  useUpdateResponderAvailabilityMutation,
  useUpdateAccidentStatusMutation,
  useUpdateAccidentResponseStatusMutation,
} = mapApi;
