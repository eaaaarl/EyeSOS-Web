import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ReportsResponse,
  Report,
} from "../interfaces/get-all-reports-bystander.interface";
import { sendAccidentResponse } from "./interface";

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
  }),
});

export const {
  useGetAllReportsBystanderQuery,
  useSendAccidentResponseMutation,
} = mapApi;
