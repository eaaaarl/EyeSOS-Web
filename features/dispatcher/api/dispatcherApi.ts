import {
  Report,
  ReportsResponse,
} from "@/features/maps/interfaces/get-all-reports-bystander.interface";
import { supabase } from "@/lib/supabase";
import { fakeBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { AvailableResponders } from "./inteface";

export const dispatcherApi = createApi({
  reducerPath: "dispatcherApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["getAccidents"],
  endpoints: (builder) => ({
    getAllReportsBystander: builder.query<ReportsResponse, void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from("accidents")
          .select("*, accident_images(*)")
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
  }),
});

export const {
  useGetAllReportsBystanderQuery,
  useGetAvailableRespondersQuery,
} = dispatcherApi;
