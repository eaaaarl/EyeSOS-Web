// sendAccidentResponse
export interface sendAccidentResponse {
  accidentId: string;
  actionTaken: string;
  responderId: string;
  responseType: string;
}

// getAvailableResponders
export interface AvailableResponders {
  responders: Responder[];
  meta: {
    success: boolean;
    message: string;
  };
}

export interface Meta {
  success: boolean;
  message: string;
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
}
