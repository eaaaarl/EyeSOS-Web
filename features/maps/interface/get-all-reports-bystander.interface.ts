export interface Report {
  id: string;
  created_at: string;
  updated_at: string;
  report_number: string;
  severity: "minor" | "moderate" | "major" | string; // adjust if you have fixed values
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
  imageUrl: string[];
  location_accuracy?: string;
  location_quality?: string;
}

export interface ReportsResponse {
  reports: Report[];
  meta: {
    success: boolean;
    message: string;
  };
}
