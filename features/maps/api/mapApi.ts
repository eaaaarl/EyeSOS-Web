import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const mapApi = createApi({
  reducerPath: "mapApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["getAccidents"],
  endpoints: (builder) => ({
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
            responderName:
              (data?.profiles as unknown as { name: string })?.name ?? null,
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
              const newRecord = payload.new as { id: string };

              const { data } = await supabase
                .from("accident_responses")
                .select("id, response_type, responder_id, profiles(name)")
                .eq("id", newRecord.id)
                .single();

              if (data) {
                updateCachedData((draft) => {
                  draft.responseType = data.response_type;
                  draft.responderId = data.responder_id;
                  draft.responseId = data.id;
                  draft.responderName =
                    (data.profiles as unknown as { name: string | null } | null)
                      ?.name ?? null;
                });
              }
            },
          )
          .subscribe();

        await cacheEntryRemoved;
        supabase.removeChannel(channel);
      },
    }),
  }),
});

export const { useUpdateResponderLocationMutation, useGetAccidentStatusQuery } =
  mapApi;
