import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Meta,
  AddTeamPayload,
  AccidentReport,
  AllAccidentsResponse,
  GetTeamsResponse,
  ShowMembersResponse,
  AllUsersResponse,
  TeamDetailsResponse,
  UserProfile,
  Team,
} from "./interface";
import { UserFormValues } from "../components/users/edit-user-dialog";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["getAllUsers", "getAllAccidents", "getMembers", "getTeams"],
  endpoints: (builder) => ({
    //GET ALL USERS
    getAllUsers: builder.query<AllUsersResponse, void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("updated_at", { ascending: false });

        if (error) {
          return { error: error.message };
        }
        return {
          data: {
            users: data,
            meta: {
              success: true,
              message: "All users fetched.",
            },
          },
        };
      },
      providesTags: ["getAllUsers"],
    }),

    // USERS MUTATIONS UPDATE
    updateUser: builder.mutation<
      unknown,
      { id: string; payload: UserFormValues }
    >({
      queryFn: async ({ id, payload }) => {
        const { data, error } = await supabase
          .from("profiles")
          .update({
            name: payload.name,
            email: payload.email,
            mobileNo: payload.mobileNo,
            bio: payload.bio,
            user_type: payload.user_type,
            permanent_address: payload.permanent_address,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .select()
          .single();
        if (error) {
          return { error: error.message };
        }
        return {
          data: {
            users: data,
            meta: {
              success: true,
              message: "User updated successfully.",
            },
          },
        };
      },
      invalidatesTags: ["getAllUsers"],
    }),

    // GET ALL ACCIDENTS
    getAllAccidents: builder.query<AllAccidentsResponse, void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from("accidents")
          .select("*, accident_images(*), accident_responses(*)")
          .order("updated_at", { ascending: false });

        if (error) {
          return { error: error.message };
        }

        return {
          data: {
            accidents: data,
            meta: {
              success: true,
              message: "All accidents fetched.",
            },
          },
        };
      },
      providesTags: ["getAllAccidents"],
      async onCacheEntryAdded(
        _arg, // Renamed arg to _arg to indicate it's unused, fixing a lint error
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        try {
          await cacheDataLoaded;
          const channel = supabase
            .channel("admin-accidents-realtime")
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: "accidents" },
              (payload) => {
                updateCachedData((draft) => {
                  if (payload.eventType === "INSERT") {
                    draft.accidents.unshift(payload.new as AccidentReport);
                  } else if (payload.eventType === "UPDATE") {
                    const index = draft.accidents.findIndex(
                      (r) => r.id === (payload.new as AccidentReport).id,
                    );

                    if (index !== -1) {
                      draft.accidents[index] = payload.new as AccidentReport;
                    }
                  } else if (payload.eventType === "DELETE") {
                    draft.accidents = draft.accidents.filter(
                      (r) => r.id !== (payload.old as AccidentReport).id,
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

          supabase.removeChannel(channel);
        } catch (error) {
          console.error("❌ RTK Query realtime error:", error);
        }
      },
    }),

    // admin/teams/add
    // Add Member
    addMember: builder.mutation<
      {
        meta: {
          success: boolean;
          message: string;
        };
      },
      {
        payload: {
          name: string;
          email: string;
          phone: string;
          password: string;
        };
      }
    >({
      queryFn: async ({ payload }) => {
        try {
          const res = await fetch("/api/admin/add-member", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ payload }),
          });

          const data = await res.json();

          if (!res.ok) {
            return { error: data.error || "Failed to add member" };
          }

          return { data };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          return { error: error.message || "An unexpected error occurred" };
        }
      },
      invalidatesTags: ["getMembers"],
    }),

    // admin/teams/add
    // Get Member
    showMembers: builder.query<ShowMembersResponse, void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*, responder_details(*)")
          .eq("user_type", "responder");

        if (error) {
          return {
            error: error.message,
          };
        }

        return {
          data: {
            members: data,
            meta: {
              success: true,
              message: "Get All Available Responder",
            },
          },
        };
      },
      providesTags: ["getMembers"],
    }),

    // Add Team
    addTeam: builder.mutation<{ meta: Meta }, { payload: AddTeamPayload }>({
      queryFn: async ({ payload }) => {
        try {
          // 1. Insert Team
          const { data: teamData, error: teamError } = await supabase
            .from("teams")
            .insert({
              name: payload.name,
              description: payload.description,
              status: payload.status,
              leader_id: payload.leader_id,
            })
            .select()
            .single();

          if (teamError) return { error: teamError.message };

          // 2. Insert Team Members (if any)
          if (payload.member_ids && payload.member_ids.length > 0) {
            const memberInserts = payload.member_ids.map((mid: string) => ({
              team_id: teamData.id,
              member_id: mid,
            }));

            const { error: membersError } = await supabase
              .from("team_members")
              .insert(memberInserts);

            if (membersError) return { error: membersError.message };
          }

          return {
            data: {
              meta: {
                success: true,
                message: "Team and members added successfully.",
              },
            },
          };
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";
          return { error: errorMessage };
        }
      },
      invalidatesTags: ["getMembers"],
    }),

    // Get All Teams
    getTeams: builder.query<GetTeamsResponse, void>({
      queryFn: async () => {
        // Fetch teams with leader name and member count
        const { data, error } = await supabase.from("teams").select(`
            *,
            leader:profiles!leader_id(name),
            members:team_members(count)
          `);

        if (error) return { error: error.message };

        const transformedTeams = (data as unknown[]).map((team) => {
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          const t = team as any;
          return {
            ...t,
            leader_name: t.leader?.name || "N/A",
            members_count: t.members?.[0]?.count || 0,
          };
        });

        return {
          data: {
            teams: transformedTeams,
            meta: {
              success: true,
              message: "Teams fetched successfully.",
            },
          },
        };
      },
      providesTags: ["getTeams"],
    }),

    // Get Responder Team Assignments (Leaders and Members)
    getResponderTeams: builder.query<
      { assignments: Record<string, { teamName: string; role: string }> },
      void
    >({
      queryFn: async () => {
        // 1. Fetch Leaders from teams table
        const { data: leaders, error: leadersError } = await supabase
          .from("teams")
          .select("leader_id, name")
          .not("leader_id", "is", null);

        // 2. Fetch Members from team_members table
        const { data: members, error: membersError } = await supabase.from(
          "team_members",
        ).select(`
            member_id,
            team:teams(name)
          `);

        if (leadersError) return { error: leadersError.message };
        if (membersError) return { error: membersError.message };

        const assignments: Record<string, { teamName: string; role: string }> =
          {};

        // Process Leaders
        (leaders as unknown[]).forEach((item) => {
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          const i = item as any;
          assignments[i.leader_id] = { teamName: i.name, role: "Leader" };
        });

        // Process Members
        (members as unknown[]).forEach((item) => {
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          const i = item as any;
          const mid = i.member_id;
          // Only set as member if not already set as leader
          if (!assignments[mid]) {
            assignments[mid] = {
              teamName: i.team?.name || "Unknown Team",
              role: "Member",
            };
          }
        });

        return { data: { assignments } };
      },
      providesTags: ["getMembers"],
    }),

    // Get Team Details (for modal)
    getTeamDetails: builder.query<TeamDetailsResponse, string>({
      queryFn: async (id) => {
        // 1. Fetch team info with leader name
        const { data: team, error: teamError } = await supabase
          .from("teams")
          .select(
            `
            *,
            leader:profiles!leader_id(name)
          `,
          )
          .eq("id", id)
          .single();

        if (teamError) return { error: teamError.message };

        // 2. Fetch members
        const { data: members, error: membersError } = await supabase
          .from("team_members")
          .select(
            `
            member:profiles(*)
          `,
          )
          .eq("team_id", id);

        if (membersError) return { error: membersError.message };

        const transformedTeam = {
          ...team,
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          leader_name: (team.leader as any)?.name || "N/A",
        };

        const memberProfiles = (members as unknown[]).map((m) => {
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          return (m as any).member;
        });

        return {
          data: {
            team: transformedTeam as Team,
            members: memberProfiles as UserProfile[],
            meta: {
              success: true,
              message: "Team details fetched successfully.",
            },
          },
        };
      },
      providesTags: (result, error, id) => [{ type: "getTeams", id }],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useGetAllAccidentsQuery,
  useAddMemberMutation,
  useShowMembersQuery,
  useAddTeamMutation,
  useGetTeamsQuery,
  useGetResponderTeamsQuery,
  useGetTeamDetailsQuery,
} = adminApi;
