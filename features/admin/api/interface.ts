export interface AllUsersResponse {
  users: UserProfile[];
  meta: Meta;
}

export interface ShowMembersResponse {
  members: Member[];
  meta: Meta;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobileNo: string | null;
  avatarUrl: string | null;
  created_at: string;
  updated_at: string | null;
  user_type: UserType;
  organizations_id: string | null;
  emergency_contact_name: string | null;
  emergency_contact_number: string | null;
  birth_date: string | null;
  bio: string | null;
  permanent_address: string | null;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  mobileNo: string | null;
  avatarUrl: string | null;
  created_at: string;
  updated_at: string | null;
  user_type: UserType;
  organizations_id: string | null;
  emergency_contact_name: string | null;
  emergency_contact_number: string | null;
  birth_date: string | null;
  bio: string | null;
  permanent_address: string | null;
  responder_details: ResponderDetails;
}

export interface ResponderDetails {
  id: string;
  profile_id: string;
  latitude: number | null;
  longitude: number | null;
  is_available: boolean;
  last_location_updated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Meta {
  success: boolean;
  message: string;
}

export type UserType = "bystander" | "lgu" | "admin" | "blgu" | "responder";

export interface AccidentReport {
  id: string;
  created_at: string;
  updated_at: string;
  report_number: string;
  severity: "minor" | "moderate" | "high" | "critical";
  reported_by: string;
  reporter_name: string;
  reporter_contact: string;
  reporter_notes: string;
  latitude: number;
  longitude: number;
  location_address: string;
  barangay: string | null;
  municipality: string | null;
  province: string | null;
  landmark: string | null;
  location_accuracy?: string;
  location_quality?: string;
  accident_status:
    | "NEW"
    | "VERIFIED"
    | "RESOLVED"
    | "DELETED"
    | "IN_PROGRESS"
    | "CLOSED"
    | "PENDING";
  accident_images: AccidentImage[];
  accident_responses: AccidentResponse[];
}

export interface AccidentResponse {
  id: string;
  accident_id: string;
  responder_id: string;
  response_type: string;
  responded_at: string;
  created_at: string;
}

export interface AccidentImage {
  id: string;
  url: string;
  created_at: string;
}

export interface AllAccidentsResponse {
  accidents: AccidentReport[];
  meta: Meta;
}

export interface Team {
  id: string;
  name: string;
  description: string | null;
  status: string;
  leader_id: string | null;
  leader?: Member;
  leader_name?: string; // Derived or joined field
  members_count?: number; // Calculated field
  created_at: string;
  updated_at: string;
}

export interface GetTeamsResponse {
  teams: Team[];
  meta: Meta;
}

export interface AddTeamPayload {
  name: string;
  description?: string;
  status: string;
  leader_id: string;
  member_ids: string[];
}
export interface TeamDetailsResponse {
  team: Team;
  members: Member[];
  meta: Meta;
}

// Historical Accidents

export interface HistoricalAccidentsResponse {
  historical_accidents: HistoricalAccident[];
  meta: Meta;
}

export interface HistoricalAccident {
  id: string;
  date_clean: string;
  time: string;
  time_of_day: string;
  hour: number;
  month: number;
  dayname: string;
  barangay: string;
  incident_type: "Collision" | "Non-Collision";
  lighting: "Day" | "Night" | "Dusk" | "Dawn" | "Unknown";
  road_type:
    | "National Highway"
    | "Provincial Road"
    | "Municipal Road"
    | "Barangay Road"
    | "Private Road"
    | "Unknown";
  weather: "Clear" | "Rainy" | "Cloudy" | "Foggy" | "Unknown";
  motor_vehicles: number;
  motorcycles: number;
  persons_involved: number;
  injured: number;
  fatalities: number;
  severity: "Minor" | "Moderate" | "Fatal" | "Serious";
  responders: string;
  data_source: string;
  created_at: string;
}
