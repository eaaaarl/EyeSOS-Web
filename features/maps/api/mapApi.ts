import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { ReportsResponse } from "../interface/get-all-reports-bystander.interface";

export const mapApi = createApi({
  reducerPath: "mapApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ['getAccidents'],
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
      providesTags:['getAccidents'],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          // Wait for initial data load
          await cacheDataLoaded;

          console.log('✅ Setting up realtime in RTK Query...');

          // Subscribe to changes
          const channel = supabase
            .channel('accidents-rtk')
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'accidents' },
              (payload) => {
                console.log('payload', JSON.stringify(payload))
                console.log('🔴 Realtime event:', payload.eventType);

                // Update cache directly (no refetch needed!)
                updateCachedData((draft) => {
                  if (payload.eventType === 'INSERT') {
                    
                    // Add new incident to cache
                    draft.reports.unshift(payload.new);
                    console.log('✅ Added to cache without refetch!');
                    
                  } else if (payload.eventType === 'UPDATE') {
                    // Update existing incident
                    const index = draft.reports.findIndex(
                      (r) => r.id === payload.new.id
                    );
                    if (index !== -1) {
                      draft.reports[index] = payload.new;
                      console.log('🔄 Updated in cache!');
                    }
                    
                  } else if (payload.eventType === 'DELETE') {
                    // Remove incident
                    draft.reports = draft.reports.filter(
                      (r) => r.id !== payload.old.id
                    );
                    console.log('🗑️ Removed from cache!');
                  }
                });
              }
            )
            .subscribe((status) => {
              if (status === 'SUBSCRIBED') {
                console.log('✅ RTK Query realtime active!');
              }
            });

          // Wait for cleanup
          await cacheEntryRemoved;
          
          // Unsubscribe
          console.log('🔌 Cleaning up RTK Query realtime');
          supabase.removeChannel(channel);
          
        } catch (error) {
          console.error('❌ RTK Query realtime error:', error);
        }
      }
    }),
  }),
});

export const { useGetAllReportsBystanderQuery } = mapApi;
