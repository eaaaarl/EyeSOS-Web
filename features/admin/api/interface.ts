export interface AllUsersResponse {
  users: UserProfile[];
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

export interface Meta {
  success: boolean;
  message: string;
}

export type UserType = "bystander" | "lgu" | "admin" | "blgu";

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
  status: string;
  accident_images: AccidentImage[];
}

export interface AccidentImage {
  id: string;
  url: string;
}

export interface AllAccidentsResponse {
  accidents: AccidentReport[];
  meta: Meta;
}
