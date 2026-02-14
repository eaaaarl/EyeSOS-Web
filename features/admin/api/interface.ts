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
