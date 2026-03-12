export interface AvailableResponders {
  responders: Responder[];
  meta: {
    success: boolean;
    message: string;
  };
}

export interface Responder {
  id: string;
  profile_id: string;
  is_available: boolean;
  latitude: number;
  longitude: number;
  last_location_updated_at: Date;
  created_at: Date;
  updated_at: Date;
  profiles: Profiles;
}

export interface Profiles {
  id: string;
  bio: string;
  name: string;
  email: string;
  mobileNo: string;
  avatarUrl: string | null;
  user_type: "lgu" | "blgu" | "admin" | "responder";
  birth_date: Date;
  created_at: Date;
  updated_at: Date | null;
  organizations_id: string | null;
  permanent_address: string;
  emergency_contact_name: string | null;
  emergency_contact_number: string | null;
  responder_info?: ResponderInfo;
}

export interface DispatcherStats {
  totalManaged: number;
  thisMonth: number;
  efficiency: number | null;
}

export interface DispatcherStatsResponse {
  stats: DispatcherStats;
  meta: {
    success: boolean;
    message: string;
  };
}

// responder teams

export interface ResponderTeamResponse {
  teams: ResponderTeam[];
  meta: {
    success: boolean;
    message: string;
  };
}

export interface ResponderTeam {
  id: string;
  name: string;
  description: string;
  status: string;
  leader_id: string;
  created_at: string;
  updated_at: string;
  leader: Leader;
  members: Member[];
}

export interface Leader {
  id: string;
  bio: string;
  name: string;
  email: string;
  mobileNo: string;
  avatarUrl: string;
  user_type: string;
  birth_date: string;
  created_at: string;
  updated_at: string;
  organizations_id: string;
  permanent_address: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  leader_info: LeaderInfo;
}

export interface Member {
  id: string;
  team_id: string;
  profiles: Profiles;
  member_id: string;
  created_at: string;
}

export interface ResponderInfo {
  id: string;
  latitude: number;
  longitude: number;
  created_at: string;
  profile_id: string;
  updated_at: string;
  is_available: boolean;
  last_location_updated_at: string;
}

export interface LeaderInfo {
  id: string;
  latitude: number;
  longitude: number;
  created_at: string;
  profile_id: string;
  updated_at: string;
  is_available: boolean;
  last_location_updated_at: string;
}
