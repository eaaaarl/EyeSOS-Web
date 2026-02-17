import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ReportsResponse,
  Report,
} from "../interface/get-all-reports-bystander.interface";

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

        console.log("data: ", JSON.stringify(data));

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
                console.log("Payload", JSON.stringify(payload));

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
            .subscribe((status) => {
              if (status === "SUBSCRIBED") {
                console.log("✅ RTK Query realtime active!");
              }
            });

          await cacheEntryRemoved;

          console.log("🔌 Cleaning up RTK Query realtime");
          supabase.removeChannel(channel);
        } catch (error) {
          console.error("❌ RTK Query realtime error:", error);
        }
      },
    }),
  }),
});

export const { useGetAllReportsBystanderQuery } = mapApi;
