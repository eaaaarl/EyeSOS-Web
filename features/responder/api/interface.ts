export interface GetResponderDetailsResponse {
  responderDetails: ResponderDetail[];
  meta: Meta;
}

export interface ResponderDetail {
  id: string;
  profile_id: string;
  is_available: boolean;
  latitude: number;
  longitude: number;
  last_location_updated_at: string;
  created_at: string;
  updated_at: string;
}

export interface Meta {
  success: boolean;
  message: string;
}
