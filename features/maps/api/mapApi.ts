import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { ReportsResponse } from "../interface/get-all-reports-bystander.interface";

export const mapApi = createApi({
  reducerPath: "mapApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getAllReportsBystander: builder.query<ReportsResponse, void>({
      queryFn: async () => {
        const { data, error } = await supabase.from("accidents").select("*");

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
    }),
  }),
});

export const { useGetAllReportsBystanderQuery } = mapApi;
