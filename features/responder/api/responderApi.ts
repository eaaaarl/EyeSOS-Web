import { Report } from "@/features/maps/interfaces/get-all-reports-bystander.interface";
import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const responderApi = createApi({
  reducerPath: "responderApi",
  baseQuery: fakeBaseQuery(),
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
    }),
  }),
});

export const {
  useGetResponderDispatchQuery,
  useUpdateAccidentResponseStatusMutation,
  useUpdateAccidentStatusMutation,
  useUpdateResponderAvailabilityMutation,
} = responderApi;
