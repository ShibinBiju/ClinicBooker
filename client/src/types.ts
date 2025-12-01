export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  available_days: number[];
}

export interface Appointment {
  id: string;
  doctor_id: string;
  patient_name: string;
  patient_email: string;
  phone: string;
  age?: string;
  reason?: string;
  appointment_date: string;
  time_slot: string;
  created_at?: string;
  updated_at?: string;
}

export interface InsertAppointment {
  patient_name: string;
  patient_email: string;
  phone: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  age?: string;
  reason?: string;
}
