export interface Appointment {
  _id: string;
  user_id: string;
  service_id: string;
  appointment_date: string;
  status: string;
  userName?: string;
  userEmail?: string;
  serviceName?: string;
}