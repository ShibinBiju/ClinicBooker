import { type Doctor, type InsertAppointment, type Appointment } from "@shared/schema";

const API_BASE = "http://localhost:8000/api";

export async function fetchDoctors(): Promise<Doctor[]> {
  const response = await fetch(`${API_BASE}/doctors`);
  if (!response.ok) {
    throw new Error("Failed to fetch doctors");
  }
  return response.json();
}

export async function checkSlotAvailability(
  doctorId: string,
  date: string,
  timeSlot: string
): Promise<boolean> {
  const params = new URLSearchParams({ doctorId, date, timeSlot });
  const response = await fetch(`${API_BASE}/appointments/check-availability?${params}`);
  if (!response.ok) {
    throw new Error("Failed to check availability");
  }
  const data = await response.json();
  return data.available;
}

export async function createAppointment(
  appointment: InsertAppointment
): Promise<Appointment> {
  const response = await fetch(`${API_BASE}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointment),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create appointment");
  }

  return response.json();
}

export async function getBookedSlots(doctorId: string): Promise<Set<string>> {
  const response = await fetch(`${API_BASE}/appointments/doctor/${doctorId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }
  const appointments: Appointment[] = await response.json();
  
  const bookedSlots = new Set<string>();
  appointments.forEach(apt => {
    bookedSlots.add(`${apt.appointmentDate}-${apt.timeSlot}`);
  });
  
  return bookedSlots;
}
